// lib/api.ts
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Create axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to set token for authenticated requests
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Initialize auth header from localStorage (client-side only)
export const initAuth = () => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) setAuthToken(token);
  } catch (e) {
    // ignore
  }
};

// Add request interceptor to ensure token is always included
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage on each request to ensure it's fresh
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// debug: expose baseURL in console for quick troubleshooting
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.debug('[api] baseURL ->', BASE_URL);
}
