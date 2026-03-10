import { useQuery } from "@tanstack/react-query";
import { getCerts } from "../api/cert";
import type { CertSearchParams } from "../types/cert";

export const useCertSearch = (params: CertSearchParams) => {
  return useQuery({
    queryKey: ["certs", params],
    queryFn: () => getCerts(params),
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh
    gcTime: 1000 * 60 * 10, //10분 동안 캐시 유지
  });
};