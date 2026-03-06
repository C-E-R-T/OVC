import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import type { Schedule } from "../../types/exam";
import { getSchedules } from "../../api/schedule";
import { mapSchedulesToEvents } from "../../utils/calendar";

function CalendarPage() {
    const [schedules, setSchedules]=useState<Schedule[]>([]);
    const [loading, setLoading]=useState(true);
    const [error, setError]=useState<string|null>(null);

    useEffect(()=>{
        async function fetchSchedules(){
            try{
                const data=await getSchedules();
                setSchedules(data);
            } catch(err){
                setError("일정 데이터를 불러오는데 실패했습니다.");
            } finally{
                setLoading(false);
            }
        }
        fetchSchedules();
    },[]);
    
    const events=mapSchedulesToEvents(schedules);

    if(loading) return <div>로딩중...</div>
    if(error) return <div>{error}</div>

    return (
        <div>
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