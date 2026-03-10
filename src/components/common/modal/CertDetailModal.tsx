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
    <Modal isOpen={isOpen} title="자격증 상세정보" onClose ={onClose}>
        {!certId && <p>자격증을 선택해주세요.</p>}
        {certId && isLoading && <p>상세정보 불러오는 중...</p>}
        {certId && isError && <p>상세정보를 불러오지 못했습니다.</p>} 

        {/* detailData.data가 널일 수 도 있어서 detailData도 검사 */}
        {certId && !isLoading && !isError && detailData && detailData.data &&(
            <div className="space-y-3">
                <h2 className="text-xl font-bold">{detailData?.data.name}</h2>
                <p>시행기관: {detailData?.data.authority}</p>
                <p>필기 응시료:{detailData?.data.writtenFee ?? "미정"}</p>
                <p>실기 응시료:{detailData?.data.practicalFee?? "미정"}</p>
                <p>시험 경향:{detailData?.data.examTrend}</p>
                <p>취득 방법:{detailData?.data.acqMethod}</p>
                <p>주의사항:{detailData?.data.precautions}</p>
            </div>
        )}
    </Modal>
  )
}

export default CertDetailModal; 