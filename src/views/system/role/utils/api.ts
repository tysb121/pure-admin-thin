import { http } from "@/utils/http";
import type { Result, ResultTable } from "@/utils/http/types";
/** 获取系统管理-用户管理列表 */
export const getRoleList = (data?: object) => {
  return http.request<ResultTable>("get", "/role/findAll", { data });
};
/** 创建用户 */
export const createRole = (data?: object) => {
  return http.request<Result>("post", "/role/create", { data });
};
/** 更新用户 */
export const updateRole = (data?: object) => {
  return http.request<Result>("post", "/role/update", { data });
};
/** 删除用户 */
export const deleteRole = (data?: object) => {
  return http.request<Result>("delete", "/role/delete", { data });
};
/** 获取用户详情 */
export const getRoleDetail = (data?: object) => {
  return http.request<Result>("get", "/role/detail", { data });
};
