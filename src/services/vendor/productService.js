import apiClient from "../../api/client";
import API from "../../constants/API";
import { buildPageQuery, normalizePageResponse } from "../../api/response";

const multipartHeaders = { headers: { "Content-Type": "multipart/form-data" } };

export const productService = {
  getVendorProducts: ({ page = 0, size = 20, search = "" }) =>
    apiClient
      .get(`${API.VENDOR_PRODUCTS}?${buildPageQuery({ page, size, search })}`)
      .then(normalizePageResponse),

  getVendorProduct: (id) =>
    apiClient.get(API.VENDOR_PRODUCT(id)).then((r) => r.data),

  createProduct: (formData) =>
    apiClient.post(API.VENDOR_PRODUCTS, formData, multipartHeaders).then((r) => r.data),

  updateProduct: (id, formData) =>
    apiClient.put(API.VENDOR_PRODUCT_UPDATE(id), formData, multipartHeaders).then((r) => r.data),

  deleteProduct: (id) =>
    apiClient.delete(`${API.VENDOR_PRODUCTS}/${id}`),
};
