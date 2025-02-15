import { http } from "@/utils/http";
import type { Result, ResultList } from "@/utils/http/types";
/** 获取系统管理-部门管理列表 */
export const getDeptList = (data?: object) => {
  return http.request<ResultList>("get", "/dept/findAll", { data });
};
/** 创建部门 */
export const createDept = (data?: object) => {
  return http.request<Result>("post", "/dept/create", { data });
};
/** 更新部门 */
export const updateDept = (data?: object) => {
  return http.request<Result>("post", "/dept/update", { data });
};
/** 删除部门 */
export const deleteDept = (data?: object) => {
  return http.request<Result>("post", "/dept/delete", { data });
};
/** 获取部门详情 */
export const getDeptDetail = (data?: object) => {
  return http.request<Result>("get", "/dept/detail", { data });
};
