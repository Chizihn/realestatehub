import { Prisma } from "@prisma/client";
import prisma from "../config/database";
import {
  PropertyCreateInput,
  PropertyUpdateInput,
  SearchFilters,
  PaginationParams,
} from "../types";
import {
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary";

export class PropertyRepository {
  async create(data: PropertyCreateInput & { userId: string }) {
    return prisma.property.create({
      data: {
        ...data,
        price: new Prisma.Decimal(data.price),
        area: new Prisma.Decimal(data.area),
      },
    });
  }

  async findById(id: string) {
    return prisma.property.findUnique({
      where: { id },
    });
  }

  async findMany(
    filters: SearchFilters = {},
    pagination: PaginationParams = {}
  ) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const where: Prisma.PropertyWhereInput = {
      status: "ACTIVE",
    };

    if (filters.state)
      where.state = { contains: filters.state, mode: "insensitive" };
    if (filters.city)
      where.city = { contains: filters.city, mode: "insensitive" };
    if (filters.propertyType) where.propertyType = filters.propertyType as any;
    if (filters.listingType) where.listingType = filters.listingType as any;
    if (filters.bedrooms) where.bedrooms = filters.bedrooms;
    if (filters.bathrooms) where.bathrooms = filters.bathrooms;
    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice)
        where.price.gte = new Prisma.Decimal(filters.minPrice);
      if (filters.maxPrice)
        where.price.lte = new Prisma.Decimal(filters.maxPrice);
    }

    let orderBy: Prisma.PropertyOrderByWithRelationInput = {
      createdAt: "desc",
    };
    if (filters.sortBy === "price_asc") orderBy = { price: "asc" };
    if (filters.sortBy === "price_desc") orderBy = { price: "desc" };

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.property.count({ where }),
    ]);

    return {
      properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, data: PropertyUpdateInput) {
    const updateData: any = { ...data };
    if (data.price) updateData.price = new Prisma.Decimal(data.price);
    if (data.area) updateData.area = new Prisma.Decimal(data.area);

    return prisma.property.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    // Get property to access images for cleanup
    const property = await this.findById(id);

    if (property && property.images.length > 0) {
      // Delete images from Cloudinary
      try {
        const deletePromises = property.images
          .map((imageUrl: string) => {
            // Extract public_id from Cloudinary URL
            const publicId = this.extractPublicIdFromUrl(imageUrl);
            if (publicId) {
              return deleteFromCloudinary(publicId);
            }
            return null;
          })
          .filter(Boolean);

        await Promise.all(deletePromises);
      } catch (error) {
        console.error("Error deleting images from Cloudinary:", error);
        // Continue with property deletion even if image cleanup fails
      }
    }

    return prisma.property.delete({
      where: { id },
    });
  }

  private extractPublicIdFromUrl(url: string): string | null {
    try {
      // Extract public_id from Cloudinary URL
      // Example: https://res.cloudinary.com/cloud/image/upload/v1234567890/realestatehub/properties/123/image.jpg
      const matches = url.match(/\/v\d+\/(.+)\.[^.]+$/);
      return matches ? matches[1] : null;
    } catch (error) {
      console.error("Error extracting public_id from URL:", url, error);
      return null;
    }
  }

  async addImages(id: string, files: Express.Multer.File[]) {
    const property = await this.findById(id);
    if (!property) return null;

    try {
      // Upload images to Cloudinary
      const uploadResults = await uploadMultipleToCloudinary(
        files.map((file) => ({
          buffer: file.buffer,
          originalname: file.originalname,
        })),
        `realestatehub/properties/${id}`
      );

      // Extract URLs from upload results
      const imageUrls = uploadResults.map((result) => result.secure_url);

      return prisma.property.update({
        where: { id },
        data: {
          images: [...property.images, ...imageUrls],
        },
      });
    } catch (error) {
      console.error("Error uploading images to Cloudinary:", error);
      throw new Error("Failed to upload images");
    }
  }

  async getLocations() {
    const locations = await prisma.property.groupBy({
      by: ["state", "city"],
      where: { status: "ACTIVE" },
      _count: true,
    });

    return locations.map((loc: any) => ({
      state: loc.state,
      city: loc.city,
      count: loc._count,
    }));
  }

  async getPropertyTypes() {
    const types = await prisma.property.groupBy({
      by: ["propertyType"],
      where: { status: "ACTIVE" },
      _count: true,
    });

    return types.map((type: any) => ({
      type: type.propertyType,
      count: type._count,
    }));
  }
}
