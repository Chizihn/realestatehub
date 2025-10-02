import { Request, Response, NextFunction } from "express";
import { PropertyService } from "../services/PropertyService";
import { sendSuccess } from "../utils/response";
import { AuthenticatedRequest } from "../types/express";

export class PropertyController {
  private propertyService: PropertyService;

  constructor() {
    this.propertyService = new PropertyService();
  }

  createProperty = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const propertyData = { ...req.body, userId: req.user.userId };
      const property = await this.propertyService.createProperty(propertyData);
      sendSuccess(res, property, 201);
    } catch (error) {
      next(error);
    }
  };

  getProperties = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, ...filters } = req.query as any;
      const result = await this.propertyService.getProperties(filters, {
        page,
        limit,
      });
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  getPropertyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const property = await this.propertyService.getPropertyById(id);
      sendSuccess(res, property);
    } catch (error) {
      next(error);
    }
  };

  updateProperty = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { id } = req.params;
      const property = await this.propertyService.updateProperty(
        id,
        req.body,
        req.user.userId
      );
      sendSuccess(res, property);
    } catch (error) {
      next(error);
    }
  };

  deleteProperty = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { id } = req.params;
      const result = await this.propertyService.deleteProperty(
        id,
        req.user.userId
      );
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  uploadImages = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { id } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const property = await this.propertyService.addPropertyImages(
        id,
        files,
        req.user.userId
      );

      sendSuccess(res, property);
    } catch (error) {
      next(error);
    }
  };
}
