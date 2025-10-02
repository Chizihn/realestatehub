export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SearchFilters {
  q?: string; // General search query
  state?: string;
  city?: string;
  propertyType?: string;
  listingType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  sortBy?: "newest" | "price_asc" | "price_desc";
}

export interface PropertyCreateInput {
  title: string;
  description?: string;
  price: number;
  state: string;
  city: string;
  neighborhood?: string;
  address: string;
  propertyType: "HOUSE" | "APARTMENT" | "LAND";
  listingType: "SALE" | "RENT";
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  areaUnit?: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

export interface PropertyUpdateInput extends Partial<PropertyCreateInput> {
  status?: "ACTIVE" | "INACTIVE" | "SOLD" | "RENTED";
}
export interface UserRegisterInput {
  email: string;
  password: string;
  name: string;
  role?: "BUYER" | "SELLER" | "AGENT";
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    isEmailVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// AuthenticatedRequest moved to types/express.ts

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}
