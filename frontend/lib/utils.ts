export const formatPrice = (price: number, currency = "NGN") => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatArea = (area: number, unit = "sqm") => {
  return `${area.toLocaleString()} ${unit}`;
};

export const getPropertyTypeLabel = (type: string) => {
  const labels = {
    HOUSE: "House",
    APARTMENT: "Apartment",
    LAND: "Land",
  };
  return labels[type as keyof typeof labels] || type;
};

export const getListingTypeLabel = (type: string) => {
  const labels = {
    SALE: "For Sale",
    RENT: "For Rent",
  };
  return labels[type as keyof typeof labels] || type;
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const getImageUrl = (imagePath: string) => {
  // If it's already a full URL (like Cloudinary), return as is
  if (imagePath.startsWith("http")) return imagePath;

  // For backward compatibility with local uploads
  if (imagePath.startsWith("/uploads")) {
    return `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    }${imagePath}`;
  }

  // Default case
  return imagePath;
};
// Utility function for combining class names
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Enhanced error handling utility
export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return "An unexpected error occurred";
}

// Format relative time
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - targetDate.getTime()) / 1000
  );

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return targetDate.toLocaleDateString();
}
