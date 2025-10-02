import { Router } from "express";
import { PropertyController } from "../controllers/PropertyController";
import { validateBody, validateQuery } from "../middleware/validation";
import {
  authenticateToken,
  optionalAuth,
  requireRole,
} from "../middleware/auth";
import {
  createPropertySchema,
  updatePropertySchema,
  searchSchema,
} from "../validation/property";
import { upload } from "../middleware/upload";
import { AuthenticatedHandler } from "../types/express";

const router = Router();
const propertyController = new PropertyController();

// Public routes
router.get(
  "/",
  optionalAuth,
  validateQuery(searchSchema),
  propertyController.getProperties
);
router.get("/:id", optionalAuth, propertyController.getPropertyById);

// Protected routes - require authentication
router.post(
  "/",
  authenticateToken,
  requireRole(["SELLER", "AGENT"]),
  validateBody(createPropertySchema),
  propertyController.createProperty as AuthenticatedHandler
);
router.put(
  "/:id",
  authenticateToken,
  validateBody(updatePropertySchema),
  propertyController.updateProperty as AuthenticatedHandler
);
router.delete(
  "/:id",
  authenticateToken,
  propertyController.deleteProperty as AuthenticatedHandler
);
router.post(
  "/:id/images",
  authenticateToken,
  upload.array("images", 10),
  propertyController.uploadImages as AuthenticatedHandler
);

export default router;
