import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validateBody } from "../middleware/validation";
import { authenticateToken } from "../middleware/auth";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  refreshTokenSchema,
} from "../validation/auth";

const router = Router();
const authController = new AuthController();

// Public routes
router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);
router.post(
  "/refresh-token",
  validateBody(refreshTokenSchema),
  authController.refreshToken
);
router.post("/verify-email", authController.verifyEmail);
router.post(
  "/forgot-password",
  validateBody(forgotPasswordSchema),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validateBody(resetPasswordSchema),
  authController.resetPassword
);

// Protected routes
router.post("/logout", authenticateToken, authController.logout);
router.post(
  "/change-password",
  authenticateToken,
  validateBody(changePasswordSchema),
  authController.changePassword
);
router.get("/profile", authenticateToken, authController.getProfile);
router.put("/profile", authenticateToken, authController.updateProfile);

export default router;
