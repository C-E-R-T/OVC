// DB 데이터 배열을 FullCalendar 이벤트 배열로 바꾸는 함수에 대한 파일
import type { Schedule, CalendarEventType } from "../types/exam";

export function mapSchedulesToEvents(
  schedules: Schedule[]
): CalendarEventType[] {
  return schedules.map((schedule) => ({
    id: String(schedule.scheduleId),
    title: schedule.examName,
    date: schedule.examType,
    extendedProps: {
      scheduleId: schedule.scheduleId,
      certId: schedule.certificateName,
      examType: schedule.examType,
      applyStartAt: schedule.startDate,
      applyEndAt: schedule.endDate,
      // resultAt: schedule.resultAt,
    },
  }));
}