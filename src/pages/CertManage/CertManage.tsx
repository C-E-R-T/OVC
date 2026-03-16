import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import MyCertCard from "../../components/common/cards/MyCertCard";
import MyWishlistCard, {
  WISHLIST_CARD_TYPE,
  type WishlistCardType,
} from "../../components/common/cards/MyWishlistCard";
import Modal from "../../components/common/modal/Modal";
import CertRegisterForm, {
  type CertRegisterFormValues,
} from "../../components/common/forms/CertRegisterForm";
import {
  addMyCert,
  deleteMyCert,
  getMyCerts,
  type MyCertResponse,
} from "../../api/user";
import { deleteFavorite, getFavorites } from "../../api/favorite";
import { getSchedules, getSchedulesByCertificate } from "../../api/schedule";
import type { Schedule } from "../../types/exam";

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

// 우선순위: RESULT > EXAM > APPLY
const getEventPriority = (rawType?: string) => {
  const type = (rawType ?? "").toUpperCase();
  if (type === WISHLIST_CARD_TYPE.RESULT) return 3;
  if (type === WISHLIST_CARD_TYPE.EXAM) return 2;
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

  // 1순위: 오늘 진행 중인 일정에서 우선순위 높은 일정
  const inProgress = getTodayInProgressSchedules(schedules).sort((a, b) => {
    const priorityDiff = getEventPriority(b.eventType) - getEventPriority(a.eventType);
    if (priorityDiff !== 0) return priorityDiff;

    const aRange = getScheduleRange(a);
    const bRange = getScheduleRange(b);
    if (!aRange || !bRange) return 0;

    const aEnd = toDateOnly(aRange.end);
    const bEnd = toDateOnly(bRange.end);
    if (!aEnd || !bEnd) return 0;
    return aEnd.getTime() - bEnd.getTime();
  });

  if (inProgress.length > 0) return inProgress[0];

  // 2순위: 예정 일정 중 가장 빠른 시작일, 동률이면 우선순위 높은 일정
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
  // 겹쳐 있는(오늘 진행 중) 일정은 태그를 동시에 노출
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

  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
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
    retry: false,
  });

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
      setIsModalOpen(false);
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
    },
  });

  return (
    <div className="min-h-screen px-6 pb-12 pt-30">
      <div className="mx-auto w-full max-w-[1440px]">
        <section className="mb-6 p-8 h-full">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-gray">
                MY CERTIFICATIONS
              </p>
              <h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-900">
                자격증 관리
              </h1>
              <p className="max-w-2xl text-base leading-7 text-gray-500">
                취득한 자격증과 관심 자격증을 한 곳에서 정리하고,
                학습 목표와 준비 현황을 체계적으로 관리하세요.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-fit items-center justify-center rounded-full bg-gray-900 px-8 py-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primaryDark"
              onClick={() => setIsModalOpen(true)}
            >
              내 자격증 등록
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_1fr]">
          <div className="h-full rounded-[32px] border border-white/70 bg-white/40 p-8 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold tracking-[0.14em] text-gray">
                  ACQUIRED
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  취득한 자격증
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  이미 취득한 자격증의 발급기관, 취득일, 만료일을 확인할 수 있습니다.
                </p>
              </div>

              <div className="inline-flex rounded-full border border-primary/10 bg-primarySoft/55 px-4 py-2 text-sm font-semibold text-gray">
                {certList.length}개 취득 완료
              </div>
            </div>

            {isLoading ? (
              <div className="rounded-[24px] border border-white/70 bg-white/55 px-5 py-10 text-center text-sm text-gray-500">
                자격증 목록을 불러오는 중입니다...
              </div>
            ) : isError ? (
              <div className="rounded-[24px] border border-white/70 bg-white/55 px-5 py-10 text-center text-sm text-red-500">
                자격증 목록 조회에 실패했습니다.
              </div>
            ) : certList.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-gray-200 bg-white/45 px-5 py-12 text-center">
                <p className="text-base font-medium text-gray-700">
                  아직 등록된 자격증이 없어요
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  상단의 ‘내 자격증 등록’ 버튼으로 첫 자격증을 추가해보세요.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {certList.map((cert, index) => (
                  <div
                    key={`${cert.id}-${cert.certNum ?? "no-cert-num"}-${cert.passingDate}-${index}`}
                    className="rounded-[26px] border border-white/70 bg-white/55 p-2 shadow-[0_8px_24px_rgba(15,23,42,0.03)] backdrop-blur-md"
                  >
                    <MyCertCard
                      name={cert.name}
                      authority={cert.authority}
                      certNum={cert.certNum || "-"}
                      passingDate={cert.passingDate}
                      expirationDate={cert.expirationDate || "-"}
                      onDelete={() => void handleDeleteCert(cert)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[32px] border border-white/70 bg-white/40 p-8 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold tracking-[0.14em] text-gray">
                  WISHLIST
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  내 찜 목록
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  관심 있는 자격증을 모아보고, 일정 확인과 준비 계획에 활용하세요.
                </p>
              </div>

              <div className="inline-flex rounded-full border border-primary/10 bg-primarySoft/55 px-4 py-2 text-sm font-semibold text-gray">
                {favorites.length}개 저장됨
              </div>
            </div>

            {favorites.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-gray-200 bg-white/45 px-5 py-12 text-center">
                <p className="text-base font-medium text-gray-700">
                  아직 찜한 자격증이 없어요
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  자격증 탐색 페이지에서 관심 자격증을 찜해보세요.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                    : WISHLIST_CARD_TYPE.APPLY;

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
            )}
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
