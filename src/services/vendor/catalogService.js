import apiClient from "../../api/client";
import API from "../../constants/API";
import { extractResult } from "../../api/response";

export const vendorCatalogService = {
  getCategories: () =>
    apiClient.get(API.VENDOR_CATEGORIES).then((r) => r.data),

  getSubCategories: () =>
    apiClient.get(API.VENDOR_SUBCATEGORIES).then((r) => extractResult(r)),

  getSubCategoriesByCategory: (categoryId) =>
    apiClient
      .get(API.VENDOR_CATEGORY_SUBCATEGORIES(categoryId))
      .then((r) => extractResult(r)),

  getSpecificationsBySubCategory: (subCategoryId) =>
    apiClient
      .get(API.VENDOR_SUBCATEGORY_SPECIFICATIONS(subCategoryId))
      .then((r) => extractResult(r)),

  getProductStatuses: () =>
    apiClient.get(API.VENDOR_PRODUCT_STATUSES).then((r) => r.data),
};
