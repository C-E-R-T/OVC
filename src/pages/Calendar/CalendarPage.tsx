import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid";
import { useMemo, useState, useCallback } from "react";
import { type Certificate, type CalendarEventType } from "../../types/exam";
import { getSchedules } from "../../api/schedule";
import { mapSchedulesToEvents } from "../../utils/calendar";
import type { EventApi, EventClickArg, EventContentArg } from "@fullcalendar/core";
import { getCertificates } from "../../api/certificate";
import { IoCloseSharp } from "react-icons/io5";
import './calendar.css'
import { useQuery } from "@tanstack/react-query";


function CalendarPage() {

    //일정 클릭 시에만 우측 상세정보 바가 나타나도록 제어하기 위한 state
    //FullCalendar Event타입은 EventApi
    const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);

    //클릭한 일정의 상세정보를 담는 state
    const [selectedSchedule, setSelectedSchedule] = useState<CalendarEventType["extendedProps"] | null>(null);

    //Certificate 정보를 저장할 state
    const [certificate, setCertificate] = useState<Certificate | null>(null);

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    // React Query를 사용해 특정 연도/월의 일정 데이터를 서버에서 가져옴
    const { data: schedules = [], isLoading, error } = useQuery({
        // queryKey는 캐싱 기준 (year, month가 바뀌면 새로운 데이터 요청)
        queryKey: ["schedules", year, month],
        //실제 api 호출 함수
        queryFn: () => getSchedules(year, month)
    })

    //useMemo 사용을 통해 schedules가 바뀔 때맏 이벤트 데이터 생성
    const events = useMemo(() => {
        return mapSchedulesToEvents(schedules);
    }, [schedules]);

    const handleEventClick= useCallback(async (info: EventClickArg)=>{
        const props = info.event.extendedProps as CalendarEventType["extendedProps"];

                        setSelectedSchedule(props);
                        setSelectedEvent(info.event);

                        try {
                            //extendedProps에 있는 scheduleId를 이용해서 해당 자격증 정보를 서버에서 가져옴
                            const certData = await getCertificates(props.scheduleId);
                            setCertificate(certData);

                        } catch (error) {
                            console.error("자격증 정보 불러오기 실패", error);
                        }

    },[]);

    const handleEventClassNames=useCallback((arg: EventContentArg)=> {
        const type = arg.event.extendedProps.eventType;

                        if (type === "APPLY") return ["event-apply"]; //FullCalendar의 공식 타입 정의 = eventClassNames → string[]
                        if (type == "EXAM") return ["event-exam"];
                        if (type == "RESULT") return ["event-result"];

                        return [];
    },[]);

    if (isLoading) return <div>일정을 불러오는 중...</div>
    if (error) return <div>일정 데이터를 불러오는데 실패했습니다.</div>

    console.log("schedules:", schedules);
    console.log("events:", events);

    return (
        <div className="flex">
            {/* 좌측 - 캘린더  */}
            <div className="flex-1 p-[40px]">
                <FullCalendar
                    plugins={[dayGridPlugin]} //캘린더의 격자형 월 화면으로 달력을 나타내줌
                    initialView="dayGridMonth"
                    events={events}
                    eventClick={handleEventClick}
                    eventClassNames={handleEventClassNames}
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
            {selectedEvent && (
                <div className="flex w-[400px] h-screen bg-green-100">
                    <div>
                        {selectedSchedule ? (
                            <div>
                                <h1>{selectedSchedule.certificateName}</h1>
                                <p>전체 시험 일정</p>
                                <p>시험 정보</p>
                                <p>상세 정보</p>
                                <p>시험 종류 : {selectedSchedule.examType}</p>
                                <p>일정 유형: {selectedSchedule.eventType}</p>
                                <p>기간: {selectedSchedule.startDate.slice(0, 10)} ~ {selectedSchedule.endDate.slice(0, 10)}</p>
                            </div>
                        ) : (<p>일정을 선택하세요.</p>)}
                        {certificate && (
                            <div style={{ border: "3px solid red" }}>
                                <p>발급 기관: {certificate.authority}</p>
                                <p>출제 경향: {certificate.examTrend}</p>
                                <p>취득 방법: {certificate.acqMethod}</p>
                                <p>유의 사항: {certificate.precautions}</p>
                                {/* <p>자격증 설명: {certificate.description}</p> */}
                                <p>필기 응시료: {certificate.writtenFee}</p>
                                <p>실기 응시료: {certificate.practicalFee}</p>
                            </div>
                        )}
                    </div>
                    <div>
                        {/* 닫기 버튼 */}
                        <button onClick={() => setSelectedEvent(null)}><IoCloseSharp /></button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CalendarPage