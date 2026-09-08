import apiClient from "../../api/client";
import API from "../../constants/API";
import { buildPageQuery, normalizePageResponse } from "../../api/response";

export const orderService = {
  getOrders: ({ page = 0, size = 20, search = "" }) =>
    apiClient
      .get(`${API.ADMIN_ORDERS}?${buildPageQuery({ page, size, search })}`)
      .then(normalizePageResponse),
};
