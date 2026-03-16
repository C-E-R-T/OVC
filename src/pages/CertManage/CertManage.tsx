import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import MyCertCard from "../../components/common/cards/MyCertCard";
import MyWishlistCard, {
  WISHLIST_CARD_TYPE,
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

function CertManage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
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
        {/* 상단 헤더 영역 */}
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

        {/* 본문 2단 */}
        <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_1fr]">
          {/* 취득한 자격증 */}
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

          {/* 찜 목록 */}
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
                {favorites.map((item) => (
                  <div
                    key={item.certId}
                    className="rounded-[26px] border border-white/70 bg-white/55 p-2 shadow-[0_8px_24px_rgba(15,23,42,0.03)] backdrop-blur-md"
                  >
                    <MyWishlistCard
                      type={WISHLIST_CARD_TYPE.APPLY}
                      title={item.title}
                      startDate={item.startDate}
                      endDate={item.endDate}
                      onDelete={() => deleteFavoriteMutation.mutate(item.certId)}
                    />
                  </div>
                ))}
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