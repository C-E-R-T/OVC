import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import type { Schedule } from "../../types/exam";
import { getSchedules } from "../../api/schedule";
import { mapSchedulesToEvents } from "../../utils/calendar";
import styles from './CalendarPage.module.css'

function CalendarPage() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSchedules() {
            try {
                const today = new Date();
                const year = today.getFullYear();
                const month = today.getMonth() + 1;
                const data = await getSchedules(year, month);
                setSchedules(data);
            } catch (err) {
                console.error("일정 불러오기 에러:", err);
                setError("일정 데이터를 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        }
        fetchSchedules();
    }, []);

    const events = mapSchedulesToEvents(schedules);

    console.log("schedules:", schedules);
    console.log("events:", events);

    if (loading) return <div>로딩중...</div>
    if (error) return <div>{error}</div>

    return (
        <div className={styles.container}>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                height="auto"
            />
        </div>
    )
}

export default CalendarPage