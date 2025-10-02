"use client";

import { useState, useEffect } from "react";
import { favoritesApi } from "@/lib/api";
import { Property } from "@/types";
import PropertyCard from "@/components/PropertyCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Heart, Loader2 } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await favoritesApi.getAll();
      setFavorites(response.data.data.map((fav) => fav.property));
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || "Failed to fetch favorites"
      );
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async (
    propertyId: string,
    isFavorite: boolean
  ) => {
    try {
      if (!isFavorite) {
        await favoritesApi.remove(propertyId);
        setFavorites((prev) =>
          prev.filter((property) => property.id !== propertyId)
        );
      }
      // Note: We don't handle adding to favorites here since this is the favorites page
      // and properties should already be favorited
    } catch (err: any) {
      console.error("Error removing from favorites:", err);
      // You could show a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Loading your favorites...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <p className="text-lg font-semibold">Error loading favorites</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={fetchFavorites}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div>
        {/* Header */}
        <div className="flex items-center mb-8">
          <Heart className="w-8 h-8 text-red-500 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Favorite Properties
            </h1>
            <p className="text-gray-600 mt-1">
              {favorites.length}{" "}
              {favorites.length === 1 ? "property" : "properties"} saved
            </p>
          </div>
        </div>

        {/* Empty State */}
        {favorites.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start browsing properties and save your favorites to see them here
            </p>
            <Link
              href="/"
              className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        )}

        {/* Favorites Grid */}
        {favorites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavoriteToggle={handleFavoriteToggle}
                isFavorite={true}
              />
            ))}
          </div>
        )}

        {/* Back to Browse */}
        {favorites.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/"
              className="px-6 py-3 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 transition-colors"
            >
              Browse More Properties
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
