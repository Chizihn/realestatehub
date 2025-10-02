import { Request, Response, NextFunction } from "express";
import { PropertyService } from "../services/PropertyService";
import { sendSuccess } from "../utils/response";

export class SearchController {
  private propertyService: PropertyService;

  constructor() {
    this.propertyService = new PropertyService();
  }

  searchProperties = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, limit, ...filters } = req.query as any;
      console.log("Search filters received:", filters);
      const result = await this.propertyService.getProperties(filters, {
        page,
        limit,
      });
      console.log(
        "Search results:",
        result.properties.length,
        "properties found"
      );
      sendSuccess(res, result);
    } catch (error) {
      console.error("Search error:", error);
      next(error);
    }
  };

  getLocations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const locations = await this.propertyService.getLocations();
      sendSuccess(res, locations);
    } catch (error) {
      next(error);
    }
  };

  getPropertyTypes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const types = await this.propertyService.getPropertyTypes();
      sendSuccess(res, types);
    } catch (error) {
      next(error);
    }
  };
}
