"use client";

import { SearchFilters as SearchFiltersApi } from "@/types";
import {
  Search,
  X,
  MapPin,
  Home,
  DollarSign,
  SlidersHorizontal,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
  filters: SearchFiltersApi;
  onFiltersChange: (filters: SearchFiltersApi) => void;
  onSearch: () => void;
  isSearching?: boolean;
}

const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const propertyTypes = [
  { value: "HOUSE", label: "House", icon: Home },
  { value: "APARTMENT", label: "Apartment", icon: Home },
  { value: "LAND", label: "Land", icon: MapPin },
];

const listingTypes = [
  { value: "SALE", label: "For Sale", color: "success" },
  { value: "RENT", label: "For Rent", color: "info" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const priceRanges = [
  { label: "Under ₦5M", min: 0, max: 5000000 },
  { label: "₦5M - ₦20M", min: 5000000, max: 20000000 },
  { label: "₦20M - ₦50M", min: 20000000, max: 50000000 },
  { label: "₦50M - ₦100M", min: 50000000, max: 100000000 },
  { label: "Above ₦100M", min: 100000000, max: undefined },
];

export default function SearchFilters({
  filters,
  onFiltersChange,
  onSearch,
  isSearching = false,
}: SearchFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFiltersApi>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof SearchFiltersApi, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFiltersApi = {
      sortBy: "newest",
      page: 1,
      limit: 12,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const setPriceRange = (min?: number, max?: number) => {
    handleFilterChange("minPrice", min);
    handleFilterChange("maxPrice", max);
  };

  const hasActiveFilters = Object.keys(localFilters).some(
    (key) =>
      key !== "sortBy" &&
      key !== "page" &&
      key !== "limit" &&
      localFilters[key as keyof SearchFiltersApi]
  );

  const activeFilterCount = Object.keys(localFilters).filter(
    (key) =>
      key !== "sortBy" &&
      key !== "page" &&
      key !== "limit" &&
      localFilters[key as keyof SearchFiltersApi]
  ).length;

  return (
    <Card className="sticky top-4 z-30 shadow-lg border-gray-200 bg-white/95 backdrop-blur-sm mb-6">
      {/* Quick Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by location, property type, or keyword..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            value={localFilters.city || ""}
            onChange={(e) =>
              handleFilterChange("city", e.target.value || undefined)
            }
          />
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={onSearch}
            size="lg"
            className="shadow-sm"
            disabled={isSearching}
          >
            <Search className="w-4 h-4 mr-2" />
            {isSearching ? "Searching..." : "Search"}
          </Button>
          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="outline"
            size="lg"
            className={cn(
              "shadow-sm relative",
              showAdvanced &&
                "bg-primary-50 border-primary-200 text-primary-700"
            )}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge
                variant="danger"
                size="sm"
                className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {/* Property Type Chips */}
        {propertyTypes.map((type) => (
          <button
            key={type.value}
            onClick={() =>
              handleFilterChange(
                "propertyType",
                localFilters.propertyType === type.value
                  ? undefined
                  : type.value
              )
            }
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-200",
              localFilters.propertyType === type.value
                ? "bg-primary-100 border-primary-300 text-primary-700"
                : "bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
            )}
          >
            <type.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{type.label}</span>
          </button>
        ))}

        {/* Listing Type Chips */}
        {listingTypes.map((type) => (
          <button
            key={type.value}
            onClick={() =>
              handleFilterChange(
                "listingType",
                localFilters.listingType === type.value ? undefined : type.value
              )
            }
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-200",
              localFilters.listingType === type.value
                ? "bg-primary-100 border-primary-300 text-primary-700"
                : "bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
            )}
          >
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-medium">{type.label}</span>
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-gray-200 pt-6 space-y-6">
          {/* Location Filters */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <select
                  value={localFilters.state || ""}
                  onChange={(e) =>
                    handleFilterChange("state", e.target.value || undefined)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All States</option>
                  {nigerianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={localFilters.city || ""}
                  onChange={(e) =>
                    handleFilterChange("city", e.target.value || undefined)
                  }
                  placeholder="Enter city name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Price Range
            </h3>
            <div className="space-y-4">
              {/* Quick Price Ranges */}
              <div className="flex flex-wrap gap-2">
                {priceRanges.map((range, index) => (
                  <button
                    key={index}
                    onClick={() => setPriceRange(range.min, range.max)}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-lg border transition-colors",
                      localFilters.minPrice === range.min &&
                        localFilters.maxPrice === range.max
                        ? "bg-primary-100 border-primary-300 text-primary-700"
                        : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                    )}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              {/* Custom Price Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price (₦)
                  </label>
                  <input
                    type="number"
                    value={localFilters.minPrice || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "minPrice",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price (₦)
                  </label>
                  <input
                    type="number"
                    value={localFilters.maxPrice || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "maxPrice",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    placeholder="No limit"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Property Features */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <Home className="w-4 h-4 mr-2" />
              Property Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() =>
                        handleFilterChange(
                          "bedrooms",
                          localFilters.bedrooms === num ? undefined : num
                        )
                      }
                      className={cn(
                        "w-10 h-10 rounded-lg border text-sm font-medium transition-colors",
                        localFilters.bedrooms === num
                          ? "bg-primary-100 border-primary-300 text-primary-700"
                          : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                      )}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() =>
                        handleFilterChange(
                          "bathrooms",
                          localFilters.bathrooms === num ? undefined : num
                        )
                      }
                      className={cn(
                        "w-10 h-10 rounded-lg border text-sm font-medium transition-colors",
                        localFilters.bathrooms === num
                          ? "bg-primary-100 border-primary-300 text-primary-700"
                          : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                      )}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={localFilters.sortBy || "newest"}
                  onChange={(e) =>
                    handleFilterChange("sortBy", e.target.value as any)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            )}
            <div className="flex space-x-3 ml-auto">
              <Button
                onClick={() => setShowAdvanced(false)}
                variant="outline"
                size="sm"
              >
                Close
              </Button>
              <Button onClick={onSearch} size="sm" disabled={isSearching}>
                {isSearching ? "Applying..." : "Apply Filters"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && !showAdvanced && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">
            Active filters:
          </span>
          {localFilters.state && (
            <Badge variant="info" className="flex items-center space-x-1">
              <span>{localFilters.state}</span>
              <button onClick={() => handleFilterChange("state", undefined)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {localFilters.propertyType && (
            <Badge variant="info" className="flex items-center space-x-1">
              <span>
                {
                  propertyTypes.find(
                    (t) => t.value === localFilters.propertyType
                  )?.label
                }
              </span>
              <button
                onClick={() => handleFilterChange("propertyType", undefined)}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {localFilters.listingType && (
            <Badge variant="info" className="flex items-center space-x-1">
              <span>
                {
                  listingTypes.find((t) => t.value === localFilters.listingType)
                    ?.label
                }
              </span>
              <button
                onClick={() => handleFilterChange("listingType", undefined)}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {(localFilters.minPrice || localFilters.maxPrice) && (
            <Badge variant="info" className="flex items-center space-x-1">
              <span>
                ₦{localFilters.minPrice?.toLocaleString() || "0"} -
                {localFilters.maxPrice
                  ? `₦${localFilters.maxPrice.toLocaleString()}`
                  : "∞"}
              </span>
              <button onClick={() => setPriceRange(undefined, undefined)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </Card>
  );
}
