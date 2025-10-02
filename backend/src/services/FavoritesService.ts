import { FavoritesRepository } from "../repositories/FavoritesRepository";
import { PropertyRepository } from "../repositories/PropertyRepository";

export class FavoritesService {
  private favoritesRepository: FavoritesRepository;
  private propertyRepository: PropertyRepository;

  constructor() {
    this.favoritesRepository = new FavoritesRepository();
    this.propertyRepository = new PropertyRepository();
  }

  async addToFavorites(userId: string, propertyId: string) {
    // Check if property exists
    const property = await this.propertyRepository.findById(propertyId);
    if (!property) {
      throw new Error("Property not found");
    }

    // Check if already favorited
    const isFavorite = await this.favoritesRepository.isFavorite(
      userId,
      propertyId
    );
    if (isFavorite) {
      throw new Error("Property already in favorites");
    }

    try {
      const favorite = await this.favoritesRepository.addFavorite(
        userId,
        propertyId
      );
      return favorite;
    } catch (error) {
      throw new Error(`Failed to add to favorites: ${error}`);
    }
  }

  async removeFromFavorites(userId: string, propertyId: string) {
    try {
      await this.favoritesRepository.removeFavorite(userId, propertyId);
      return { message: "Property removed from favorites" };
    } catch (error) {
      if ((error as any).code === "P2025") {
        throw new Error("Favorite not found");
      }
      throw new Error(`Failed to remove from favorites: ${error}`);
    }
  }

  async getUserFavorites(userId: string) {
    return this.favoritesRepository.getUserFavorites(userId);
  }

  async checkIsFavorite(userId: string, propertyId: string) {
    return this.favoritesRepository.isFavorite(userId, propertyId);
  }

  async getFavoriteCount(propertyId: string) {
    return this.favoritesRepository.getFavoriteCount(propertyId);
  }
}
