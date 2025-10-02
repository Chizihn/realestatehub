"use client";

import { useState, useEffect } from "react";
import { MapPin, Search, X } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import Map component to avoid SSR issues
const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

interface LocationPickerProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address: string;
    state: string;
    city: string;
  }) => void;
  initialLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  className?: string;
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

const majorCities: { [key: string]: string[] } = {
  Lagos: [
    "Ikeja",
    "Victoria Island",
    "Lekki",
    "Surulere",
    "Yaba",
    "Ikoyi",
    "Ajah",
    "Magodo",
  ],
  FCT: [
    "Garki",
    "Wuse",
    "Maitama",
    "Asokoro",
    "Gwarinpa",
    "Kubwa",
    "Nyanya",
    "Karu",
  ],
  Rivers: ["Port Harcourt", "Obio-Akpor", "Eleme", "Ikwerre", "Oyigbo"],
  Kano: ["Fagge", "Nasarawa", "Gwale", "Kano Municipal", "Tarauni"],
  Oyo: ["Ibadan North", "Ibadan South-West", "Egbeda", "Akinyele", "Oluyole"],
};

export default function LocationPicker({
  onLocationSelect,
  initialLocation,
  className = "",
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    9.0765, 7.3986,
  ]);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (initialLocation) {
      setMapCenter([initialLocation.lat, initialLocation.lng]);
      setShowMap(true);
    }
  }, [initialLocation]);

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ", Nigeria"
        )}&limit=5&addressdetails=1`
      );
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    if (value.length > 2) {
      const timeoutId = setTimeout(() => searchLocation(value), 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchResultSelect = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const address = result.display_name;

    // Extract state and city from address components
    const addressParts = result.address || {};
    const state = addressParts.state || selectedState || "Lagos";
    const city =
      addressParts.city ||
      addressParts.town ||
      addressParts.suburb ||
      selectedCity ||
      "Lagos";

    const location = { lat, lng, address, state, city };
    setSelectedLocation(location);
    setMapCenter([lat, lng]);
    setSearchQuery(address);
    setSearchResults([]);
    setShowMap(true);
    onLocationSelect(location);
  };

  const handleMapLocationSelect = (
    lat: number,
    lng: number,
    address?: string
  ) => {
    const location = {
      lat,
      lng,
      address: address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      state: selectedState || "Lagos",
      city: selectedCity || "Lagos",
    };
    setSelectedLocation(location);
    setSearchQuery(location.address);
    onLocationSelect(location);
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity("");

    // Set map center to state capital or major city
    const stateCoordinates: { [key: string]: [number, number] } = {
      Lagos: [6.5244, 3.3792],
      FCT: [9.0579, 7.4951],
      Rivers: [4.8156, 7.0498],
      Kano: [12.0022, 8.592],
      Oyo: [7.3775, 3.947],
    };

    if (stateCoordinates[state]) {
      setMapCenter(stateCoordinates[state]);
      setShowMap(true);
    }
  };

  const clearSelection = () => {
    setSelectedLocation(undefined);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedState("");
    setSelectedCity("");
    setShowMap(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchInputChange(e.target.value)}
          placeholder="Search for a location in Nigeria..."
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={clearSelection}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => handleSearchResultSelect(result)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-900 truncate">
                    {result.display_name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {isSearching && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-sm text-gray-600">Searching...</span>
            </div>
          </div>
        )}
      </div>

      {/* State and City Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State *
          </label>
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="">Select State</option>
            {nigerianStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            placeholder="Enter city name"
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Manual Address Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Address *
        </label>
        <textarea
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter the complete address..."
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          required
        />
        {selectedState && selectedCity && searchQuery && (
          <button
            type="button"
            onClick={() => {
              const location = {
                lat: 9.0765, // Default Nigeria coordinates
                lng: 7.3986,
                address: searchQuery,
                state: selectedState,
                city: selectedCity,
              };
              setSelectedLocation(location);
              onLocationSelect(location);
            }}
            className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Use This Address
          </button>
        )}
      </div>

      {/* Map */}
      {showMap && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Click on the map to select exact location
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <Map
              center={mapCenter}
              zoom={selectedLocation ? 15 : 10}
              markers={
                selectedLocation
                  ? [
                      {
                        position: [selectedLocation.lat, selectedLocation.lng],
                        popup: selectedLocation.address,
                        title: "Selected Location",
                      },
                    ]
                  : []
              }
              onLocationSelect={handleMapLocationSelect}
              height="300px"
            />
          </div>
        </div>
      )}

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <MapPin className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900">
                Selected Location
              </p>
              <p className="text-sm text-green-700 mt-1">
                {selectedLocation.address}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Coordinates: {selectedLocation.lat.toFixed(6)},{" "}
                {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
