import { http } from "@/utils/http";
import type { Result, ResultTable, ResultList } from "@/utils/http/types";

/** 字典列表 */
export const getDictList = (params?: object) => {
  return http.request<ResultList>("get", "/dict/list", { params });
};
/** 创建字典 */
export const createDict = (data?: object) => {
  return http.request<Result>("post", "/dict/create", { data });
};
/** 更新字典 */
export const updateDict = (data?: object) => {
  return http.request<Result>("post", "/dict/update", { data });
};
/** 删除字典 */
export const removeDict = (data?: object) => {
  return http.request<Result>("post", "/dict/delete", { data });
};
/** 获取字典详情 */
export const getDictDetail = (params?: object) => {
  return http.request<Result>("get", "/dict/detail", { params });
};

/** 字典项列表 */
export const getDictItemList = (params?: object) => {
  return http.request<ResultTable>("get", "/dict-item/getDictItemList", {
    params
  });
};
/** 创建字典项 */
export const createDictItem = (data?: object) => {
  return http.request<Result>("post", "/dict-item/create", { data });
};
/** 更新字典项 */
export const updateDictItem = (data?: object) => {
  return http.request<Result>("post", "/dict-item/update", { data });
};
/** 删除字典项 */
export const removeDictItem = (data?: object) => {
  return http.request<Result>("post", "/dict-item/delete", { data });
};
/** 获取字典项详情 */
export const getDictItemDetail = (params?: object) => {
  return http.request<Result>("get", "/dict-item/detail", { params });
};
