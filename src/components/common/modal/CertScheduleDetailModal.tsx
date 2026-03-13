import type { Schedule } from "../../../types/exam";
import Modal from "./Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  schedules: Schedule[] | null;
}

function CertScheduleDetailModal({ isOpen, onClose, schedules }: Props) {
  if (!schedules || schedules.length === 0) return <div>일정이 없습니다.</div>
  console.log("모달 schedules:", schedules);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${schedules[0].examName} 일정`}
    >
      {/* 스크롤 영역 */}
      <div className="max-h-[70vh] overflow-y-auto pr-2">

        <div className="grid grid-cols-3 gap-6 mt-4">
          {schedules.map((schedule, index) => (
            <div
              key={`${schedule.scheduleId}-${index}`}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
            >
              <div className="border-b pb-2">
                <p className="font-bold">시험 종류</p>
                <p>{schedule.examType}</p>
              </div>

              <div className="border-b pb-2">
                <p className="font-bold">접수 기간</p>
                <p>{schedule.applyStartAt?.slice(0,10)} ~ {schedule.applyEndAt?.slice(0,10)}</p>
              </div>

              <div className="border-b pb-2 mt-2">
                <p className="font-bold">시험 날짜</p>
                <p>{schedule.examStartAt?.slice(0,10)} ~ {schedule.examEndAt?.slice(0,10)}</p>
              </div>

              <div className="mt-2">
                <p className="font-bold">발표 날짜</p>
                <p>
                  {schedule.resultAt?.slice(0,10)}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </Modal>
  )
}

export default CertScheduleDetailModal