import axios from "axios";
import { PATH } from "../constants/PATH";
import { triggerLogout } from "../utils/authBridge";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response && (response.status === 401 || response.status === 403)) {
      triggerLogout();
      const isAdminPath = window.location.pathname.startsWith(PATH.ADMIN_HOME);
      window.location.href = isAdminPath
        ? PATH.AUTH_ADMIN_LOGIN
        : PATH.AUTH_VENDOR_LOGIN;
    }

    return Promise.reject(error);
  }
);

export default apiClient;
