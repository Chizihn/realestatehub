import { Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import { sendSuccess, sendError } from "../utils/response";
import { AdminService } from "../services/AdminService";

export class AdminController {
  private adminService = new AdminService();

  // Dashboard stats
  getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const stats = await this.adminService.getDashboardStats();
      sendSuccess(res, stats);
    } catch (error) {
      sendError(res, "INTERNAL_ERROR", (error as Error).message, 500);
    }
  };

  // User management
  getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { page = "1", limit = "20", role, search } = req.query;
      const users = await this.adminService.getAllUsers({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        role: role as string,
        search: search as string,
      });
      sendSuccess(res, users);
    } catch (error) {
      sendError(res, "INTERNAL_ERROR", (error as Error).message, 500);
    }
  };

  updateUserRole = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      const user = await this.adminService.updateUserRole(userId, role);
      sendSuccess(res, user);
    } catch (error) {
      sendError(res, "INTERNAL_ERROR", (error as Error).message, 500);
    }
  };

  suspendUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { userId } = req.params;
      const { reason } = req.body;

      await this.adminService.suspendUser(userId, reason);
      sendSuccess(res, { message: "User suspended successfully" });
    } catch (error) {
      sendError(res, "INTERNAL_ERROR", (error as Error).message, 500);
    }
  };

  // Property management
  getAllProperties = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { page = "1", limit = "20", status, propertyType } = req.query;
      const properties = await this.adminService.getAllProperties({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        status: status as string,
        propertyType: propertyType as string,
      });
      sendSuccess(res, properties);
    } catch (error) {
      sendError(res, "INTERNAL_ERROR", (error as Error).message, 500);
    }
  };

  updatePropertyStatus = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { propertyId } = req.params;
      const { status, reason } = req.body;

      const property = await this.adminService.updatePropertyStatus(
        propertyId,
        status,
        reason
      );
      sendSuccess(res, property);
    } catch (error) {
      sendError(res, "INTERNAL_ERROR", (error as Error).message, 500);
    }
  };

  deleteProperty = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { propertyId } = req.params;
      const { reason } = req.body;

      await this.adminService.deleteProperty(propertyId, reason);
      sendSuccess(res, { message: "Property deleted successfully" });
    } catch (error) {
      sendError(res, "INTERNAL_ERROR", (error as Error).message, 500);
    }
  };

  // Reports and analytics
  getReports = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { type, startDate, endDate } = req.query;
      const reports = await this.adminService.getReports({
        type: type as string,
        startDate: startDate as string,
        endDate: endDate as string,
      });
      sendSuccess(res, reports);
    } catch (error) {
      sendError(res, "INTERNAL_ERROR", (error as Error).message, 500);
    }
  };
}
