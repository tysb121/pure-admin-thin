import { http } from "@/utils/http";
import type { Result, ResultTable } from "@/utils/http/types";
/** 获取系统管理-用户管理列表 */
export const getUserList = (params?: object) => {
  return http.request<ResultTable>("get", "/user/findAll", { params });
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
  return http.request<Result>("post", "/user/delete", { data });
};
/** 获取用户详情 */
export const getUserDetail = (params?: object) => {
  return http.request<Result>("get", "/user/detail", { params });
};

/** 系统管理-用户管理-根据userId，获取对应角色id列表（userId：用户id） */
export const getRoleIds = (data?: object) => {
  return http.request<Result>("post", "/user/list-role-ids", { data });
};

export const bindUserRole = (data?: object) => {
  return http.request<Result>("post", "/user/bindUserRole", { data });
};

export const resetPassword = (data?: object) => {
  return http.request<Result>("post", "/user/resetPassword", { data });
};
