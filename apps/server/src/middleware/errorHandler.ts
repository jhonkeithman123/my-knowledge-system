import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error:", err);

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: "Validation error",
      details: err.issues, // Changed from err.errors
    });
  }

  // Supabase/Database errors
  if (
    err.message.includes("duplicate key") ||
    err.message.includes("unique constraint")
  ) {
    return res.status(409).json({
      success: false,
      error: "Resource already exists",
    });
  }

  if (err.message.includes("not found") || err.message.includes("No rows")) {
    return res.status(404).json({
      success: false,
      error: "Resource not found",
    });
  }

  // Generic error
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
