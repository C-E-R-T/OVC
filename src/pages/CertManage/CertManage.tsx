import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import MyCertCard from "../../components/common/cards/MyCertCard";
import MyWishlistCard, {
  WISHLIST_CARD_TYPE,
} from "../../components/common/cards/MyWishlistCard";
import { Award, Bookmark } from "lucide-react";
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

  //찜 목록 데이터를 가져옴
  const {data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites
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
            {favorites.map((item) => (
              <MyWishlistCard
              key={item.certId}
              type={WISHLIST_CARD_TYPE.APPLY}
              title={item.title}
              startDate={item.startDate}
              endDate={item.endDate}
              onDelete={() => deleteFavoriteMutation.mutate(item.certId)}
              />
            ))}
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
