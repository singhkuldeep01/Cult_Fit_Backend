// app-error.ts

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number, name?: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = name || new.target.name;

    // Important for proper prototype chain (especially in TypeScript)
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Specific HTTP Errors

export class InternalServerError extends AppError {
  constructor(message: string = "Internal Server Error") {
    super(message, 500, 'InternalServerError');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource Not Found") {
    super(message, 404, 'NotFoundError');
  }
}

export class FileNotFoundError extends AppError {
  constructor(message: string = "File Not Found") {
    super(message, 404, 'FileNotFoundError');
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request") {
    super(message, 400, 'BadRequestError');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, 'UnauthorizedError');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403, 'ForbiddenError');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict") {
    super(message, 409, 'ConflictError');
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = "Service Unavailable") {
    super(message, 503, 'ServiceUnavailableError');
  }
}
