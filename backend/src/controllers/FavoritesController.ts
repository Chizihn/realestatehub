import { Request, Response, NextFunction } from "express";
import { FavoritesService } from "../services/FavoritesService";
import { sendSuccess } from "../utils/response";
import { AuthenticatedRequest } from "../types/express";

export class FavoritesController {
  private favoritesService: FavoritesService;

  constructor() {
    this.favoritesService = new FavoritesService();
  }

  addToFavorites = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { propertyId } = req.params;
      const favorite = await this.favoritesService.addToFavorites(
        req.user.userId,
        propertyId
      );
      sendSuccess(res, favorite, 201);
    } catch (error) {
      next(error);
    }
  };

  removeFromFavorites = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { propertyId } = req.params;
      const result = await this.favoritesService.removeFromFavorites(
        req.user.userId,
        propertyId
      );
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  getUserFavorites = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const favorites = await this.favoritesService.getUserFavorites(
        req.user.userId
      );
      sendSuccess(res, favorites);
    } catch (error) {
      next(error);
    }
  };

  checkIsFavorite = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { propertyId } = req.params;
      const isFavorite = await this.favoritesService.checkIsFavorite(
        req.user.userId,
        propertyId
      );
      sendSuccess(res, { isFavorite });
    } catch (error) {
      next(error);
    }
  };
}
