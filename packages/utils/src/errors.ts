// ============================================
// HTTP STATUS CODES (REST API Standard)
// ============================================
export enum HttpStatus {
  // Success
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,

  // Client Errors
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,

  // Server Errors
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

// ============================================
// ERROR TYPES (for categorization)
// ============================================
export enum ErrorType {
  VALIDATION = "VALIDATION_ERROR",
  AUTHENTICATION = "AUTHENTICATION_ERROR",
  AUTHORIZATION = "AUTHORIZATION_ERROR",
  NOT_FOUND = "NOT_FOUND_ERROR",
  CONFLICT = "CONFLICT_ERROR",
  DATABASE = "DATABASE_ERROR",
  BUSINESS_LOGIC = "BUSINESS_LOGIC_ERROR",
  EXTERNAL_SERVICE = "EXTERNAL_SERVICE_ERROR",
  UNKNOWN = "UNKNOWN_ERROR",
}

// ============================================
// BASE ERROR CLASS
// ============================================
export class AppError extends Error {
  public readonly statusCode: HttpStatus;
  public readonly type: ErrorType;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, any>;
  public readonly timestamp: string;

  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    type: ErrorType = ErrorType.UNKNOWN,
    isOperational: boolean = true,
    details?: Record<string, any>,
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.type = type;
    this.isOperational = isOperational;
    this.details = details;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      type: this.type,
      details: this.details,
      timestamp: this.timestamp,
      ...(process.env.NODE_ENV === "development" && { stack: this.stack }),
    };
  }
}

// ============================================
// SPECIFIC ERROR CLASSES
// ============================================

export class ValidationError extends AppError {
  constructor(
    message: string = "Validation failed",
    field?: string,
    details?: Record<string, any>,
  ) {
    super(message, HttpStatus.BAD_REQUEST, ErrorType.VALIDATION, true, {
      field,
      ...details,
    });
  }
}

export class RequiredFieldError extends AppError {
  constructor(fieldName: string) {
    super(
      `${fieldName} is required`,
      HttpStatus.BAD_REQUEST,
      ErrorType.VALIDATION,
      true,
      { field: fieldName },
    );
  }
}

export class InvalidFormatError extends AppError {
  constructor(fieldName: string, expectedFormat: string, receivedValue?: any) {
    super(
      `${fieldName} has invalid format. Expected: ${expectedFormat}`,
      HttpStatus.BAD_REQUEST,
      ErrorType.VALIDATION,
      true,
      { field: fieldName, expectedFormat, receivedValue },
    );
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    super(
      identifier
        ? `${resource} with ID "${identifier}" not found`
        : `${resource} not found`,
      HttpStatus.NOT_FOUND,
      ErrorType.NOT_FOUND,
      true,
      { resource, identifier },
    );
  }
}

export class CreationError extends AppError {
  constructor(
    resource: string,
    reason?: string,
    details?: Record<string, any>,
  ) {
    super(
      reason
        ? `Failed to create ${resource}: ${reason}`
        : `Failed to create ${resource}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorType.DATABASE,
      true,
      { resource, reason, ...details },
    );
  }
}

export class UpdateError extends AppError {
  constructor(resource: string, identifier?: string, reason?: string) {
    super(
      reason
        ? `Failed to update ${resource}: ${reason}`
        : `Failed to update ${resource}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorType.DATABASE,
      true,
      { resource, identifier, reason },
    );
  }
}

export class DeleteError extends AppError {
  constructor(resource: string, identifier?: string, reason?: string) {
    super(
      reason
        ? `Failed to delete ${resource}: ${reason}`
        : `Failed to delete ${resource}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorType.DATABASE,
      true,
      { resource, identifier, reason },
    );
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, HttpStatus.CONFLICT, ErrorType.CONFLICT, true, details);
  }
}

export class DeleteWithChildrenError extends AppError {
  constructor(resource: string, childCount: number, childType: string) {
    super(
      `Cannot delete ${resource} because it has ${childCount} ${childType}(s)`,
      HttpStatus.CONFLICT,
      ErrorType.BUSINESS_LOGIC,
      true,
      { resource, childCount, childType },
    );
  }
}

export class DuplicateEntryError extends AppError {
  constructor(resource: string, field?: string, value?: string) {
    super(
      field && value
        ? `${resource} with ${field} "${value}" already exists`
        : `${resource} already exists`,
      HttpStatus.CONFLICT,
      ErrorType.CONFLICT,
      true,
      { resource, field, value },
    );
  }
}

export class ForeignKeyViolationError extends AppError {
  constructor(
    message: string = "Cannot perform operation: related records exist",
  ) {
    super(message, HttpStatus.CONFLICT, ErrorType.DATABASE, true);
  }
}

export class DatabaseError extends AppError {
  constructor(operation: string, tableName?: string, originalError?: any) {
    super(
      `Database error during ${operation}${tableName ? ` on ${tableName}` : ""}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorType.DATABASE,
      true,
      { operation, tableName, originalError: originalError?.message },
    );
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, HttpStatus.UNAUTHORIZED, ErrorType.AUTHENTICATION, true);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Access forbidden") {
    super(message, HttpStatus.FORBIDDEN, ErrorType.AUTHORIZATION, true);
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(
      message,
      HttpStatus.UNPROCESSABLE_ENTITY,
      ErrorType.VALIDATION,
      true,
      details,
    );
  }
}

// ============================================
// ERROR FACTORY FUNCTIONS
// ============================================

export function createError(
  type:
    | "validation"
    | "notFound"
    | "create"
    | "update"
    | "delete"
    | "database"
    | "conflict"
    | "unauthorized"
    | "forbidden",
  params: {
    message?: string;
    resource?: string;
    field?: string;
    identifier?: string;
    reason?: string;
    details?: Record<string, any>;
  },
): AppError {
  switch (type) {
    case "validation":
      return new ValidationError(params.message, params.field, params.details);
    case "notFound":
      return new NotFoundError(
        params.resource || "Resource",
        params.identifier,
      );
    case "create":
      return new CreationError(
        params.resource || "Resource",
        params.reason,
        params.details,
      );
    case "update":
      return new UpdateError(
        params.resource || "Resource",
        params.identifier,
        params.reason,
      );
    case "delete":
      return new DeleteError(
        params.resource || "Resource",
        params.identifier,
        params.reason,
      );
    case "database":
      return new DatabaseError(params.message || "operation", params.resource);
    case "conflict":
      return new ConflictError(
        params.message || "Resource conflict",
        params.details,
      );
    case "unauthorized":
      return new UnauthorizedError(params.message);
    case "forbidden":
      return new ForbiddenError(params.message);
    default:
      return new AppError(params.message || "An error occurred");
  }
}

// ============================================
// ERROR HANDLERS
// ============================================

export function handleZodError(error: any, resource?: string): ValidationError {
  const issues = error.issues || error.errors || [];
  const firstIssue = issues[0];

  if (firstIssue) {
    const field = firstIssue.path?.join(".") || "unknown";
    return new ValidationError(
      firstIssue.message || "Validation failed",
      field,
      { issues },
    );
  }

  return new ValidationError(
    `${resource || "Data"} validation failed`,
    undefined,
    { issues },
  );
}

export function handleSupabaseError(
  error: any,
  operation: string,
  resource?: string,
): AppError {
  // PostgreSQL error codes (Supabase uses PostgreSQL)
  if (error.code === "23503") {
    return new ForeignKeyViolationError();
  }

  if (error.code === "23505") {
    return new DuplicateEntryError(resource || "Record");
  }

  if (error.code === "PGRST116") {
    return new NotFoundError(resource || "Record");
  }

  if (error.code === "23514") {
    return new ValidationError("Check constraint violation");
  }

  if (error.code === "23502") {
    return new RequiredFieldError("required field");
  }

  return new DatabaseError(operation, resource, error);
}

// ============================================
// TYPE GUARDS
// ============================================

export function isAppError(error: any): error is AppError {
  return error instanceof AppError;
}

export function isValidationError(error: any): error is ValidationError {
  return error instanceof ValidationError;
}

export function isNotFoundError(error: any): error is NotFoundError {
  return error instanceof NotFoundError;
}

export function isConflictError(error: any): error is ConflictError {
  return error instanceof ConflictError;
}

export function isUnauthorizedError(error: any): error is UnauthorizedError {
  return error instanceof UnauthorizedError;
}

export function isForbiddenError(error: any): error is ForbiddenError {
  return error instanceof ForbiddenError;
}

// ============================================
// ERROR RESPONSE HELPERS
// ============================================

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: string;
  statusCode?: HttpStatus;
  type?: ErrorType;
  details?: Record<string, any>;
  timestamp?: string;
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

export function toErrorResponse(error: unknown): ErrorResponse {
  if (isAppError(error)) {
    return {
      success: false,
      error: error.message,
      statusCode: error.statusCode,
      type: error.type,
      details: error.details,
      timestamp: error.timestamp,
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      type: ErrorType.UNKNOWN,
    };
  }

  return {
    success: false,
    error: "An unknown error occurred",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ErrorType.UNKNOWN,
  };
}

export function toSuccessResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data,
  };
}

// ============================================
// SAFE ASYNC WRAPPER
// ============================================

export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorMessage?: string,
): Promise<[null, T] | [AppError, null]> {
  try {
    const result = await fn();
    return [null, result];
  } catch (error) {
    if (isAppError(error)) {
      return [error, null];
    }

    return [
      new AppError(
        errorMessage || error instanceof Error
          ? (error as any).message
          : "Unknown error",
      ),
      null,
    ];
  }
}

// ============================================
// HELPER: GET HTTP STATUS TEXT
// ============================================

export function getStatusText(statusCode: HttpStatus): string {
  const statusTexts: Record<HttpStatus, string> = {
    [HttpStatus.OK]: "OK",
    [HttpStatus.CREATED]: "Created",
    [HttpStatus.NO_CONTENT]: "No Content",
    [HttpStatus.BAD_REQUEST]: "Bad Request",
    [HttpStatus.UNAUTHORIZED]: "Unauthorized",
    [HttpStatus.FORBIDDEN]: "Forbidden",
    [HttpStatus.NOT_FOUND]: "Not Found",
    [HttpStatus.CONFLICT]: "Conflict",
    [HttpStatus.UNPROCESSABLE_ENTITY]: "Unprocessable Entity",
    [HttpStatus.INTERNAL_SERVER_ERROR]: "Internal Server Error",
    [HttpStatus.NOT_IMPLEMENTED]: "Not Implemented",
    [HttpStatus.BAD_GATEWAY]: "Bad Gateway",
    [HttpStatus.SERVICE_UNAVAILABLE]: "Service Unavailable",
  };

  return statusTexts[statusCode] || "Unknown Status";
}
