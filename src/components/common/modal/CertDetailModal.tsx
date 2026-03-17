import Modal from "./Modal";
import { useCertDetail } from "../../../hooks/useCertDetail";

type CertDetailModalProps = {
  isOpen: boolean;
  certId: number | null;
  onClose: () => void;
};

function CertDetailModal({ isOpen, certId, onClose }: CertDetailModalProps) {
  const { data: detailData, isLoading, isError } = useCertDetail(certId);

  return (
    <Modal
      isOpen={isOpen}
      title={detailData?.data.name ?? "자격증 상세정보"}
      onClose={onClose}
    >
      {!certId && (
        <p className="text-center text-gray-400 py-10">
          자격증을 선택해주세요.
        </p>
      )}

      {certId && isLoading && (
        <p className="text-center text-gray-400 py-10">
          상세정보 불러오는 중...
        </p>
      )}

      {certId && isError && (
        <p className="text-center text-red-400 py-10">
          상세정보를 불러오지 못했습니다.
        </p>
      )}

      {certId && !isLoading && !isError && detailData?.data && (
        <div className="space-y-6">

          {/* 시행기관 */}
          <InfoBlock title="시행기관">
            {detailData.data.authority}
          </InfoBlock>

          {/* 시험 경향 */}
          <InfoBlock title="시험 경향">
            {detailData.data.examTrend}
          </InfoBlock>

          {/* 시험 과목 */}
          <InfoBlock title="시험 과목">
            {detailData.data.examSubject}
          </InfoBlock>

          {/* 취득 방법 */}
          <InfoBlock title="취득 방법">
            {detailData.data.acqMethod}
          </InfoBlock>

          {/* 관련 학과 */}
          <InfoBlock title="관련 학과">
            {detailData.data.relatedDepartment}
          </InfoBlock>

          {/* 합격 기준 */}
          <InfoBlock title="합격 기준">
            {detailData.data.passCriteria}
          </InfoBlock>

          {/* 응시료 */}
          <div className="flex gap-4">
            <FeeBadge label="필기 응시료">
              {detailData.data.writtenFee ?? "미정"}
            </FeeBadge>

            <FeeBadge label="실기 응시료">
              {detailData.data.practicalFee ?? "미정"}
            </FeeBadge>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default CertDetailModal;



/* -------------------- UI 컴포넌트 -------------------- */

function InfoBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
      <p className="text-sm font-semibold tracking-wide text-gray-500 mb-1">
        {title}
      </p>
      <p className="text-gray-800 leading-relaxed">{children}</p>
    </div>
  );
}

function FeeBadge({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 rounded-lg bg-primarySoft px-4 py-3 text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="font-semibold text-primary">{children}</p>
    </div>
  );
}