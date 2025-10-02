"use client";

import { Property } from "@/types";
import {
  formatPrice,
  formatArea,
  getPropertyTypeLabel,
  getListingTypeLabel,
  truncateText,
  getImageUrl,
  cn,
  formatRelativeTime,
} from "@/lib/utils";
import {
  Heart,
  MapPin,
  Home,
  Bed,
  Bath,
  Square,
  Eye,
  Calendar,
  Bookmark,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Badge from "./ui/Badge";

interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: (propertyId: string, isFavorite: boolean) => void;
  isFavorite?: boolean;
  variant?: "default" | "compact" | "featured";
  showActions?: boolean;
}

export default function PropertyCard({
  property,
  onFavoriteToggle,
  isFavorite = false,
  variant = "default",
  showActions = true,
}: PropertyCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isToggling || !onFavoriteToggle) return;

    setIsToggling(true);
    try {
      onFavoriteToggle(property.id, !isFavorite);
    } finally {
      setIsToggling(false);
    }
  };

  const mainImage = property.images[0] || "/placeholder-property.png";
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";

  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <div
        className={cn(
          "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300",
          "hover:shadow-xl hover:border-gray-200 hover:-translate-y-1",
          isFeatured && "ring-2 ring-primary-100 shadow-lg"
        )}
      >
        {/* Image Container */}
        <div
          className={cn(
            "relative overflow-hidden bg-gray-100",
            isCompact ? "h-40" : "h-56"
          )}
        >
          <Image
            src={getImageUrl(mainImage)}
            alt={property.title}
            fill
            className={cn(
              "object-cover transition-all duration-500 group-hover:scale-105",
              imageLoading && "blur-sm",
              imageError && "opacity-50"
            )}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <Badge
              variant={property.listingType === "SALE" ? "success" : "info"}
              className="backdrop-blur-sm bg-white/90 shadow-sm"
            >
              {getListingTypeLabel(property.listingType)}
            </Badge>
            {isFeatured && (
              <Badge
                variant="warning"
                className="backdrop-blur-sm bg-white/90 shadow-sm"
              >
                Featured
              </Badge>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="absolute top-3 right-3 flex space-x-2">
              {onFavoriteToggle && (
                <button
                  onClick={handleFavoriteClick}
                  disabled={isToggling}
                  className={cn(
                    "p-2 rounded-full backdrop-blur-sm bg-white/90 shadow-sm transition-all duration-200",
                    "hover:bg-white hover:scale-110",
                    isToggling && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Heart
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isFavorite
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600 hover:text-red-500"
                    )}
                  />
                </button>
              )}
              <button className="p-2 rounded-full backdrop-blur-sm bg-white/90 shadow-sm hover:bg-white hover:scale-110 transition-all duration-200">
                <Bookmark className="w-4 h-4 text-gray-600 hover:text-primary-600" />
              </button>
            </div>
          )}

          {/* Image Count Indicator */}
          {property.images.length > 1 && (
            <div className="absolute bottom-3 right-3 flex items-center space-x-1 px-2 py-1 rounded-full backdrop-blur-sm bg-black/50 text-white text-xs">
              <Eye className="w-3 h-3" />
              <span>{property.images.length}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={cn("p-5", isCompact && "p-4")}>
          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <p
              className={cn(
                "font-bold text-primary-600",
                isCompact ? "text-lg" : "text-xl"
              )}
            >
              {formatPrice(property.price)}
              {property.listingType === "RENT" && (
                <span className="text-sm font-normal text-gray-500 ml-1">
                  /year
                </span>
              )}
            </p>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              {formatRelativeTime(property.createdAt)}
            </div>
          </div>

          {/* Title */}
          <h3
            className={cn(
              "font-semibold text-gray-900 mb-2 line-clamp-2",
              isCompact ? "text-base" : "text-lg"
            )}
          >
            {truncateText(property.title, isCompact ? 40 : 60)}
          </h3>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm truncate">
              {property.neighborhood ? `${property.neighborhood}, ` : ""}
              {property.city}, {property.state}
            </span>
          </div>

          {/* Property Details */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Home className="w-4 h-4 mr-1" />
                <span>{getPropertyTypeLabel(property.propertyType)}</span>
              </div>
              <div className="flex items-center">
                <Square className="w-4 h-4 mr-1" />
                <span>{formatArea(property.area, property.areaUnit)}</span>
              </div>
            </div>
          </div>

          {/* Bedroom/Bathroom Info */}
          {(property.bedrooms || property.bathrooms) && !isCompact && (
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              {property.bedrooms && (
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  <span>
                    {property.bedrooms} bed{property.bedrooms > 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center">
                  <Bath className="w-4 h-4 mr-1" />
                  <span>
                    {property.bathrooms} bath{property.bathrooms > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {property.description && !isCompact && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {truncateText(property.description, 100)}
            </p>
          )}

          {/* Contact Info */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-primary-600">
                  {property.contactName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {property.contactName}
                </p>
                <p className="text-xs text-gray-500">Agent</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Listed</p>
              <p className="text-xs font-medium text-gray-900">
                {formatRelativeTime(property.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
