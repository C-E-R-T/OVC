import { apiClient } from "./apiClient";
import type {
  ApiResponse,
  CertDetail,
  CertDetailParams,
  CertPageData,
  CertSearchParams,
} from "../types/cert";

export const getCerts = async (
  params: CertSearchParams,
): Promise<ApiResponse<CertPageData>> => {
  const {
    categoryIds,
    keyword = "",
    page = 0,
    size = 10,
    sort = "name,ASC",
  } = params;

  const response = await apiClient.get<ApiResponse<CertPageData>>("/certs", {
    params: {
      categoryIds,
      keyword,
      page,
      size,
      sort,
    },
    paramsSerializer: {
      indexes: null,
    },
  });

  return response.data;
};

export const getCertDetails = async (
  params:CertDetailParams
) : Promise<ApiResponse<CertDetail>> => {
  const {certId} = params;

  const response = await apiClient.get<ApiResponse<CertDetail>>(`/certs/${certId}`);

  return response.data;
}