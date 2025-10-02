"use client";

import { useState, useEffect } from "react";
import { favoritesApi, searchApi } from "@/lib/api";
import { Property, SearchFilters as SearchFiltersType } from "@/types";
import PropertyCard from "@/components/PropertyCard";
import SearchFilters from "@/components/SearchFilters";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { LoadingGrid } from "@/components/ui/LoadingSpinner";
import ErrorState from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { getErrorMessage } from "@/lib/utils";
import Link from "next/link";

export default function HomePage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFiltersType>({
    sortBy: "newest",
    page: 1,
    limit: 12,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalStates: 0,
    totalAgents: 0,
    avgPrice: 0,
  });

  const fetchProperties = async (
    searchFilters: SearchFiltersType = filters
  ) => {
    try {
      setLoading(true);
      setError(null);
      console.log("Searching with filters:", searchFilters);
      const response = await searchApi.search(searchFilters);
      console.log("Search response:", response.data.data);
      setProperties(response.data.data.properties);
      setPagination(response.data.data.pagination);

      // Calculate stats
      const total = response.data.data.pagination.total;
      const avgPrice =
        response.data.data.properties.length > 0
          ? response.data.data.properties.reduce((sum, p) => sum + p.price, 0) /
            response.data.data.properties.length
          : 0;

      // Get actual stats from API if available, otherwise use calculated values
      setStats({
        totalProperties: total,
        totalStates: 36, // Nigeria has 36 states
        totalAgents: Math.floor(total * 0.15), // Estimated based on properties
        avgPrice: avgPrice,
      });
    } catch (err: any) {
      setError(getErrorMessage(err));
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    try {
      const response = await favoritesApi.getAll();
      const favoriteIds = new Set(
        response.data.data.map((fav: any) => fav.property.id)
      );
      setFavorites(favoriteIds);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  useEffect(() => {
    fetchProperties();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    const updatedFilters = { ...newFilters, page: 1 };
    setFilters(updatedFilters);
    // Automatically search when filters change
    fetchProperties(updatedFilters);
  };

  const handleSearch = async () => {
    setSearching(true);
    try {
      await fetchProperties({ ...filters, page: 1 });
    } finally {
      setSearching(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    fetchProperties(newFilters);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFavoriteToggle = async (
    propertyId: string,
    isFavorite: boolean
  ) => {
    if (!user) {
      toast.error("Please log in to add favorites");
      return;
    }

    try {
      if (isFavorite) {
        await favoritesApi.add(propertyId);
        setFavorites((prev) => new Set([...prev, propertyId]));
        toast.success("Added to favorites");
      } else {
        await favoritesApi.remove(propertyId);
        setFavorites((prev) => {
          const newFavorites = new Set(prev);
          newFavorites.delete(propertyId);
          return newFavorites;
        });
        toast.success("Removed from favorites");
      }
    } catch (err: any) {
      console.error("Error toggling favorite:", err);
      if (err.response?.status === 401) {
        toast.error("Please log in to add favorites");
      } else {
        toast.error("Failed to update favorites");
      }
    }
  };

  if (error && !loading) {
    return (
      <ErrorState
        error={error}
        onRetry={() => fetchProperties()}
        className="min-h-[60vh]"
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-blue-600 to-purple-700 rounded-3xl">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative px-8 py-16 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Dream Home
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover thousands of verified properties across Nigeria. From
            luxury apartments to affordable homes.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl md:text-3xl font-bold">
                {stats.totalProperties.toLocaleString()}+
              </div>
              <div className="text-blue-100 text-sm">Properties</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl md:text-3xl font-bold">
                {stats.totalStates}
              </div>
              <div className="text-blue-100 text-sm">States</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl md:text-3xl font-bold">
                {stats.totalAgents}+
              </div>
              <div className="text-blue-100 text-sm">Agents</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl md:text-3xl font-bold">₦1M</div>
              <div className="text-blue-100 text-sm">Avg Price</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Filters */}
      <div className="relative">
        <SearchFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          isSearching={searching}
        />
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {/* Results Header */}
        {!loading && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {properties.length > 0
                  ? "Available Properties"
                  : "No Properties Found"}
              </h2>
              <p className="text-gray-600">
                {properties.length > 0
                  ? `Showing ${properties.length} of ${pagination.total} properties`
                  : "Try adjusting your search filters"}
              </p>
            </div>

            {properties.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <div className="flex items-center space-x-1">
                  <Button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingGrid count={12} />}

        {/* Properties Grid */}
        {!loading && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavoriteToggle={user ? handleFavoriteToggle : undefined}
                isFavorite={favorites.has(property.id)}
                variant={index < 2 ? "featured" : "default"}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && (
          <Card className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No properties found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any properties matching your criteria. Try
                adjusting your filters or search in a different location.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => {
                    setFilters({ sortBy: "newest", page: 1, limit: 12 });
                    fetchProperties({ sortBy: "newest", page: 1, limit: 12 });
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
                {user?.role === "SELLER" || user?.role === "AGENT" ? (
                  <Link href="/properties/new">
                    <Button>List Your Property</Button>
                  </Link>
                ) : (
                  <Link href="/register">
                    <Button>Join as Agent</Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              variant="outline"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const pageNum = Math.max(1, pagination.page - 2) + i;
                if (pageNum > pagination.pages) return null;

                return (
                  <Button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    variant={
                      pagination.page === pageNum ? "primary" : "outline"
                    }
                    size="sm"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              variant="outline"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>

      {/* CTA Section */}
      {!user && (
        <Card className="bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to find your dream home?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of Nigerians who have found their perfect
              properties through RealEstateHub. Create an account to save
              favorites and get personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
