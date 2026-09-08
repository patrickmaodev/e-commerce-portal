import apiClient from "../../api/client";
import API from "../../constants/API";

export const authService = {
  adminLogin: (credentials) =>
    apiClient.post(API.ADMIN_LOGIN, credentials).then((r) => r.data),

  vendorLogin: (credentials) =>
    apiClient.post(API.VENDOR_LOGIN, credentials).then((r) => r.data),

  vendorRegister: (payload) =>
    apiClient.post(API.VENDOR_REGISTER, payload).then((r) => r.data),

  logout: () => apiClient.post(API.LOGOUT),
};
