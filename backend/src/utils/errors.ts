export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public details: any[];

  constructor(message: string, details: any[] = []) {
    super(message, 400);
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500);
  }
}

export class FileUploadError extends AppError {
  constructor(message: string = 'File upload failed') {
    super(message, 400);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string = 'External service error') {
    super(`${service}: ${message}`, 502);
  }
}

// Error handler utility
export const handleError = (error: any): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  // Handle specific database errors
  if (error.code === '23505') {
    return new ConflictError('Resource already exists');
  }

  if (error.code === '23503') {
    return new ValidationError('Foreign key constraint violation');
  }

  if (error.code === '23502') {
    return new ValidationError('Required field is missing');
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return new UnauthorizedError('Invalid token');
  }

  if (error.name === 'TokenExpiredError') {
    return new UnauthorizedError('Token expired');
  }

  // Handle multer errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return new FileUploadError('File too large');
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    return new FileUploadError('Too many files');
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return new FileUploadError('Unexpected file field');
  }

  // Default to internal server error
  return new AppError(error.message || 'Internal server error', 500);
};
