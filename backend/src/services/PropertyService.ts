import { PropertyRepository } from "../repositories/PropertyRepository";
import {
  PropertyCreateInput,
  PropertyUpdateInput,
  SearchFilters,
  PaginationParams,
} from "../types";

export class PropertyService {
  private propertyRepository: PropertyRepository;

  constructor() {
    this.propertyRepository = new PropertyRepository();
  }

  async createProperty(data: PropertyCreateInput & { userId: string }) {
    try {
      const property = await this.propertyRepository.create(data);
      return property;
    } catch (error) {
      throw new Error(`Failed to create property: ${error}`);
    }
  }

  async getPropertyById(id: string) {
    const property = await this.propertyRepository.findById(id);
    if (!property) {
      throw new Error("Property not found");
    }
    return property;
  }

  async getProperties(
    filters: SearchFilters = {},
    pagination: PaginationParams = {}
  ) {
    return this.propertyRepository.findMany(filters, pagination);
  }

  async updateProperty(id: string, data: PropertyUpdateInput, userId: string) {
    try {
      // Check if user owns the property
      const existingProperty = await this.propertyRepository.findById(id);
      if (!existingProperty) {
        throw new Error("Property not found");
      }
      if (existingProperty.userId !== userId) {
        throw new Error("You can only update your own properties");
      }

      const property = await this.propertyRepository.update(id, data);
      return property;
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new Error("Property not found");
      }
      throw error;
    }
  }

  async deleteProperty(id: string, userId: string) {
    try {
      // Check if user owns the property
      const existingProperty = await this.propertyRepository.findById(id);
      if (!existingProperty) {
        throw new Error("Property not found");
      }
      if (existingProperty.userId !== userId) {
        throw new Error("You can only delete your own properties");
      }

      await this.propertyRepository.delete(id);
      return { message: "Property deleted successfully" };
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new Error("Property not found");
      }
      throw error;
    }
  }

  async addPropertyImages(
    id: string,
    files: Express.Multer.File[],
    userId: string
  ) {
    // Check if user owns the property
    const existingProperty = await this.propertyRepository.findById(id);
    if (!existingProperty) {
      throw new Error("Property not found");
    }
    if (existingProperty.userId !== userId) {
      throw new Error("You can only add images to your own properties");
    }

    const property = await this.propertyRepository.addImages(id, files);
    if (!property) {
      throw new Error("Property not found");
    }
    return property;
  }

  async getLocations() {
    return this.propertyRepository.getLocations();
  }

  async getPropertyTypes() {
    return this.propertyRepository.getPropertyTypes();
  }
}
