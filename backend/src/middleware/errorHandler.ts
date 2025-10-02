import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", error);

  // Multer errors
  if (error.code === "LIMIT_FILE_SIZE") {
    return sendError(
      res,
      "FILE_TOO_LARGE",
      "File size exceeds 10MB limit",
      400
    );
  }

  if (error.code === "LIMIT_UNEXPECTED_FILE") {
    return sendError(res, "INVALID_FILE_FIELD", "Unexpected file field", 400);
  }

  if (error.code === "LIMIT_FILE_COUNT") {
    return sendError(res, "TOO_MANY_FILES", "Maximum 10 files allowed", 400);
  }

  // Cloudinary errors
  if (error.message && error.message.includes("Cloudinary")) {
    return sendError(res, "UPLOAD_FAILED", "Failed to upload images", 500);
  }

  if (error.message === "Failed to upload images") {
    return sendError(res, "UPLOAD_FAILED", error.message, 500);
  }

  // Prisma errors
  if (error.code === "P2002") {
    return sendError(res, "DUPLICATE_ENTRY", "Resource already exists", 409);
  }

  if (error.code === "P2025") {
    return sendError(res, "NOT_FOUND", "Resource not found", 404);
  }

  // Custom application errors
  if (error.message === "Property not found") {
    return sendError(res, "PROPERTY_NOT_FOUND", error.message, 404);
  }

  if (error.message === "Property already in favorites") {
    return sendError(res, "ALREADY_FAVORITED", error.message, 409);
  }

  if (error.message === "Favorite not found") {
    return sendError(res, "FAVORITE_NOT_FOUND", error.message, 404);
  }

  // Authentication errors
  if (error.message === "User already exists with this email") {
    return sendError(res, "USER_EXISTS", error.message, 409);
  }

  if (error.message === "Invalid email or password") {
    return sendError(res, "INVALID_CREDENTIALS", error.message, 401);
  }

  if (error.message === "Invalid refresh token") {
    return sendError(res, "INVALID_REFRESH_TOKEN", error.message, 401);
  }

  if (error.message === "Invalid or expired verification token") {
    return sendError(res, "INVALID_VERIFICATION_TOKEN", error.message, 400);
  }

  if (error.message === "Invalid or expired reset token") {
    return sendError(res, "INVALID_RESET_TOKEN", error.message, 400);
  }

  if (error.message === "Current password is incorrect") {
    return sendError(res, "INCORRECT_PASSWORD", error.message, 400);
  }

  if (
    error.message === "You can only update your own properties" ||
    error.message === "You can only delete your own properties" ||
    error.message === "You can only add images to your own properties"
  ) {
    return sendError(res, "FORBIDDEN", error.message, 403);
  }

  // Default server error
  return sendError(
    res,
    "INTERNAL_SERVER_ERROR",
    "An unexpected error occurred",
    500
  );
};

export const notFoundHandler = (req: Request, res: Response) => {
  return sendError(res, "NOT_FOUND", `Route ${req.originalUrl} not found`, 404);
};
