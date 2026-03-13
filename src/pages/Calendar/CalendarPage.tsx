import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid";
import { useMemo, useState, useCallback } from "react";
import { type Certificate, type Schedule } from "../../types/exam";
import { getSchedules } from "../../api/schedule";
import { mapSchedulesToEvents } from "../../utils/calendar";
import type { EventApi, EventClickArg, EventContentArg } from "@fullcalendar/core";
import { getCertificates } from "../../api/certificate";
import { IoCloseSharp } from "react-icons/io5";
import './calendar.css'
import { useQuery } from "@tanstack/react-query";
import CertScheduleDetailModal from "../../components/common/modal/CertScheduleDetailModal";


function CalendarPage() {

    const today = new Date();

    // 캘린더 기준 날짜 (월 이동 시 변경)
    const [currentDate, setCurrentDate] = useState(today);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    // 클릭한 이벤트
    const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);

    // 클릭한 일정 데이터
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

    // 자격증 정보
    const [certificate, setCertificate] = useState<Certificate | null>(null);

    // 모달
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 일정 API 호출
    const { data: schedules = [], isLoading, error } = useQuery({
        queryKey: ["schedules", year, month],
        queryFn: () => getSchedules(year, month)
    });

    // FullCalendar 이벤트 변환
    const events = useMemo(() => {
        return mapSchedulesToEvents(schedules);
    }, [schedules]);

    // 일정 클릭
    const handleEventClick = useCallback(async (info: EventClickArg) => {

        const props = info.event.extendedProps as Schedule;

        try {

            const certData = await getCertificates(props.scheduleId);

            setCertificate(certData);
            setSelectedSchedule(props);
            setSelectedEvent(info.event);

        } catch (error) {
            console.error("자격증 정보 불러오기 실패", error);
        }

    }, []);

    // 이벤트 색상
    const handleEventClassNames = useCallback((arg: EventContentArg) => {

        const type = arg.event.extendedProps.eventType;

        if (type === "APPLY") return ["event-apply"];
        if (type === "EXAM") return ["event-exam"];
        if (type === "RESULT") return ["event-result"];

        return [];

    }, []);

    // 모달용 일정
    const certSchedules = schedules.filter(
        (schedule) =>
            schedule.certificateName === selectedSchedule?.certificateName
    );

    if (isLoading) return <div>일정을 불러오는 중...</div>
    if (error) return <div>일정 데이터를 불러오는데 실패했습니다.</div>

    return (
        <div className="flex">

            {/* 캘린더 */}
            <div className="flex-1 p-[40px]">

                <FullCalendar
                    plugins={[dayGridPlugin]}

                    initialView="dayGridMonth"

                    // 현재 캘린더 날짜 유지
                    initialDate={currentDate}

                    events={events}

                    eventClick={handleEventClick}

                    eventClassNames={handleEventClassNames}

                    datesSet={(info) => {
                        const date = info.view.currentStart;
                        setCurrentDate(date);
                    }}

                    height="auto"

                    displayEventTime={false}

                    eventDisplay="block"

                    headerToolbar={{
                        left: "",
                        center: "prev title next",
                        right: "today"
                    }}
                />

            </div>

            {/* 우측 상세 */}
            {selectedEvent && (

                <div className="flex w-[400px] h-screen bg-green-100">

                    <div>

                        {selectedSchedule ? (

                            <div>

                                <h1>{selectedSchedule.certificateName}</h1>

                                <p>시험 종류 : {selectedSchedule.examType}</p>

                                <p>일정 유형 : {selectedSchedule.eventType}</p>

                                <p>전체 시험 일정</p>

                                <button
                                    className="border border-black-200"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    일정 상세 보기
                                </button>

                            </div>

                        ) : (

                            <p>일정을 선택하세요.</p>

                        )}

                        {certificate && (

                            <div>

                                <p>시험 정보</p>

                                <p>필기 응시료: {certificate.writtenFee}</p>

                                <p>실기 응시료: {certificate.practicalFee}</p>

                                <p>상세 정보</p>

                                <button className="border border-black-200">유의 사항</button>
                                <button className="border border-black-200">출제 경향</button>
                                <button className="border border-black-200">취득 방법</button>

                            </div>

                        )}

                    </div>

                    <div>
                        <button onClick={() => setSelectedEvent(null)}>
                            <IoCloseSharp />
                        </button>
                    </div>

                </div>

            )}

            <CertScheduleDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                schedules={certSchedules}
            />

        </div>
    )
}

export default CalendarPage