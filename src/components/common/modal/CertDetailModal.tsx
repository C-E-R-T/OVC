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
    <Modal isOpen={isOpen} title={detailData?.data.name} onClose={onClose}>
      {!certId && <p>자격증을 선택해주세요.</p>}
      {certId && isLoading && <p>상세정보 불러오는 중...</p>}
      {certId && isError && <p>상세정보를 불러오지 못했습니다.</p>}

      {/* detailData.data가 널일 수 도 있어서 detailData도 검사 */}
      {certId && !isLoading && !isError && detailData && detailData.data && (
        <div className="space-y-3 gap-2">
          <div>
            <p className="font-bold text-lg">시행기관</p>
            <p>{detailData?.data.authority}</p>
          </div>

          <div>
            <p className="font-bold text-lg">시험 경향</p>
            <p>{detailData?.data.examTrend}</p>
          </div>
          <div>
            <p className="font-bold text-lg">시험 과목</p>
            <p>{detailData?.data.examSubject}</p>
          </div>
          <div>
            <p className="font-bold text-lg">취득 방법</p>
            <p>{detailData?.data.acqMethod}</p>
          </div>

          <div>
            <p className="font-bold text-lg">관련 학과</p>
            <p>{detailData?.data.relatedDepartment}</p>
          </div>

          <div>
            <p className="font-bold text-lg">합격 기준</p>
            <p>{detailData?.data.passCriteria}</p>
          </div>
          <div className="flex justify-around">
            <p>필기 응시료 : {detailData?.data.writtenFee ?? "미정"}</p>
            <p>실기 응시료 : {detailData?.data.practicalFee ?? "미정"}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default CertDetailModal;
