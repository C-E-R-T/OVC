import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import MyCertCard from "../../components/common/cards/MyCertCard";
import MyWishlistCard, {
  WISHLIST_CARD_TYPE,
  type WishlistCardType,
} from "../../components/common/cards/MyWishlistCard";
import { Award, Bookmark } from "lucide-react";
import Modal from "../../components/common/modal/Modal";
import CertRegisterForm, {
  type CertRegisterFormValues,
} from "../../components/common/forms/CertRegisterForm";
import type { Schedule } from "../../types/exam";
import {
  addMyCert,
  deleteMyCert,
  getMyCerts,
  type MyCertResponse,
} from "../../api/user";
import { deleteFavorite, getFavorites } from "../../api/favorite";
import { getSchedules, getSchedulesByCertificate } from "../../api/schedule";

type CertItem = {
  id: number;
  name: string;
  authority: string;
  certNum?: string;
  passingDate: string;
  expirationDate?: string;
};

const mapMyCertResponse = (cert: MyCertResponse): CertItem => ({
  id: cert.id,
  name: cert.name,
  authority: cert.authority,
  certNum: cert.certNum ?? undefined,
  passingDate: cert.passingDate,
  expirationDate: cert.expirationDate ?? undefined,
});

const toDateOnly = (dateString?: string) => {
  if (!dateString) return null;
  const normalized = dateString.split("T")[0];
  const [year, month, day] = normalized.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const toWishlistCardType = (rawType?: string): WishlistCardType => {
  const type = (rawType ?? "").toUpperCase();
  if (type === WISHLIST_CARD_TYPE.EXAM) return WISHLIST_CARD_TYPE.EXAM;
  if (type === WISHLIST_CARD_TYPE.RESULT) return WISHLIST_CARD_TYPE.RESULT;
  return WISHLIST_CARD_TYPE.APPLY;
};

const getEventPriority = (rawType?: string) => {
  const type = (rawType ?? "").toUpperCase();
  if (type === WISHLIST_CARD_TYPE.EXAM) return 3;
  if (type === WISHLIST_CARD_TYPE.RESULT) return 2;
  if (type === WISHLIST_CARD_TYPE.APPLY) return 1;
  return 0;
};

const getScheduleRange = (schedule: Schedule) => {
  const type = (schedule.eventType ?? "").toUpperCase();
  const startByType =
    type === "APPLY"
      ? schedule.applyStartAt
      : type === "EXAM"
        ? schedule.examStartAt
        : schedule.resultAt;
  const endByType =
    type === "APPLY"
      ? schedule.applyEndAt
      : type === "EXAM"
        ? schedule.examEndAt
        : schedule.resultAt;

  const start = schedule.startDate || startByType;
  const end = schedule.endDate || endByType || start;

  if (!toDateOnly(start) || !toDateOnly(end)) return null;
  return { start, end };
};

const getTodayInProgressSchedules = (schedules: Schedule[]) => {
  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return schedules.filter((schedule) => {
    const range = getScheduleRange(schedule);
    if (!range) return false;
    const start = toDateOnly(range.start);
    const end = toDateOnly(range.end);
    return !!start && !!end && todayOnly >= start && todayOnly <= end;
  });
};

const getRepresentativeSchedule = (schedules: Schedule[]) => {
  if (schedules.length === 0) return null;

  const inProgress = getTodayInProgressSchedules(schedules).sort((a, b) => {
    const aRange = getScheduleRange(a);
    const bRange = getScheduleRange(b);
    if (!aRange || !bRange) return 0;
    const priorityDiff = getEventPriority(b.eventType) - getEventPriority(a.eventType);
    if (priorityDiff !== 0) return priorityDiff;
    const aEnd = toDateOnly(aRange.end);
    const bEnd = toDateOnly(bRange.end);
    if (!aEnd || !bEnd) return 0;
    return aEnd.getTime() - bEnd.getTime();
  });

  if (inProgress.length > 0) return inProgress[0];

  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const upcoming = schedules
    .filter((schedule) => {
      const range = getScheduleRange(schedule);
      if (!range) return false;
      const start = toDateOnly(range.start);
      return !!start && start >= todayOnly;
    })
    .sort((a, b) => {
      const aRange = getScheduleRange(a);
      const bRange = getScheduleRange(b);
      if (!aRange || !bRange) return 0;
      const aStart = toDateOnly(aRange.start);
      const bStart = toDateOnly(bRange.start);
      if (!aStart || !bStart) return 0;
      const startDiff = aStart.getTime() - bStart.getTime();
      if (startDiff !== 0) return startDiff;
      return getEventPriority(b.eventType) - getEventPriority(a.eventType);
    });

  if (upcoming.length > 0) return upcoming[0];
  return null;
};

const getActiveStatuses = (schedules: Schedule[]) => {
  const inProgress = getTodayInProgressSchedules(schedules);
  const unique = Array.from(
    new Set(inProgress.map((schedule) => toWishlistCardType(schedule.eventType))),
  );
  return unique.sort((a, b) => getEventPriority(b) - getEventPriority(a));
};

function CertManage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const nextMonthDate = new Date(currentYear, now.getMonth() + 1, 1);
  const nextYear = nextMonthDate.getFullYear();
  const nextMonth = nextMonthDate.getMonth() + 1;

  //찜 목록 데이터를 가져옴
  const {data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites
  });

  const favoriteScheduleMapQuery = useQuery({
    queryKey: ["favoriteScheduleMap", currentYear, favorites.map((item) => item.certId)],
    queryFn: async () => {
      const entries = await Promise.all(
        favorites.map(async (item) => {
          try {
            const schedules = await getSchedulesByCertificate(item.certId, currentYear);
            return [item.certId, schedules] as const;
          } catch {
            return [item.certId, []] as const;
          }
        }),
      );

      return Object.fromEntries(entries) as Record<number, Schedule[]>;
    },
    enabled: favorites.length > 0,
  });

  const monthlySchedulePoolQuery = useQuery({
    queryKey: ["wishlistSchedulePool", currentYear, currentMonth, nextYear, nextMonth],
    queryFn: async () => {
      const [currentMonthSchedules, nextMonthSchedules] = await Promise.all([
        getSchedules(currentYear, currentMonth),
        getSchedules(nextYear, nextMonth),
      ]);
      return [...currentMonthSchedules, ...nextMonthSchedules];
    },
  });

  const {
    data: myCerts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myCerts"],
    queryFn: getMyCerts,
    // 토큰 조건으로 조회를 제한하려면 enabled 옵션을 다시 활성화하면 된다.
    retry: false, // 인증 이슈 시 과도한 재시도 방지
  });

  console.log("favorites 데이터:", favorites);

  const certList = myCerts.map(mapMyCertResponse);

  const addMyCertMutation = useMutation({
    mutationFn: async (values: CertRegisterFormValues) => {
      if (!values.certId) {
        throw new Error("CERT_NOT_SELECTED");
      }

      await addMyCert(values.certId, {
        certNum: values.certNum?.trim() || undefined,
        certNumber: values.certNum?.trim() || undefined,
        passingDate: values.passingDate,
        passedAt: values.passingDate,
        expirationDate: values.expirationDate?.trim() || undefined,
        expiredAt: values.expirationDate?.trim() || undefined,
        authority: values.authority.trim(),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["myCerts"] });
    },
  });

  const deleteMyCertMutation = useMutation({
    mutationFn: (certId: number) => deleteMyCert(certId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["myCerts"] });
    },
  });

  const handleCreateCert = async (values: CertRegisterFormValues) => {
    try {
      await addMyCertMutation.mutateAsync(values);
    } catch (error) {
      if (error instanceof Error && error.message === "CERT_NOT_SELECTED") {
        alert("자격증을 목록에서 선택해주세요.");
      } else if (isAxiosError(error) && error.response?.status === 409) {
        // 409(중복 등록)은 실패가 아니라 이미 완료된 상태로 간주
        await queryClient.invalidateQueries({ queryKey: ["myCerts"] });
        alert("이미 등록된 자격증입니다. 등록 완료 상태로 처리됩니다.");
        return;
      } else {
        alert("자격증 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
      throw error;
    }
  };

  const handleDeleteCert = async (cert: CertItem) => {
    try {
      await deleteMyCertMutation.mutateAsync(cert.id);
    } catch (error) {
      console.error("자격증 삭제 실패", error);
      alert("자격증 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const deleteFavoriteMutation = useMutation({
  mutationFn: (certId: number) => deleteFavorite(certId),

  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ["favorites"] });
  }
});

  return (
    <div className="p-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold">내 자격증</h1>
          <p className="mb-8 text-gray-500">
            전문적인 성과를 관리하고 향후 학습 목표를 추적하세요.
          </p>
        </div>

        <button
          type="button"
          className="rounded-xl bg-green-700 px-4 py-2 font-semibold text-white"
          onClick={() => setIsModalOpen(true)}
        >
          내 자격증 등록
        </button>
      </div>

      <div className="flex w-full gap-6">
        <section className="w-[40%] rounded-2xl bg-[#F6F7F7] p-4 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <p className="font-semibold">취득한 자격증</p>
            </div>
            <div className="rounded-xl bg-gray-300 px-3 py-1 text-sm text-gray-600">
              {certList.length}개 취득 완료
            </div>
          </div>

          {isLoading ? (
            <p className="text-sm text-gray-500">자격증 목록을 불러오는 중입니다...</p>
          ) : isError ? (
            <p className="text-sm text-red-500">자격증 목록 조회에 실패했습니다.</p>
          ) : (
            <div className="space-y-4">
              {certList.map((cert, index) => (
                <MyCertCard
                  key={`${cert.id}-${cert.certNum ?? "no-cert-num"}-${cert.passingDate}-${index}`}
                  name={cert.name}
                  authority={cert.authority}
                  certNum={cert.certNum || "-"}
                  passingDate={cert.passingDate}
                  expirationDate={cert.expirationDate || "-"}
                  onDelete={() => void handleDeleteCert(cert)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="w-[60%] rounded-2xl bg-[#F6F7F7] p-4 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5" />
              <p className="font-semibold">내 찜 목록</p>
            </div>
          </div>
          <div className="flex justify-center"></div>
          <div className="grid grid-cols-2 gap-6 mx-auto max-w-[1000px]">
            {favorites.map((item) => {
              const byCertApi = favoriteScheduleMapQuery.data?.[item.certId] ?? [];
              const byMonthPool = (monthlySchedulePoolQuery.data ?? []).filter(
                (schedule) => schedule.certId === item.certId,
              );
              const scheduleMap = new Map<string, Schedule>();
              [...byCertApi, ...byMonthPool].forEach((schedule) => {
                scheduleMap.set(`${schedule.scheduleId}-${schedule.eventType}`, schedule);
              });
              const schedules = Array.from(scheduleMap.values());

              const representative = getRepresentativeSchedule(schedules);
              const representativeRange = representative ? getScheduleRange(representative) : null;
              const activeStatuses = getActiveStatuses(schedules);

              const type = representative
                ? toWishlistCardType(representative.eventType)
                : toWishlistCardType(item.type ?? item.eventType ?? item.examType);

              return (
                <MyWishlistCard
                  key={item.certId}
                  type={type}
                  title={item.title}
                  startDate={representativeRange?.start ?? item.startDate}
                  endDate={representativeRange?.end ?? item.endDate}
                  activeStatuses={activeStatuses}
                  onDelete={() => deleteFavoriteMutation.mutate(item.certId)}
                />
              );
            })}
          </div>
        </section>
      </div>
      <Modal
        isOpen={isModalOpen}
        title="자격증 등록"
        onClose={() => setIsModalOpen(false)}
      >
        <CertRegisterForm
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateCert}
          isSubmitting={addMyCertMutation.isPending}
        />
      </Modal>
    </div>
  );
}

export default CertManage;
