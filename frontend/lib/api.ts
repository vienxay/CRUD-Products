import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/login") &&
      !window.location.pathname.startsWith("/register")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const BACKEND_URL = API_BASE.replace("/api", "");

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface AuthData {
  token: string;
  user: UserResponse;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: PaginationMeta;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ success: boolean; data: AuthData }>("/auth/login", {
      email,
      password,
    }),
  register: (email: string, password: string, name: string) =>
    api.post<{ success: boolean; data: AuthData }>("/auth/register", {
      email,
      password,
      name,
    }),
};

export const productApi = {
  getAll: (params?: ProductFilters) =>
    api.get<ProductsResponse>("/products", { params }),
  getById: (id: number) =>
    api.get<{ success: boolean; data: Product }>(`/products/${id}`),
  create: (data: FormData) =>
    api.post<{ success: boolean; data: Product }>("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id: number, data: FormData) =>
    api.put<{ success: boolean; data: Product }>(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id: number) => api.delete(`/products/${id}`),
};
