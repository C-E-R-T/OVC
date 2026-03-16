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
        <div className="space-y-3">
          <div className="flex gap-1">
            <p className="font-bold">시행기관 : </p>
            <p> {detailData?.data.authority}</p>
          </div>
          <p className="font-bold">시험 경향</p>
          <p>{detailData?.data.examTrend}</p>
          <p className="font-bold">취득 방법</p>
          <p>{detailData?.data.acqMethod}</p>
          <p className="font-bold">주의사항</p>
          <p>{detailData?.data.precautions}</p>
          <div className="flex justify-around">
            <div className="flex gap-1">
              <p className="font-bold">필기 응시료 : </p>
              <p> {detailData?.data.writtenFee ?? "미정"}</p>
            </div>
            <div className="flex gap-1">
              <p className="font-bold">실기 응시료 :</p>
              <p>{detailData?.data.practicalFee ?? "미정"}</p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default CertDetailModal;
