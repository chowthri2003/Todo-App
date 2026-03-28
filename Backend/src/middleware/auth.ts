import { clerkMiddleware, requireAuth, getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
export const clerkAuth = clerkMiddleware();

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req);

  if (!auth || !auth.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - No valid Clerk session",
    });
  }

  req.userId = auth.userId;
  next();
};


