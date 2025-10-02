"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, authStorage } from "@/lib/auth";
import { authApi } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    role?: string
  ) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = authStorage.getUser();
    const accessToken = authStorage.getAccessToken();

    if (storedUser && accessToken) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      const { user: userData, accessToken, refreshToken } = response.data.data;

      authStorage.setTokens({ accessToken, refreshToken });
      authStorage.setUser(userData);
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || "Login failed");
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role = "BUYER"
  ) => {
    try {
      await authApi.register({ email, password, name, role });
      // Note: User needs to verify email before they can login
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error?.message || "Registration failed"
      );
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      authStorage.clearAuth();
      setUser(null);
    }
  };

  const refreshAuth = async () => {
    try {
      const refreshToken = authStorage.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token");
      }

      const response = await authApi.refreshToken({ refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;

      authStorage.setTokens({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
