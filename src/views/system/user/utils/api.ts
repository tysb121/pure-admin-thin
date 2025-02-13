import { http } from "@/utils/http";
import type { Result, ResultTable } from "@/utils/http/types";
/** 获取系统管理-用户管理列表 */
export const getUserList = (data?: object) => {
  return http.request<ResultTable>("get", "/user/findAll", { data });
};
/** 创建用户 */
export const createUser = (data?: object) => {
  return http.request<Result>("post", "/user/create", { data });
};
/** 更新用户 */
export const updateUser = (data?: object) => {
  return http.request<Result>("post", "/user/update", { data });
};
/** 删除用户 */
export const deleteUser = (data?: object) => {
  return http.request<Result>("delete", "/user/delete", { data });
};
/** 获取用户详情 */
export const getUserDetail = (data?: object) => {
  return http.request<Result>("get", "/user/detail", { data });
};
