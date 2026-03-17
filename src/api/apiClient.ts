//axios 공통 설정 파일
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

//axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

//요청을 보내기 전에 실행됨
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  // auth 요청에는 토큰 붙이지 않음
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// /auth/refresh 응답의 data 필드에 새 accessToken 문자열이 내려오는 구조
type RefreshApiResponse = {
  status: number;
  message: string;
  data: string; // accessToken
  timestamp: string;
  path: string;
};

// refresh API를 동시에 여러 번 호출하지 않기 위한 락
let isRefreshing = false;
// refresh가 끝날 때까지 401 요청들을 잠시 보관했다가 한 번에 재처리
let requestQueue: Array<{
  resolve: (accessToken: string) => void;
  reject: (error: unknown) => void;
}> = [];

// refresh 성공/실패 결과를 큐에 쌓인 요청들에게 일괄 반영
const processQueue = (error: unknown, accessToken: string | null) => {
  requestQueue.forEach((request) => {
    if (error || !accessToken) {
      request.reject(error);
      return;
    }
    request.resolve(accessToken);
  });
  requestQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // 실패한 원본 요청을 꺼내서 토큰 갱신 뒤 재시도할 때 사용
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url ?? "";

    // Axios 내부 에러 등으로 config 자체가 없으면 복구 불가
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // refresh 요청 자체가 401이면 다시 refresh를 시도하면 무한루프가 되므로 제외
    const isRefreshRequest = requestUrl.includes("/auth/refresh");
    // 로그인/회원가입 실패는 토큰 만료 이슈가 아니므로 refresh 대상에서 제외
    const isAuthRequest =
      requestUrl.includes("/auth/login") || requestUrl.includes("/auth/signup");

    // 401이 아니거나 이미 재시도한 요청이면 그대로 실패 처리
    if (status !== 401 || originalRequest._retry || isRefreshRequest || isAuthRequest) {
      return Promise.reject(error);
    }

    // 같은 요청을 한 번만 재시도하도록 표시
    originalRequest._retry = true;

    // 이미 다른 요청이 refresh 진행 중이면 큐에 대기시키고 refresh 완료 후 재시도
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        requestQueue.push({
          resolve: (accessToken: string) => {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    // 이 요청이 refresh를 대표로 수행
    isRefreshing = true;

    try {
      // refreshToken 쿠키를 이용해 accessToken 재발급
      const refreshResponse = await apiClient.get<RefreshApiResponse>("/auth/refresh");
      const newAccessToken = refreshResponse.data?.data;

      if (!newAccessToken) {
        throw new Error("재발급된 access token이 없습니다.");
      }

      // 이후 요청들이 새 토큰을 사용하도록 저장
      localStorage.setItem("accessToken", newAccessToken);
      // 대기 중인 요청들을 새 토큰으로 재실행
      processQueue(null, newAccessToken);

      // 현재 실패했던 원본 요청도 새 토큰으로 즉시 재시도
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      // refresh까지 실패하면 인증 상태를 정리하고 대기 요청도 모두 실패시킴
      localStorage.removeItem("accessToken");
      processQueue(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      // refresh 성공/실패와 상관없이 락 해제
      isRefreshing = false;
    }
  },
);
