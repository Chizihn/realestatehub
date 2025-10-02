import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "./index";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export type AuthenticatedHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => void | Promise<void>;
