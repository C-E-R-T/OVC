import type { CertificateRankingItem, CertificateRankingResponse } from "../types/certificateRank";
import { apiClient } from "./apiClient";

export const getCertificateRanking = async (
  limit = 10
): Promise<CertificateRankingItem[]> => {
  const response = await apiClient.get<CertificateRankingResponse>(
    "/api/certs/rank",
    {
      params: { limit },
    }
  );

  console.log("랭킹 데이터:", response.data);
  return response.data.data ?? [];
};