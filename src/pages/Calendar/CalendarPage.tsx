import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useMemo, useState, useCallback } from "react";
import { type Certificate, type Schedule } from "../../types/exam";
import { getSchedules, getSchedulesByCertificate } from "../../api/schedule";
import { mapSchedulesToEvents } from "../../utils/calendar";
import type { EventApi, EventClickArg, EventContentArg } from "@fullcalendar/core";
import { getCertificates } from "../../api/certificate";
import { IoCloseSharp } from "react-icons/io5";
import "./calendar.css";
import { useQuery } from "@tanstack/react-query";
import CertScheduleDetailModal from "../../components/common/modal/CertScheduleDetailModal";
import { Search } from "lucide-react";

type DetailTab =
    | "EXAM_TREND"
    | "ACQ_METHOD"
    | "EXAM_SUBJECT"
    | "PASS_CRITERIA"
    | "RELATED_DEPARTMENT";

// 상세 정보 탭 버튼 정의(라벨/키를 한 곳에서 관리)
const DETAIL_TAB_OPTIONS: Array<{ key: DetailTab; label: string }> = [
    { key: "EXAM_TREND", label: "출제 경향" },
    { key: "ACQ_METHOD", label: "취득 방법" },
    { key: "EXAM_SUBJECT", label: "시험 과목" },
    { key: "PASS_CRITERIA", label: "합격 기준" },
    { key: "RELATED_DEPARTMENT", label: "관련 학과" },
];

function CalendarPage() {
    const today = new Date();

    const [currentDate, setCurrentDate] = useState(today);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    // 현재 활성화된 상세 정보 탭
    const [selectedDetailTab, setSelectedDetailTab] = useState<DetailTab>("EXAM_TREND");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [certSchedules, setCertSchedules] = useState<Schedule[]>([]);

    const [searchInput, setSearchInput] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");

    const { data: schedules = [], isLoading, error } = useQuery({
        queryKey: ["schedules", year, month],
        queryFn: () => getSchedules(year, month),
    });

    const handleSearch = useCallback(() => {
        setSearchKeyword(searchInput);
    }, [searchInput]);

    const filteredSchedules = useMemo(() => {
        if (!searchKeyword.trim()) return schedules;

        return schedules.filter((schedule) =>
            schedule.certificateName.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }, [schedules, searchKeyword]);

    const events = useMemo(() => {
        return mapSchedulesToEvents(filteredSchedules);
    }, [filteredSchedules]);

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

    const handleEventClassNames = useCallback((arg: EventContentArg) => {
        const type = arg.event.extendedProps.eventType;

        if (type === "APPLY") return ["event-apply"];
        if (type === "EXAM") return ["event-exam"];
        if (type === "RESULT") return ["event-result"];

        return [];
    }, []);

    const handleOpenScheduleModal = async () => {
        if (!selectedSchedule) return;

        try {
            const data = await getSchedulesByCertificate(selectedSchedule.certId, year);
            setCertSchedules(data);
            setIsModalOpen(true);
        } catch (error) {
            console.log("자격증 전체 일정 불러오기 실패", error);
            throw error;
        }
    };

    const detailButtonClass = (tab: DetailTab) =>
        selectedDetailTab === tab
            ? "rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white transition"
            : "rounded-full border border-black px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-white";

    // 탭 키와 API 필드를 매핑해 조건문 분기를 단순화
    const detailTextByTab: Record<DetailTab, string | null | undefined> = {
        EXAM_TREND: certificate?.examTrend,
        ACQ_METHOD: certificate?.acqMethod,
        EXAM_SUBJECT: certificate?.examSubject,
        PASS_CRITERIA: certificate?.passCriteria,
        RELATED_DEPARTMENT: certificate?.relatedDepartment,
    };

    // 선택된 탭의 상세 텍스트를 가져오고 값이 없으면 안내 문구를 표시
    const detailText = detailTextByTab[selectedDetailTab] ?? "등록된 상세 정보가 없습니다.";

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f1f2ed] px-6 pb-12 pt-30">
                <div className="mx-auto max-w-[1440px] rounded-[32px] border border-white/70 bg-white/45 p-10 text-center text-gray-500 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
                    일정을 불러오는 중...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#f1f2ed] px-6 pb-12 pt-30">
                <div className="mx-auto max-w-[1440px] rounded-[32px] border border-white/70 bg-white/45 p-10 text-center text-red-500 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
                    일정 데이터를 불러오는데 실패했습니다.
                </div>
            </div>
        );
    }

    return (
       <div className="px-6 pb-12 pt-30">
            <div className="mx-auto w-full max-w-[1440px]">
                {/* 상단 소개 영역 */}
                <section className="mb-4 p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-black">
                                CALENDAR
                            </p>
                            <h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-900">
                                자격증 일정 관리
                            </h1>
                            <p className="max-w-2xl text-base leading-7 text-gray-500">
                                접수일, 시험일, 결과 발표일까지 자격증 일정을 한눈에 확인하고
                                필요한 시험 정보를 빠르게 탐색하세요.
                            </p>
                        </div>

                        <div className="inline-flex rounded-full border border-primary/10 bg-primarySoft/55 px-4 py-2 text-sm font-semibold text-gray">
                            {year}년 {month}월 일정
                        </div>
                    </div>
                </section>

                {/* 메인 영역 */}
                <div className={`grid gap-8 ${selectedEvent && selectedSchedule
                        ? "grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px]"
                        : "grid-cols-1"
                    }`}>
                    {/* 캘린더 영역 */}
                    <section className="rounded-[32px] border border-white/70 bg-white/40 px-8 py-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
                        {/* 상단 필터 */}
                        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                    월간 캘린더
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    자격증 이름으로 검색해서 원하는 일정만 빠르게 확인할 수 있어요.
                                </p>
                            </div>

                            <div className="flex w-full max-w-[360px] items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl">
                                <input
                                    className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
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
                                <button type="button" onClick={handleSearch} aria-label="검색">
                                    <Search size={18} className="text-gray-400" />
                                </button>
                            </div>
                        </div>

                        <div className="calendar-shell rounded-[28px] border border-white/70 bg-white/60 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl">
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
                                    right: "today",
                                }}
                            />
                        </div>
                    </section>

                    {/* 우측 상세 패널 */}
                    {selectedEvent && selectedSchedule && (
                        <aside className="sticky top-60 h-fit min-h-[710px] rounded-[32px] border border-white/70 bg-white/45 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
                            {!selectedEvent || !selectedSchedule ? (
                                <div className="flex min-h-[520px] flex-col justify-between">
                                    <div>
                                        <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-primaryDark/80">
                                            DETAILS
                                        </p>
                                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                            일정 상세 정보
                                        </h2>
                                        <p className="mt-3 text-sm leading-6 text-gray-500">
                                            캘린더에서 일정을 클릭하면 시험 정보와 상세 내용을 여기서 볼 수 있어요.
                                        </p>
                                    </div>

                                    <div className="rounded-[28px] border border-dashed border-gray-200 bg-white/45 px-6 py-12 text-center">
                                        <p className="text-base font-medium text-gray-700">
                                            아직 선택된 일정이 없어요
                                        </p>
                                        <p className="mt-2 text-sm text-gray-500">
                                            캘린더의 일정 카드를 눌러 상세 정보를 확인해보세요.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setSelectedEvent(null);
                                            setSelectedSchedule(null);
                                            setCertificate(null);
                                        }}
                                        className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-gray-500 transition hover:bg-white hover:text-gray-900"
                                    >
                                        <IoCloseSharp size={20} />
                                    </button>

                                    {/* 상단 제목 */}
                                    <div className="border-b border-gray-200/70 pb-6 pr-12">
                                        <p className="inline-flex items-center rounded-full border border-primary/10 bg-primarySoft/70 px-3 py-1 text-xs font-semibold text-gray shadow-sm">
                                            {selectedSchedule.eventType}
                                        </p>

                                        <h2 className="mt-4 break-keep text-[30px] font-bold leading-tight tracking-tight text-gray-900">
                                            {selectedSchedule.certificateName}
                                        </h2>

                                        <div className="mt-4 h-[1px] w-full rounded-full bg-black" />

                                        <div className="mt-5 flex flex-wrap gap-2">
                                            <span className="rounded-full border border-white/70 bg-white/75 px-3 py-1.5 text-base font-medium text-gray-700">
                                                시험 종류 · {selectedSchedule.examType}
                                            </span>

                                           <span className="rounded-full border border-white/70 bg-white/75 px-3 py-1.5 text-base font-medium text-gray-700">
                                                일정 유형 · {selectedSchedule.eventType}
                                            </span>
                                        </div>

                                        <button
                                            onClick={handleOpenScheduleModal}
                                            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primaryDark"
                                        >
                                            전체 시험 일정 보기
                                        </button>
                                    </div>

                                    {/* 시험 정보 */}
                                    {certificate && (
                                        <div className="border-b border-gray-200/70 py-6">
                                            <h3 className="text-lg font-semibold text-gray-900">시험 정보</h3>

                                            <div className="mt-4 rounded-[24px] border border-white/70 bg-white/60 p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] backdrop-blur-md">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-500">필기 응시료</span>
                                                    <span className="text-base font-semibold text-gray-900">
                                                        {certificate.writtenFee || "-"}
                                                    </span>
                                                </div>

                                                <div className="my-4 h-px bg-gray-200/80" />

                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-500">실기 응시료</span>
                                                    <span className="text-base font-semibold text-gray-900">
                                                        {certificate.practicalFee || "-"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 상세 정보 */}
                                    {certificate && (
                                        <div className="pt-6">
                                            <h3 className="text-lg font-semibold text-gray-900">상세 정보</h3>

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

                                            <div className="mt-4 rounded-2xl border border-gray-200 bg-white/70 p-4">
                                                <p className="text-sm leading-6 text-gray-700 whitespace-pre-line">
                                                    {detailText.trim()}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </aside>
                    )}
                </div>

                <CertScheduleDetailModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    schedules={certSchedules}
                    // 선택한 카드의 자격증명을 모달 제목으로 고정해 회차명이 섞이지 않게 한다.
                    title={selectedSchedule ? `${selectedSchedule.certificateName} 일정` : undefined}
                />
            </div>
        </div>
    );
}

export default CalendarPage;
