"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { propertyApi, favoritesApi } from "@/lib/api";
import { Property } from "@/types";
import {
  formatPrice,
  formatArea,
  getPropertyTypeLabel,
  getListingTypeLabel,
  getImageUrl,
} from "@/lib/utils";
import {
  MapPin,
  Home,
  Bed,
  Bath,
  Square,
  Heart,
  Phone,
  Mail,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import Map component to avoid SSR issues
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export default function PropertyDetailsPage() {
  const params = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string);
      checkFavoriteStatus(params.id as string);
    }
  }, [params.id]);

  const fetchProperty = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await propertyApi.getById(id);
      setProperty(response.data.data);
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || "Failed to fetch property details"
      );
      console.error("Error fetching property:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async (id: string) => {
    try {
      const response = await favoritesApi.check(id);
      setIsFavorite(response.data.data.isFavorite);
    } catch (err) {
      console.error("Error checking favorite status:", err);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!property) return;

    if (!user) {
      toast.error("Please log in to add favorites");
      return;
    }

    try {
      if (isFavorite) {
        await favoritesApi.remove(property.id);
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await favoritesApi.add(property.id);
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (err: any) {
      console.error("Error toggling favorite:", err);
      toast.error("Failed to update favorites");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600">Loading property details...</span>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <p className="text-lg font-semibold">Error loading property</p>
          <p className="text-sm">{error}</p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Back to Properties
        </Link>
      </div>
    );
  }

  const images =
    property.images.length > 0
      ? property.images
      : ["/placeholder-property.png"];

  return (
    <div>
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Properties
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Images Section */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src={getImageUrl(images[selectedImageIndex])}
                alt={property.title}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-property.png";
                }}
              />
            </div>
          </div>

          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative h-20 rounded-md overflow-hidden border-2 ${
                    selectedImageIndex === index
                      ? "border-primary-600"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={getImageUrl(image)}
                    alt={`${property.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-property.png";
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Property Details */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Property Details
            </h2>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Home className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-semibold">
                    {getPropertyTypeLabel(property.propertyType)}
                  </p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Square className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Area</p>
                  <p className="font-semibold">
                    {formatArea(property.area, property.areaUnit)}
                  </p>
                </div>

                {property.bedrooms && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bed className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Bedrooms</p>
                    <p className="font-semibold">{property.bedrooms}</p>
                  </div>
                )}

                {property.bathrooms && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bath className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Bathrooms</p>
                    <p className="font-semibold">{property.bathrooms}</p>
                  </div>
                )}
              </div>

              {property.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {property.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            {/* Price and Basic Info */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-3xl font-bold text-primary-600">
                    {formatPrice(property.price)}
                    {property.listingType === "RENT" && (
                      <span className="text-lg font-normal text-gray-500">
                        /year
                      </span>
                    )}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mt-2 ${
                      property.listingType === "SALE"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {getListingTypeLabel(property.listingType)}
                  </span>
                </div>
                <button
                  onClick={handleFavoriteToggle}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                    }`}
                  />
                </button>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {property.title}
              </h1>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span>
                  {property.neighborhood && `${property.neighborhood}, `}
                  {property.city}, {property.state}
                </span>
              </div>

              <div className="text-sm text-gray-500 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Listed on {new Date(property.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">
                    {property.contactName}
                  </p>
                </div>

                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-3" />
                  <a
                    href={`tel:${property.contactPhone}`}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {property.contactPhone}
                  </a>
                </div>

                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-3" />
                  <a
                    href={`mailto:${property.contactEmail}`}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {property.contactEmail}
                  </a>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <a
                  href={`tel:${property.contactPhone}`}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 transition-colors text-center block"
                >
                  Call Now
                </a>
                <a
                  href={`mailto:${property.contactEmail}?subject=Inquiry about ${property.title}`}
                  className="w-full border border-primary-600 text-primary-600 py-3 px-4 rounded-md hover:bg-primary-50 transition-colors text-center block"
                >
                  Send Email
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Address
              </h3>
              <p className="text-gray-700">{property.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
          <div className="h-96 rounded-lg overflow-hidden">
            <Map
              center={[9.0765, 7.3986]} // Default Nigeria center - in real app, use property coordinates
              zoom={10}
              markers={[
                {
                  position: [9.0765, 7.3986], // In real app, use actual property coordinates
                  title: property.title,
                  price: formatPrice(property.price),
                  popup: `${property.city}, ${property.state}`,
                  type: "selected",
                },
              ]}
              height="400px"
              interactive={true}
              showControls={true}
            />
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              <div>
                <p className="font-medium">{property.address}</p>
                <p className="text-sm">
                  {property.neighborhood && `${property.neighborhood}, `}
                  {property.city}, {property.state}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
