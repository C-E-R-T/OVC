import type { Schedule } from "../types/exam";

const BASE_URL="http://localhost:8080"; //백엔드 주소

export async function getSchedules(): Promise<Schedule[]>{
    const response=await fetch(`${BASE_URL}/api/calendar`);

    if(!response.ok){
        throw new Error("일정 데이터를 불러오지 못했습니다.");
    }

    const data=await response.json();
    return data;
}