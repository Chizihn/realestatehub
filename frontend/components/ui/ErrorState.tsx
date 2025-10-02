"use client";

import {
  AlertTriangle,
  RefreshCw,
  Home,
  Wifi,
  Server,
  Shield,
} from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
  error: string | Error;
  onRetry?: () => void;
  className?: string;
}

function getErrorDetails(error: string | Error) {
  const errorMessage = typeof error === "string" ? error : error.message;

  // Network errors
  if (
    errorMessage.includes("Network Error") ||
    errorMessage.includes("fetch")
  ) {
    return {
      icon: Wifi,
      title: "Connection Problem",
      message: "Please check your internet connection and try again.",
      type: "network" as const,
    };
  }

  // Authentication errors
  if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
    return {
      icon: Shield,
      title: "Authentication Required",
      message: "Please log in to access this feature.",
      type: "auth" as const,
    };
  }

  // Server errors
  if (errorMessage.includes("500") || errorMessage.includes("Server Error")) {
    return {
      icon: Server,
      title: "Server Error",
      message: "Something went wrong on our end. Please try again later.",
      type: "server" as const,
    };
  }

  // Not found errors
  if (errorMessage.includes("404") || errorMessage.includes("not found")) {
    return {
      icon: Home,
      title: "Not Found",
      message: "The resource you're looking for doesn't exist.",
      type: "notfound" as const,
    };
  }

  // Generic error
  return {
    icon: AlertTriangle,
    title: "Something went wrong",
    message: errorMessage || "An unexpected error occurred.",
    type: "generic" as const,
  };
}

export default function ErrorState({
  error,
  onRetry,
  className,
}: ErrorStateProps) {
  const { icon: Icon, title, message, type } = getErrorDetails(error);

  const colorClasses = {
    network: "text-blue-600 bg-blue-50 border-blue-200",
    auth: "text-amber-600 bg-amber-50 border-amber-200",
    server: "text-red-600 bg-red-50 border-red-200",
    notfound: "text-gray-600 bg-gray-50 border-gray-200",
    generic: "text-red-600 bg-red-50 border-red-200",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-6 ${className}`}
    >
      <div className={`p-4 rounded-full mb-4 border-2 ${colorClasses[type]}`}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
}

export function ErrorBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return <div>{children}</div>;
}
