import { z } from 'zod';

// User validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Product validation schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive').optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  targetDiseases: z.array(z.string()).optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive').optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  targetDiseases: z.array(z.string()).optional(),
});

// Scan validation schemas
export const createScanSchema = z.object({
  imageUrl: z.string().url('Invalid image URL'),
  prediction: z.any(),
  confidence: z.number().min(0).max(100),
  notes: z.string().optional(),
  isLowConf: z.boolean().optional(),
});

export const updateScanSchema = z.object({
  notes: z.string().optional(),
  isLowConf: z.boolean().optional(),
});

// Disease validation schemas
export const createDiseaseSchema = z.object({
  name: z.string().min(1, 'Disease name is required'),
  description: z.string().optional(),
  commonNames: z.array(z.string()).optional(),
  solutions: z.array(z.string()).optional(),
});

export const updateDiseaseSchema = z.object({
  name: z.string().min(1, 'Disease name is required').optional(),
  description: z.string().optional(),
  commonNames: z.array(z.string()).optional(),
  solutions: z.array(z.string()).optional(),
});

// Query parameter validation
export const paginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('10'),
});

export const productQuerySchema = paginationSchema.extend({
  category: z.string().optional(),
  query: z.string().optional(),
  disease: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const diseaseQuerySchema = paginationSchema.extend({
  query: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Validation middleware helper
export const validate = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Query validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};
