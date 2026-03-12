import type { Schedule } from "../types/exam";
import type { CalendarEventType } from "../types/exam";

//FullCalendar 규칙 떄문에 end date가 하루 앞당겨지는 문제를 해결하기 위한 함수
function addOneDay(dateStr: string) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

//api에서 받은 schedules 데이터를 캘린더에서 사용할 이벤트 형식(CalendarEventType)으로 변환하는 함수
export function mapSchedulesToEvents(
  schedules: Schedule[]
): CalendarEventType[] {
  const events = schedules.map((schedule) => {
    const event = {
     id: `${schedule.scheduleId}-${schedule.eventType}`,

      title: `${schedule.certificateName} ${schedule.eventType}`,

      //ISO 날짜 형식 뒤에는 시간이 붙는데 이를 제거하고 날짜 문자열만 활용하기 위해 slice(0,10) 사용
      start: schedule.startDate.slice(0, 10),
      end: addOneDay(schedule.endDate),

      // allDay가 없다면 캘린더가 시간 이벤트라고 간주하기 때문에, 캘린더에 날짜만 표시해주기 위함 -> true일 경우 시간을 무시
      allDay: true,

      extendedProps: schedule
    };

    return event;
  });

  return events;
}