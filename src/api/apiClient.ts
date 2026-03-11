//axios 공통 설정 파일
import axios from "axios";

//axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

//요청을 보내기 전에 실행됨
apiClient.interceptors.request.use((config)=> {
  const token =localStorage.getItem("accessToken");

  if(token){
    config.headers.Authorization=`Bearer ${token}`;
  }

  return config;
})
