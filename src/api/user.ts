import { apiClient } from "./apiClient"

export const getMyInfo= async () => {
    const res=await apiClient.get("/users/me");
    return res.data.data;
}