import type { Schedule } from "../types/exam";

//백엔드 응답 구조를 type으로 정의한 것
type OkResponse<T> = {
  success: boolean; //요청 성공 여부
  data: T; //실제 데이터
  path: string; //요청 경로
};

//백엔드 서버 주소
const BASE_URL = "http://localhost:8080";

export async function getSchedules(year: number, month: number): Promise<Schedule[]> {
  const res = await fetch(`${BASE_URL}/api/calendar?year=${year}&month=${month}`);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("에러 응답:", errorText);
    throw new Error("일정 데이터를 불러오지 못했습니다.");
  }

  const result: OkResponse<Schedule[]> = await res.json();
  return result.data;
}