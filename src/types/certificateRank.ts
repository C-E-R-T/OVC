export interface CertificateRankingItem {
  certId: number;
  name: string;
  likeCount: number;
}

export interface CertificateRankingResponse {
  status: number;
  message: string;
  data: CertificateRankingItem[];
  path: string;
  timestamp: string;
}