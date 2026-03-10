import { apiClient } from "./apiClient";
import type { ApiResponse } from "../types/cert";
import type { SettingCategory } from "../types/category";

export const getCategory = async (): Promise<ApiResponse<SettingCategory[]>> => {
  const response =
    await apiClient.get<ApiResponse<SettingCategory[]>>("/categories");

  return response.data;
};
