import { useQuery } from "@tanstack/react-query";
import { getCerts } from "../api/certSearch";
import type { CertSearchParams } from "../types/cert";
import { keepPreviousData } from "@tanstack/react-query"; // 페이지 이동 시 깜빡임 줄이기

export const useCertSearch = (params: CertSearchParams) => {
  return useQuery({
    queryKey: ["certs", params],
    queryFn: () => getCerts(params),
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh
    gcTime: 1000 * 60 * 10, //10분 동안 캐시 유지
    placeholderData: keepPreviousData, // 페이지 1 -> 페이지 2 바뀔 때 이전 데이터 유지하면서 로딩
  });
};