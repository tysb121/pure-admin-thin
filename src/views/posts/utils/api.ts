import { http } from "@/utils/http";
import type { Result, ResultTable } from "@/utils/http/types";
/** 获取列表 */
export const getPostsList = (params?: object) => {
  return http.request<ResultTable>("get", "/posts/page", { params });
};
/** 创建 */
export const createPosts = (data?: object) => {
  return http.request<Result>("post", "/posts/create", { data });
};
/** 更新 */
export const updatePosts = (data?: object) => {
  return http.request<Result>("post", "/posts/update", { data });
};
/** 删除 */
export const deletePosts = (data?: object) => {
  return http.request<Result>("post", "/posts/delete", { data });
};
/** 获取详情 */
export const getPostsDetail = (params?: object) => {
  return http.request<Result>("get", "/posts/detail", { params });
};
