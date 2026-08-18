import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.kingcreativestudio.my.id/pacu-tumbuh/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("pacu_tumbuh_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear and optionally redirect
      const isAuthRoute = window.location.pathname.includes("/admin");
      if (isAuthRoute && !window.location.pathname.includes("/admin/login")) {
        localStorage.removeItem("pacu_tumbuh_token");
        localStorage.removeItem("pacu_tumbuh_user");
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);
