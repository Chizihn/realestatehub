import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import { sendError } from "../utils/response";

export const validateBody = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return sendError(
        res,
        "VALIDATION_ERROR",
        error.details[0].message,
        400,
        error.details
      );
    }
    next();
  };
};

export const validateQuery = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query);
    if (error) {
      return sendError(
        res,
        "VALIDATION_ERROR",
        error.details[0].message,
        400,
        error.details
      );
    }
    req.query = value;
    next();
  };
};
