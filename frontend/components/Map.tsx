"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Maximize2, Minimize2, Navigation } from "lucide-react";
import { Button } from "./ui/Button";
import LoadingSpinner from "./ui/LoadingSpinner";

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    popup?: string;
    title?: string;
    price?: string;
    type?: "property" | "selected" | "user";
  }>;
  onLocationSelect?: (lat: number, lng: number, address?: string) => void;
  height?: string;
  className?: string;
  interactive?: boolean;
  showControls?: boolean;
}

export default function Map({
  center = [9.0765, 7.3986], // Nigeria center coordinates
  zoom = 6,
  markers = [],
  onLocationSelect,
  height = "400px",
  className = "",
  interactive = true,
  showControls = true,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Custom icons for different marker types
  const createCustomIcon = (
    type: "property" | "selected" | "user" = "property"
  ) => {
    const colors = {
      property: "#3B82F6",
      selected: "#EF4444",
      user: "#10B981",
    };

    return L.divIcon({
      html: `
        <div style="
          background-color: ${colors[type]};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background-color: white;
            border-radius: 50%;
          "></div>
        </div>
      `,
      className: "custom-marker",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    setIsLoading(true);

    // Initialize map
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(center, zoom);

    // Add tile layer with better styling
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    // Add custom controls if enabled
    if (showControls) {
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.control
        .attribution({ position: "bottomleft", prefix: false })
        .addTo(map);
    }

    // Add click handler for location selection
    if (onLocationSelect && interactive) {
      map.on("click", async (e) => {
        const { lat, lng } = e.latlng;

        // Reverse geocoding to get address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          const address =
            data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          onLocationSelect(lat, lng, address);
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          onLocationSelect(lat, lng);
        }
      });
    }

    mapInstanceRef.current = map;
    setIsLoading(false);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when markers prop changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    markers.forEach(({ position, popup, title, price, type = "property" }) => {
      const marker = L.marker(position, {
        icon: createCustomIcon(type),
      });

      if (title || popup || price) {
        const popupContent = `
          <div class="p-2">
            ${
              title
                ? `<h3 class="font-semibold text-sm mb-1">${title}</h3>`
                : ""
            }
            ${
              price
                ? `<p class="text-primary-600 font-bold text-sm mb-1">${price}</p>`
                : ""
            }
            ${popup ? `<p class="text-gray-600 text-xs">${popup}</p>` : ""}
          </div>
        `;
        marker.bindPopup(popupContent);
      }

      marker.addTo(mapInstanceRef.current!);
      markersRef.current.push(marker);
    });

    // Fit bounds if multiple markers
    if (markers.length > 1) {
      const group = new L.FeatureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    } else if (markers.length === 1) {
      mapInstanceRef.current.setView(markers[0].position, 15);
    }
  }, [markers]);

  // Update center when center prop changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 15);

            // Add user location marker
            const userMarker = L.marker([latitude, longitude], {
              icon: createCustomIcon("user"),
            }).addTo(mapInstanceRef.current);

            userMarker.bindPopup("Your Location").openPopup();
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapRef}
        style={{
          height: isFullscreen ? "100vh" : height,
          width: isFullscreen ? "100vw" : "100%",
        }}
        className={`
          rounded-lg overflow-hidden border border-gray-200 shadow-sm
          ${isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""}
        `}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <LoadingSpinner text="Loading map..." />
        </div>
      )}

      {/* Map Controls */}
      {showControls && !isLoading && (
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <Button
            onClick={getUserLocation}
            size="sm"
            variant="secondary"
            className="shadow-lg"
            title="Get my location"
          >
            <Navigation className="w-4 h-4" />
          </Button>
          <Button
            onClick={toggleFullscreen}
            size="sm"
            variant="secondary"
            className="shadow-lg"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      )}

      {/* Map Info */}
      {onLocationSelect && interactive && !isLoading && (
        <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Click on the map to select a location</span>
          </div>
        </div>
      )}
    </div>
  );
}
