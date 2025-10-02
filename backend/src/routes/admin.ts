import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { authenticateToken, requireRole } from "../middleware/auth";
import { AuthenticatedHandler } from "../types/express";

const router = Router();
const adminController = new AdminController();

// All admin routes require authentication and ADMIN role
router.use(authenticateToken);
router.use(requireRole(["ADMIN"]));

// Dashboard
router.get(
  "/dashboard",
  adminController.getDashboardStats as AuthenticatedHandler
);

// User management
router.get("/users", adminController.getAllUsers as AuthenticatedHandler);
router.put(
  "/users/:userId/role",
  adminController.updateUserRole as AuthenticatedHandler
);
router.post(
  "/users/:userId/suspend",
  adminController.suspendUser as AuthenticatedHandler
);

// Property management
router.get(
  "/properties",
  adminController.getAllProperties as AuthenticatedHandler
);
router.put(
  "/properties/:propertyId/status",
  adminController.updatePropertyStatus as AuthenticatedHandler
);
router.delete(
  "/properties/:propertyId",
  adminController.deleteProperty as AuthenticatedHandler
);

// Reports
router.get("/reports", adminController.getReports as AuthenticatedHandler);

export default router;
