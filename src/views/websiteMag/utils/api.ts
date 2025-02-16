import { http } from "@/utils/http";
import type { Result, ResultTable } from "@/utils/http/types";
/** 获取列表 */
export const getWebsiteList = (params?: object) => {
  return http.request<ResultTable>("get", "/website/page", { params });
};
/** 创建 */
export const createWebsite = (data?: object) => {
  return http.request<Result>("post", "/website/create", { data });
};
/** 更新 */
export const updateWebsite = (data?: object) => {
  return http.request<Result>("post", "/website/update", { data });
};
/** 删除 */
export const deleteWebsite = (data?: object) => {
  return http.request<Result>("post", "/website/delete", { data });
};
/** 获取详情 */
export const getWebsiteDetail = (params?: object) => {
  return http.request<Result>("get", "/website/detail", { params });
};
