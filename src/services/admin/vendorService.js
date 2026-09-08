import apiClient from "../../api/client";
import API from "../../constants/API";
import { buildPageQuery, normalizePageResponse } from "../../api/response";

export const vendorService = {
  getVendors: ({ page = 0, size = 20, search = "" }) =>
    apiClient
      .get(`${API.VENDORS}?${buildPageQuery({ page, size, search })}`)
      .then(normalizePageResponse),

  createVendor: (data) =>
    apiClient.post(API.VENDORS, data).then((r) => r.data),

  updateVendor: (id, data) =>
    apiClient.put(`${API.VENDORS}/${id}`, data).then((r) => r.data),

  deleteVendor: (id) =>
    apiClient.delete(`${API.VENDORS}/${id}`),
};
