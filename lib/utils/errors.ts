import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { DatabaseNotConfiguredError } from "@/lib/db";

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "CONFLICT"
  | "SETUP_REQUIRED"
  | "SERVER_ERROR";

export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const errors = {
  validation: (message: string) =>
    new ApiError("VALIDATION_ERROR", message, 400),
  unauthorized: (message = "Authentication required") =>
    new ApiError("UNAUTHORIZED", message, 401),
  forbidden: (message = "You do not have access to this resource") =>
    new ApiError("FORBIDDEN", message, 403),
  notFound: (message = "Not found") => new ApiError("NOT_FOUND", message, 404),
  conflict: (message: string) => new ApiError("CONFLICT", message, 409),
  rateLimited: (message = "Too many requests. Please slow down.") =>
    new ApiError("RATE_LIMITED", message, 429),
  server: (message = "Something went wrong on our end") =>
    new ApiError("SERVER_ERROR", message, 500),
};

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status }
    );
  }
  if (error instanceof ZodError) {
    const message = error.issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("; ");
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message } },
      { status: 400 }
    );
  }
  if (error instanceof DatabaseNotConfiguredError) {
    return NextResponse.json(
      { error: { code: "SETUP_REQUIRED", message: error.message } },
      { status: 503 }
    );
  }
  console.error("Unhandled API error:", error);
  return NextResponse.json(
    { error: { code: "SERVER_ERROR", message: "Something went wrong on our end" } },
    { status: 500 }
  );
}
