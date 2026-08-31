import dotenv from 'dotenv';
import { jest } from '@jest/globals';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment defaults
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db';

// Mock console methods in tests to reduce noise
const originalConsole = { ...console };

// Setup and teardown functions for Jest
export const setupTestEnvironment = () => {
  global.console = {
    ...originalConsole,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  };
};

export const cleanupTestEnvironment = () => {
  global.console = originalConsole;
};
