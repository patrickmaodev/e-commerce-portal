import apiClient from "../../api/client";
import API from "../../constants/API";
import { extractResult } from "../../api/response";

const withKey = (items, keyField = "id") =>
  items.map((item) => ({ ...item, key: item[keyField] ?? item.id }));

export const adminCatalogService = {
  getCategories: () =>
    apiClient.get(API.CATEGORIES).then((r) => withKey(r.data)),

  getCategoriesRaw: () =>
    apiClient.get(API.CATEGORIES).then((r) => r.data),

  createCategory: (data) =>
    apiClient.post(API.CATEGORIES, data).then((r) => r.data),

  updateCategory: (id, data) =>
    apiClient.put(`${API.CATEGORIES}/${id}`, data).then((r) => r.data),

  deleteCategory: (id) =>
    apiClient.delete(`${API.CATEGORIES}/${id}`),

  getProductStatuses: () =>
    apiClient.get(API.PRODUCT_STATUSES).then((r) => withKey(r.data)),

  createProductStatus: (data) =>
    apiClient.post(API.PRODUCT_STATUSES, data).then((r) => r.data),

  updateProductStatus: (id, data) =>
    apiClient.put(`${API.PRODUCT_STATUSES}/${id}`, data).then((r) => r.data),

  deleteProductStatus: (id) =>
    apiClient.delete(`${API.PRODUCT_STATUSES}/${id}`),

  getSubCategories: () =>
    apiClient.get(API.ADMIN_SUBCATEGORIES).then((r) => withKey(extractResult(r))),

  getSubCategoriesByCategory: (categoryId) =>
    apiClient
      .get(API.ADMIN_CATEGORY_SUBCATEGORIES(categoryId))
      .then((r) => extractResult(r)),

  getSpecifications: () =>
    apiClient.get(API.ADMIN_SPECIFICATIONS).then((r) => extractResult(r)),

  getSpecificationsBySubCategory: (subCategoryId) =>
    apiClient
      .get(API.ADMIN_SUBCATEGORY_SPECIFICATIONS(subCategoryId))
      .then((r) => extractResult(r)),

  createSubCategory: (data) =>
    apiClient.post(API.ADMIN_SUBCATEGORIES, data).then((r) => extractResult(r)),

  updateSubCategory: (id, data) =>
    apiClient.put(API.ADMIN_SUBCATEGORY(id), data).then((r) => extractResult(r) ?? r.data),

  deleteSubCategory: (id) =>
    apiClient.delete(API.ADMIN_SUBCATEGORY(id)),

  getSpecificationsList: () =>
    apiClient.get(API.ADMIN_SPECIFICATIONS).then((r) => withKey(extractResult(r))),

  createSpecifications: (data) =>
    apiClient.post(API.ADMIN_SPECIFICATIONS, data).then((r) => extractResult(r)),

  deleteSpecification: (id) =>
    apiClient.delete(API.ADMIN_SPECIFICATION(id)),

  getBanners: () =>
    apiClient.get(API.ADMIN_BANNERS).then((r) => withKey(r.data, "bannerId")),

  createBanner: (data) =>
    apiClient.post(API.ADMIN_BANNERS, data).then((r) => extractResult(r) ?? r.data),

  updateBanner: (id, data) =>
    apiClient.put(API.ADMIN_BANNERS_UPDATE(id), data).then((r) => r.data),

  deleteBanner: (id) =>
    apiClient.delete(API.ADMIN_BANNER(id)),
};
