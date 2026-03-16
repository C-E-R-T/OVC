import { apiClient } from "./apiClient";

export interface FavoriteItem {
    certId: number;
    title: string;
    authority: string;
    startDate: string;
    endDate: string;
    // 서버 스펙 전환 구간 호환용(이벤트 타입 관련 필드)
    type?: string;
    eventType?: string;
    examType?: string;
}

export const getFavorites = async (): Promise<FavoriteItem[]> => {
    const res=await apiClient.get("/api/users/me/favorites");
    return res.data.data;
};

export const addFavorite= async (certId: number) => {
    const res=await apiClient.post(`/api/users/me/favorites/${certId}`);
    return res.data;
};

export const deleteFavorite = async (certId: number) => {
    const res=await apiClient.delete(`/api/users/me/favorites/${certId}`);
    return res.data;
}
