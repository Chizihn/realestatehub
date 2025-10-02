import { Router } from "express";
import { FavoritesController } from "../controllers/FavoritesController";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const favoritesController = new FavoritesController();

// All favorites routes require authentication
router.get("/", authenticateToken, favoritesController.getUserFavorites);
router.post(
  "/:propertyId",
  authenticateToken,
  favoritesController.addToFavorites
);
router.delete(
  "/:propertyId",
  authenticateToken,
  favoritesController.removeFromFavorites
);
router.get(
  "/:propertyId/check",
  authenticateToken,
  favoritesController.checkIsFavorite
);

export default router;
