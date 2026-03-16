import type { Schedule } from "../../../types/exam";
import Modal from "./Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  schedules: Schedule[] | null;
  // 호출하는 쪽에서 모달 제목을 직접 지정할 수 있도록 옵션 추가
  title?: string;
}

const formatDate = (value?: string) => value?.slice(2, 10) ?? "-";

function CertScheduleDetailModal({ isOpen, onClose, schedules, title }: Props) {
  if(!isOpen) return null;
  if (!schedules || schedules.length === 0) return <div>일정이 없습니다.</div>

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title ?? `${schedules[0].certificateName} 일정`}
      panelClassName="!w-fit !max-w-none"
    >
      <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden pr-2">
        <div className="mt-4 w-fit">
          <table className="w-auto border-collapse text-left text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 font-semibold whitespace-nowrap">시험 종류</th>
                <th className="border border-gray-300 px-3 py-2 font-semibold whitespace-nowrap">접수 기간</th>
                <th className="border border-gray-300 px-3 py-2 font-semibold whitespace-nowrap">시험 날짜</th>
                <th className="border border-gray-300 px-3 py-2 font-semibold whitespace-nowrap">발표 날짜</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule, index) => (
                <tr key={`${schedule.scheduleId}-${index}`} className="odd:bg-white even:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2 whitespace-nowrap">{schedule.examType}</td>
                  <td className="border border-gray-300 px-3 py-2 whitespace-nowrap">
                    {formatDate(schedule.applyStartAt)}~{formatDate(schedule.applyEndAt)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 whitespace-nowrap">
                    {formatDate(schedule.examStartAt)}~{formatDate(schedule.examEndAt)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 whitespace-nowrap">{formatDate(schedule.resultAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  )
}

export default CertScheduleDetailModal
