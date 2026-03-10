import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import type { CalendarEventType, Schedule } from "../../types/exam";
import { getSchedules } from "../../api/schedule";
import { mapSchedulesToEvents } from "../../utils/calendar";
import './calendar.css'

function CalendarPage() {
    const [schedules, setSchedules] = useState<Schedule[]>([]); //API에서 받은 일정 데이터 저장
    const [events, setEvents] = useState<CalendarEventType[]>([]); //캘린더에 표시할 이벤트
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSchedules() {
            try {
                const today = new Date(); //현재 날짜 생성
                const year = today.getFullYear();
                const month = today.getMonth() + 1;
                const data = await getSchedules(year, month); //api 호출
                setSchedules(data); //상태 저장
            } catch (err) {
                console.error("일정 불러오기 에러:", err);
                setError("일정 데이터를 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        }
        fetchSchedules();
    }, []);

    //api에서 받은 schedules 데이터가 바뀌면 캘린더 이벤트 타입으로 변환해서 events에 저장함
    useEffect(() => {
        setEvents(mapSchedulesToEvents(schedules));
    }, [schedules]);

    console.log("schedules:", schedules);
    console.log("events:", events);

    if (loading) return <div>로딩중...</div>
    if (error) return <div>{error}</div>

    return (
        <div className="flex">
            {/* 좌측 - 캘린더  */}
            <div className="flex-1 p-[40px]">
                <FullCalendar
                    plugins={[dayGridPlugin]} //캘린더의 격자형 월 화면으로 달력을 나타내줌
                    initialView="dayGridMonth"
                    events={async (info, successCallback, failureCallback) => {
                        try {
                            //info에는 현재 캘린더 화면 범위가 들어감
                            const start = info.start;
                            const year = start.getFullYear();
                            const month = start.getMonth() + 1;

                            //api 호출 -> 특정 달의 데이터 가져오기 => /api/calendar?year=년도&month=달
                            const data = await getSchedules(year, month);
                            //schedule데이터를 캘린더 이벤트 타입으로 변환
                            const mapped = mapSchedulesToEvents(data);

                            //캘린더에게 이벤트 데이터를 전달 -> 화면에 일정 표시
                            successCallback(mapped);
                        } catch (err) {
                            failureCallback(err instanceof Error ? err : new Error("Unkown Error"));
                        }
                    }}

                    eventClassNames={(arg) => {
                        const type = arg.event.extendedProps.eventType;

                        if (type === "APPLY") return ["event-apply"]; //FullCalendar의 공식 타입 정의 = eventClassNames → string[]
                        if (type == "EXAM") return ["event-exam"];
                        if (type == "RESULT") return ["event-result"];

                        return [];

                    }}

                    height="auto"

                    //이벤트 시간 표시 여부
                    displayEventTime={false}
                    //이벤트 표시 형식 -> 연속된 일정일 경우 bar 형태로 나타남
                    eventDisplay="block"

                    //캘린더 상단 UI
                    headerToolbar={{
                        left: "",
                        center: "prev title next",
                        right: "today"
                    }}
                />
            </div>
            {/* 우측 - 자격증 상세정보 */}
            <div className="w-[400px] h-screen bg-green-100">
                <p>상세정보를 표시하는 영역입니다.</p>
            </div>
        </div>
    )
}

export default CalendarPage