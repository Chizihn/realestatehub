import { Router } from "express";
import authRoutes from "./auth";
import propertyRoutes from "./properties";
import searchRoutes from "./search";
import favoritesRoutes from "./favorites";
import adminRoutes from "./admin";

const router = Router();

router.use("/auth", authRoutes);
router.use("/properties", propertyRoutes);
router.use("/search", searchRoutes);
router.use("/favorites", favoritesRoutes);
router.use("/admin", adminRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "RealEstateHub API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
