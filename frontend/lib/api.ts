import axios from "axios";
import { authStorage } from "./auth";
import {
  ApiResponse,
  PaginatedResponse,
  Property,
  SearchFilters,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: any) => {
    const token = authStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: any) => {
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = authStorage.getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            {
              refreshToken,
            }
          );

          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data;
          authStorage.setTokens({ accessToken, refreshToken: newRefreshToken });

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        authStorage.clearAuth();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Property API functions
export const propertyApi = {
  getAll: (filters?: SearchFilters) =>
    api.get<ApiResponse<PaginatedResponse<Property>>>("/properties", {
      params: filters,
    }),

  getById: (id: string) => api.get<ApiResponse<Property>>(`/properties/${id}`),

  create: (data: Partial<Property>) =>
    api.post<ApiResponse<Property>>("/properties", data),

  update: (id: string, data: Partial<Property>) =>
    api.put<ApiResponse<Property>>(`/properties/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/properties/${id}`),

  uploadImages: (id: string, files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });
    return api.post<ApiResponse<Property>>(
      `/properties/${id}/images`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },
};

// Search API functions
export const searchApi = {
  search: (filters: SearchFilters) =>
    api.get<ApiResponse<PaginatedResponse<Property>>>("/search", {
      params: filters,
    }),

  getLocations: () =>
    api.get<ApiResponse<Array<{ state: string; city: string; count: number }>>>(
      "/search/locations"
    ),

  getPropertyTypes: () =>
    api.get<ApiResponse<Array<{ type: string; count: number }>>>(
      "/search/types"
    ),
};

// Favorites API functions
export const favoritesApi = {
  getAll: () =>
    api.get<ApiResponse<Array<{ property: Property }>>>("/favorites"),

  add: (propertyId: string) =>
    api.post<ApiResponse<any>>(`/favorites/${propertyId}`),

  remove: (propertyId: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/favorites/${propertyId}`),

  check: (propertyId: string) =>
    api.get<ApiResponse<{ isFavorite: boolean }>>(
      `/favorites/${propertyId}/check`
    ),
};

export default api;
// Authentication API functions
export const authApi = {
  register: (data: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }) =>
    api.post<ApiResponse<{ user: any; message: string }>>(
      "/auth/register",
      data
    ),

  login: (data: { email: string; password: string }) =>
    api.post<
      ApiResponse<{ user: any; accessToken: string; refreshToken: string }>
    >("/auth/login", data),

  logout: () => api.post<ApiResponse<{ message: string }>>("/auth/logout"),

  refreshToken: (data: { refreshToken: string }) =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      "/auth/refresh-token",
      data
    ),

  verifyEmail: (data: { token: string }) =>
    api.post<ApiResponse<{ message: string }>>("/auth/verify-email", data),

  forgotPassword: (data: { email: string }) =>
    api.post<ApiResponse<{ message: string }>>("/auth/forgot-password", data),

  resetPassword: (data: { token: string; newPassword: string }) =>
    api.post<ApiResponse<{ message: string }>>("/auth/reset-password", data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post<ApiResponse<{ message: string }>>("/auth/change-password", data),

  getProfile: () => api.get<ApiResponse<any>>("/auth/profile"),

  updateProfile: (data: { name?: string; role?: string }) =>
    api.put<ApiResponse<any>>("/auth/profile", data),
};

// Admin API functions
export const adminApi = {
  getDashboardStats: () => api.get<ApiResponse<any>>("/admin/dashboard"),

  // User management
  getAllUsers: (params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }) => api.get<ApiResponse<any>>("/admin/users", { params }),

  updateUserRole: (userId: string, role: string) =>
    api.put<ApiResponse<any>>(`/admin/users/${userId}/role`, { role }),

  suspendUser: (userId: string, reason?: string) =>
    api.post<ApiResponse<any>>(`/admin/users/${userId}/suspend`, { reason }),

  // Property management
  getAllProperties: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    propertyType?: string;
  }) => api.get<ApiResponse<any>>("/admin/properties", { params }),

  updatePropertyStatus: (propertyId: string, status: string, reason?: string) =>
    api.put<ApiResponse<any>>(`/admin/properties/${propertyId}/status`, {
      status,
      reason,
    }),

  deleteProperty: (propertyId: string, reason?: string) =>
    api.delete<ApiResponse<any>>(`/admin/properties/${propertyId}`, {
      data: { reason },
    }),

  // Reports
  getReports: (params: {
    type: string;
    startDate?: string;
    endDate?: string;
  }) => api.get<ApiResponse<any>>("/admin/reports", { params }),
};
