// 로그인/회원가입에 대한 API 호출 분리
import { apiClient } from "./apiClient";

export const signup=async(data: {
    email: string;
    password: string;
    userName: string;
})=> {
    const res=await apiClient.post("/auth/signup",data);
    return res.data.data;
};

export const login =async(data : {
    email: string;
    password: string;
})=> {
    const res=await apiClient.post("/auth/login",data);
    return res.data.data;
}