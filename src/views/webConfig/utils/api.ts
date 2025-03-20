import { http } from "@/utils/http";
import type { Result, ResultTable } from "@/utils/http/types";
/** 获取列表 */
export const getWebConfig = (params?: object) => {
  return http.request<ResultTable>("get", "/web-config/page", { params });
};
/** 创建 */
export const createWebConfig = (data?: object) => {
  return http.request<Result>("post", "/web-config/add", { data });
};
/** 更新 */
export const updateWebConfig = (data?: object) => {
  return http.request<Result>("post", "/web-config/update", { data });
};
/** 删除 */
export const deleteWebConfig = (data?: object) => {
  return http.request<Result>("post", "/web-config/delete", { data });
};
/** 获取详情 */
export const getWebConfigDetail = (params?: object) => {
  return http.request<Result>("get", "/web-config/detail", { params });
};

// 获取最新配置
export const getNewConfig = (params?: object) => {
  return http.request<Result>("get", "/web-config/getNewConfig", { params });
};
