import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class ResponseHelper {
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
    };
    return res.status(statusCode).json(response);
  }

  static successWithPagination<T>(
    res: Response,
    data: T[],
    pagination: any,
    message?: string,
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T[]> = {
      success: true,
      data: data,
      message,
      pagination,
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    error: string,
    statusCode: number = 500
  ): Response {
    const response: ApiResponse = {
      success: false,
      error,
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    data: T,
    message?: string
  ): Response {
    return this.success(res, data, message, 201);
  }

  static badRequest(
    res: Response,
    error: string = 'Bad request'
  ): Response {
    return this.error(res, error, 400);
  }

  static unauthorized(
    res: Response,
    error: string = 'Unauthorized'
  ): Response {
    return this.error(res, error, 401);
  }

  static forbidden(
    res: Response,
    error: string = 'Forbidden'
  ): Response {
    return this.error(res, error, 403);
  }

  static notFound(
    res: Response,
    error: string = 'Resource not found'
  ): Response {
    return this.error(res, error, 404);
  }

  static conflict(
    res: Response,
    error: string = 'Resource already exists'
  ): Response {
    return this.error(res, error, 409);
  }

  static tooLarge(
    res: Response,
    error: string = 'Payload too large'
  ): Response {
    return this.error(res, error, 413);
  }

  static serverError(
    res: Response,
    error: string = 'Internal server error'
  ): Response {
    return this.error(res, error, 500);
  }
}

// Helper function to create pagination object
export const createPagination = (
  page: number,
  limit: number,
  total: number
) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

// Helper function to calculate offset
export const calculateOffset = (page: number, limit: number) => {
  return (page - 1) * limit;
};
