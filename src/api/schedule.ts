import type { Schedule } from "../types/exam";
import { apiClient } from "./apiClient";

export async function getSchedules(year: number, month: number): Promise<Schedule[]> {
  try {
    const res = await apiClient.get('/calendar', {
      params: {
        year: year,
        month: month
      }
    });

    return res.data.data;
  } catch (error) {
    console.log("schedule 조회 실패", error);
    throw error;
  }
}

export async function getSchedule(scheduleId: number): Promise<Schedule> {
  try {
    const res= await apiClient.get(`/calendar/${scheduleId}`);
    return res.data.data;
  } catch (error) {
    console.log("schedule 싱세 조회 실패", error);
    throw error;
  }
}
