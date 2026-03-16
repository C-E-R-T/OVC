import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid";
import { useMemo, useState, useCallback } from "react";
import { type Certificate, type Schedule } from "../../types/exam";
import { getSchedules, getSchedulesByCertificate } from "../../api/schedule";
import { mapSchedulesToEvents } from "../../utils/calendar";
import type { EventApi, EventClickArg, EventContentArg } from "@fullcalendar/core";
import { getCertificates } from "../../api/certificate";
import { IoCloseSharp } from "react-icons/io5";
import './calendar.css'
import { useQuery } from "@tanstack/react-query";
import CertScheduleDetailModal from "../../components/common/modal/CertScheduleDetailModal";
import { Search } from "lucide-react";

type DetailTab =
    | "EXAM_TREND"
    | "ACQ_METHOD"
    | "EXAM_SUBJECT"
    | "PASS_CRITERIA"
    | "RELATED_DEPARTMENT";

const DETAIL_TAB_OPTIONS: Array<{ key: DetailTab; label: string }> = [
    { key: "EXAM_TREND", label: "출제 경향" },
    { key: "ACQ_METHOD", label: "취득 방법" },
    { key: "EXAM_SUBJECT", label: "시험 과목" },
    { key: "PASS_CRITERIA", label: "합격 기준" },
    { key: "RELATED_DEPARTMENT", label: "관련 학과" },
];

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
    const [selectedDetailTab, setSelectedDetailTab] = useState<DetailTab>("EXAM_TREND");

    //일정 상세조회 버튼 클릭 시 모달 전체 일정 조회를 위한 state
    const [certSchedules, setCertSchedules] = useState<Schedule[]>([]);


    //검색창에 입력하는 값
    const [searchInput, setSearchInput] = useState("");
    //실제 검색에 반영되는 값(엔터/검색 버튼 시점)
    const [searchKeyword, setSearchKeyword] = useState("");

    // 일정 API 호출
    const { data: schedules = [], isLoading, error } = useQuery({
        queryKey: ["schedules", year, month],
        queryFn: () => getSchedules(year, month)
    });

    // 입력값 변경과 검색 실행 시점을 분리해 불필요한 즉시 필터링을 줄임
    const handleSearch = useCallback(() => {
        setSearchKeyword(searchInput);
    }, [searchInput]);

    //schedules 또는 searchKeyword가 바뀌면 필터 재계산
    const filteredSchedules = useMemo(() => {
        if (!searchKeyword.trim()) return schedules;

        return schedules.filter((schedule) =>
            //자격증 이름에 검색어가 포함되어 있으면 일정을 유지함 
            schedule.certificateName
                .toLowerCase()
                .includes(searchKeyword.toLowerCase())
        );
    }, [schedules, searchKeyword])

    // FullCalendar 이벤트 변환
    const events = useMemo(() => {
        return mapSchedulesToEvents(filteredSchedules);
    }, [filteredSchedules]);

    // 일정 클릭
    const handleEventClick = useCallback(async (info: EventClickArg) => {

        const props = info.event.extendedProps as Schedule;

        try {

            const certData = await getCertificates(props.certId);

            setCertificate(certData);
            setSelectedSchedule(props);
            setSelectedEvent(info.event);
            setSelectedDetailTab("EXAM_TREND");

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
    const handleOpenScheduleModal = async () => {
        if (!selectedSchedule) return;

        console.log("selectedSchedule:", selectedSchedule);
        console.log("certId:", selectedSchedule?.certId);

        try {
            const data = await getSchedulesByCertificate(
                selectedSchedule.certId,
                year
            );
            setCertSchedules(data);

            setIsModalOpen(true);
        } catch (error) {
            console.log("자격증 전체 일정 불러오기 실패", error);
            throw error;
        }
    }

    if (isLoading) return <div>일정을 불러오는 중...</div>
    if (error) return <div>일정 데이터를 불러오는데 실패했습니다.</div>

    const detailButtonClass = (tab: DetailTab) =>
        selectedDetailTab === tab
            ? "px-4 py-2.5 text-sm rounded-full bg-[#1A0089] text-white font-medium hover:bg-[#14006d] transition"
            : "px-4 py-2.5 text-sm rounded-full bg-[#FFF3D6] border border-[#E7DAB7] text-[#6B5520] font-medium hover:bg-[#F7E8C2] transition";

    const detailTextByTab: Record<DetailTab, string | null | undefined> = {
        EXAM_TREND: certificate?.examTrend,
        ACQ_METHOD: certificate?.acqMethod,
        EXAM_SUBJECT: certificate?.examSubject,
        PASS_CRITERIA: certificate?.passCriteria,
        RELATED_DEPARTMENT: certificate?.relatedDepartment,
    };
    const detailText = detailTextByTab[selectedDetailTab] ?? "등록된 상세 정보가 없습니다.";

    return (
        <div className="flex">
            {/* 캘린더 */}
            <div className="flex-1 p-[40px] flex flex-col gap-4">

                {/* 검색창 */}
                <div className="flex justify-end">
                    <div className="flex w-[300px] border border-gray-300 rounded-lg px-3 py-2 items-center gap-2">
                        <input
                            className="flex-1 outline-none"
                            type="text"
                            placeholder="일정 검색..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleSearch}
                            aria-label="검색"
                        >
                            <Search size={18} />
                        </button>
                    </div>
                </div>

                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
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
                <div className="w-[420px] min-h-screen bg-[#FFF9EC] border-l border-[#ECE7D8] p-8 animate-slideIn relative">
                    {/* 닫기 버튼 */}
                    <button
                        onClick={() => setSelectedEvent(null)}
                        className="absolute top-6 right-6 text-[#6B7280] hover:text-[#1A0089] transition p-2 rounded-full hover:bg-[#FFF3D6]"
                    >
                        <IoCloseSharp size={22} />
                    </button>

                    {/* 상단 제목 영역 */}
                    {selectedSchedule && (
                        <div className="pb-6 border-b border-[#ECE7D8]">
                            <div className="pr-10">
                                <p className="inline-flex items-center rounded-full bg-[#B8CE52] px-4 py-1.5 text-sm font-semibold text-[#1A0089]">
                                    {selectedSchedule.eventType}
                                </p>

                                <h1 className="mt-4 text-[32px] font-bold leading-tight text-[#0F172A] break-keep">
                                    {selectedSchedule.certificateName}
                                </h1>

                                <div className="mt-4 h-[4px] w-[120px] rounded-full bg-[#1A0089]" />

                                <div className="mt-5 flex flex-wrap gap-2">
                                    <span className="rounded-full border border-[#E7DAB7] bg-[#FFF3D6] px-3 py-1 text-sm font-medium text-[#6B5520]">
                                        시험 종류 · {selectedSchedule.examType}
                                    </span>

                                    <span className="rounded-full border border-[#E7DAB7] bg-white px-3 py-1 text-sm font-medium text-[#1A0089]">
                                        일정 유형 · {selectedSchedule.eventType}
                                    </span>
                                </div>

                                <button
                                    onClick={handleOpenScheduleModal}
                                    className="mt-6 w-full h-[52px] rounded-xl bg-[#FE5E32] text-white font-semibold hover:bg-[#E9552C] transition"
                                >
                                    전체 시험 일정 보기
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 시험 정보 */}
                    {certificate && (
                        <div className="pt-6 pb-6 border-b border-[#ECE7D8]">
                            <h2 className="text-lg font-semibold text-[#1A0089]">
                                시험 정보
                            </h2>

                            <div className="mt-4 rounded-2xl border border-[#E7DAB7] bg-white p-5 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-500">필기 응시료</span>
                                    <span className="text-base font-semibold text-[#0F172A]">
                                        {certificate.writtenFee || "-"}
                                    </span>
                                </div>

                                <div className="h-px bg-[#F1E7CD]" />

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-500">실기 응시료</span>
                                    <span className="text-base font-semibold text-[#0F172A]">
                                        {certificate.practicalFee || "-"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 상세 정보 */}
                    {certificate && (
                        <div className="pt-6">
                            <h2 className="text-lg font-semibold text-[#1A0089]">
                                상세 정보
                            </h2>

                            <div className="mt-4 flex flex-wrap gap-3">
                                {DETAIL_TAB_OPTIONS.map((tab) => (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => setSelectedDetailTab(tab.key)}
                                        className={detailButtonClass(tab.key)}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 rounded-2xl border border-[#E7DAB7] bg-white p-4">
                                <p className="text-sm leading-6 text-[#334155] whitespace-pre-line">
                                    {detailText.trim()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <CertScheduleDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                schedules={certSchedules}
                title={selectedSchedule ? `${selectedSchedule.certificateName} 일정` : undefined}
            />

        </div>
    )
}

export default CalendarPage
