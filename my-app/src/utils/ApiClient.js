import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
  },
});

// Token admin ditambahkan otomatis pada setiap request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const API_ROOT = api.defaults.baseURL.replace(/\/api\/?$/, "");

export function getImageUrl(imagePath) {
  if (!imagePath) return null;
  if (/^https?:\/\//i.test(imagePath)) return imagePath;

  const cleanPath = imagePath.replace(/^\/+/, "");
  // Mendukung path lama "products/..." dan path baru "images/products/...".
  const normalizedPath = cleanPath.startsWith("products/")
    ? `images/${cleanPath}`
    : cleanPath;
  return `${API_ROOT}/${normalizedPath}`;
}

export default api;
