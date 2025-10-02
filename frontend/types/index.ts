export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  state: string;
  city: string;
  neighborhood?: string;
  address: string;
  propertyType: "HOUSE" | "APARTMENT" | "LAND";
  listingType: "SALE" | "RENT";
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  areaUnit: string;
  images: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  state?: string;
  city?: string;
  propertyType?: string;
  listingType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  sortBy?: "newest" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  properties: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "BUYER" | "SELLER" | "AGENT" | "ADMIN";
  isEmailVerified: boolean;
}
