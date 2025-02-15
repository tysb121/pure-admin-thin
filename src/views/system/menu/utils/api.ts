import { http } from "@/utils/http";
import type { Result, ResultList } from "@/utils/http/types";

/** 获取系统管理-菜单管理列表 */
export const getMenuList = (params?: object) => {
  return http.request<ResultList>("get", "/menu/list", { params });
};

/** 创建菜单 */
export const createMenu = (data?: object) => {
  return http.request<Result>("post", "/menu/create", { data });
};
/** 更新菜单 */
export const updateMenu = (data?: object) => {
  return http.request<Result>("post", "/menu/update", { data });
};
/** 删除菜单 */
export const deleteMenu = (data?: object) => {
  return http.request<Result>("post", "/menu/delete", { data });
};
/** 获取菜单详情 */
export const getMenuDetail = (params?: object) => {
  return http.request<Result>("get", "/menu/detail", { params });
};
