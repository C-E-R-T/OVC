import { useState } from "react";
import MyCertCard from "../../components/common/cards/MyCertCard";
import MyWishlistCard, {
  WISHLIST_CARD_TYPE,
} from "../../components/common/cards/MyWishlistCard";
import { Award, Bookmark } from "lucide-react";
import Modal from "../../components/common/modal/Modal";
import CertRegisterForm, {
  type CertRegisterFormValues,
} from "../../components/common/forms/CertRegisterForm";

type CertItem = {
  id: number;
  name: string;
  authority: string;
  certNum?: string;
  passingDate: string;
  expirationDate?: string;
};
function CertManage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [certList, setCertList] = useState<CertItem[]>([
    {
      id: 1,
      name: "SQL Developer (SQLD)",
      authority: "한국 데이터 산업 진흥회",
      passingDate: "2026-03-07",
      expirationDate: "",
    },
  ]);

  const handleCreateCert = (values: CertRegisterFormValues) => {
    const newCert: CertItem = {
      id: Date.now(),
      name: values.name,
      authority: values.authority,
      certNum: values.certNum || undefined,
      passingDate: values.passingDate,
      expirationDate: values.expirationDate || undefined,
    };

    setCertList((prev) => [newCert, ...prev]);
  };
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
          <div className="space-y-4">
            {certList.map((cert) => (
              <MyCertCard
                key={cert.id}
                name={cert.name}
                authority={cert.authority}
                certNum={cert.certNum || "-"}
                passingDate={cert.passingDate}
                expirationDate={cert.expirationDate || "-"}
              />
            ))}
          </div>
        </section>

        <section className="w-[60%] rounded-2xl bg-[#F6F7F7] p-4 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5" />
              <p className="font-semibold">내 찜 목록</p>
            </div>
            <div className="rounded-xl bg-gray-300 px-3 py-1 text-sm text-gray-600">
              5개 항목
            </div>
          </div>
          <div className="flex justify-center"></div>
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 mx-auto w-fit">
            <MyWishlistCard
              type={WISHLIST_CARD_TYPE.APPLY}
              title="TOEIC Listening & Reading"
              startDate="2026-03-01"
              endDate="2026-03-15"
              onClick={() => console.log("시험 신청")}
            />
            <MyWishlistCard
              type={WISHLIST_CARD_TYPE.APPLY}
              title="TOEIC Speaking"
              startDate="2026-03-10"
              endDate="2026-03-15"
              onClick={() => console.log("시험 신청")}
            />
            <MyWishlistCard
              type={WISHLIST_CARD_TYPE.EXAM}
              title="TOEIC Listening & Reading"
              startDate="2026-03-15"
              endDate="2026-03-15"
              onClick={() => console.log("시험일")}
            />
            <MyWishlistCard
              type={WISHLIST_CARD_TYPE.RESULT}
              title="TOEIC Listening & Reading"
              startDate="2026-03-09"
              endDate="2026-03-09"
            />
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
        />
      </Modal>
    </div>
  );
}

export default CertManage;
