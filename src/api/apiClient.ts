//axios 공통 설정 파일
//axios를 매번 직접 호출하지 않고, 공통 인스턴스인 apiClient를 만들어 
// 모든 API 요청이 이 객체를 통하도록 설계
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

//axios 인스턴스 생성
export const apiClient = axios.create({
  //API 주소의 공통 시작점
  baseURL: import.meta.env.VITE_API_BASE_URL,
  //요청이 너무 오래 걸릴 경우 무한 대기를 방지하기 위함
  timeout: 5000,
  //refreshToken이 쿠키에 있을 때 함께 전송되도록 설정
  withCredentials: true,
  headers: {
    //JSON 형식 요청이라는 공통 헤더 설정
    "Content-Type": "application/json",
  },
});

//요청이 서버로 나가기 직전에 실행됨
//요청 인터셉터를 통해 accessToken을 모든 요청 헤더에 자동으로 추가
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  // localStorage에 저장된 accessToken이 있으면
  // Authorization 헤더에 자동으로 붙임
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
  //에러 발생 시 실행되는 함수
  async (error: AxiosError) => {
    // 실패한 원본 요청을 꺼내는 부분
    //RetryableRequestConfig는 Axios 요청 객체에 _retry 같은 사용자 정의 속성을 추가해서 재시도된 요청인지를 추적하기 위해 사용하는 타입
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    //에러 응답의 HTTP 상태 코드를 꺼내는 부분
    const status = error.response?.status;
    //실패한 요청의 URL을 문자열로 꺼내는 부분
    const requestUrl = originalRequest?.url ?? "";

    // Axios 내부 에러 등으로 config 자체가 없으면 복구 불가
    // 원래 요청 정보가 없으면 복구 자체가 불가능하므로 실패 처리
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // refresh 요청 자체가 401이면 다시 refresh를 시도하면 무한루프가 되므로 제외
    const isRefreshRequest = requestUrl.includes("/auth/refresh");
    // 로그인/회원가입 실패는 토큰 만료 이슈가 아니므로 refresh 대상에서 제외
    const isAuthRequest =
      requestUrl.includes("/auth/login") || requestUrl.includes("/auth/signup");

    // status !== 401 -> 401이 아니면 토큰 만료 문제가 아니므로 refresh 불필요
    //originalRequest._retry -> 이미 한 번 재시도한 요청이면 또 시도하지 않음
    // isRefreshRequest -> refresh 요청 자체가 실패했는데 또 refresh를 하면 무한 반복
    //isAuthRequest -> 로그인/회원가입 실패는 토큰 만료와 관계 없기 때문에 제외
    //발생하는 에러가 진짜 토큰만료 때문에 발생한 401인지 확인 -> 위 중 하나라도 해당하면 refresh 작업을 하지 않고 바로 실패 처리
    if (status !== 401 || originalRequest._retry || isRefreshRequest || isAuthRequest) {
      return Promise.reject(error);
    }

    // 같은 요청을 한 번만 재시도하도록 표시
    originalRequest._retry = true;

    // 이미 다른 요청이 refresh 진행 중이면 requestQueue에 대기시키고 refresh 완료 후 재시도
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

    //accessToken이 만료되어 401이 발생했을 때 refreshToken으로 
    // 새 accessToken을 발급받고, 실패했던 원래 요청을 다시 보내는 로직

    // 이 요청이 refresh를 대표로 수행
    isRefreshing = true;

    try {
      // 401 발생 시 refresh 쿠키를 이용해 /auth/refresh를 호출하고, 서버로부터 새로운 accessToken을 받아옴
      const refreshResponse = await apiClient.get<RefreshApiResponse>("/auth/refresh");
      //서버의 응답 안에서 실제 새 accessToken만 꺼냄
      const newAccessToken = refreshResponse.data?.data;

      //서버가 응답은 했지만 토큰 값이 비어있을 경우를 대비하여 
      // 실제 accessToken이 존재하는지 검증
      if (!newAccessToken) {
        throw new Error("재발급된 access token이 없습니다.");
      }

      // 이후 요청들이 새 토큰을 사용하도록 저장
      localStorage.setItem("accessToken", newAccessToken);
      // 대기 중인 요청들을 새 토큰으로 재실행
      processQueue(null, newAccessToken);

      // 현재 실패했던 원본 요청도 새 토큰으로 즉시 재시도
      //원래 실패했던 요청의 headers 객체가 없을 수도 있으니 없다면 빈 객체 주입
      originalRequest.headers = originalRequest.headers ?? {};
      //이전에 실패했던 요청은 만료된 토큰을 가지고 있었기 때문에 새 accessToken 넣어줌
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      //이제 수정된 원래 요청을 다시 서버로 보냄
      return apiClient(originalRequest);
    } catch (refreshError) {
      // refresh까지 실패하면 유효한 인증 상태가 아니라고 판단하고 기존 accessToken 제거
      localStorage.removeItem("accessToken");
      //큐에서 기다리고 있었던 요청들도 복구 불가능함을 알려줌
      //리프레시 실패, 새 토큰 없음
      processQueue(refreshError, null);
      //최종적으로 이 요청은 실패라고 호출한 쪽에 알려줌
      return Promise.reject(refreshError);
    } finally {
      // refresh 성공/실패와 상관없이 refresh 작업이 끝남을 알려줌
      isRefreshing = false;
    }
  },
);
