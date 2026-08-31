import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import dotenv from 'dotenv';
import { coloredLogger } from '../utils/coloredLogger';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Test database connection
pool.on('connect', () => {
    coloredLogger.logDatabaseConnection('DATABASE', 'CONNECTION', true, {
        host: pool.options.host,
        database: pool.options.database,
        port: pool.options.port
    });
});

pool.on('error', (err) => {
    coloredLogger.logDatabaseConnection('DATABASE', 'CONNECTION', false, {
        error: err.message,
        host: pool.options.host,
        database: pool.options.database
    });
});

export const db = drizzle(pool, { schema });
