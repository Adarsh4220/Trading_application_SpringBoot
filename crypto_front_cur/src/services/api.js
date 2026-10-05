import axios from "axios";
import { API_BASE_URL, TOKEN_KEY } from "../config/apiConfig";
import { getApiErrorMessage } from "../utils/errors";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new CustomEvent("cryptox:unauthorized"));
      const path = window.location.pathname;
      const isAuthPage = ["/login", "/register", "/forgot-password", "/verify-otp", "/reset-password"].includes(path);
      const requestUrl = String(error.config?.url || "");
      const isAuthApi = requestUrl.includes("/auth/");
      if (!isAuthPage && !isAuthApi) {
        window.location.assign("/login");
      }
    }

    error.userMessage = getApiErrorMessage(error);
    return Promise.reject(error);
  }
);

export default api;
