import { createClient, RedisClientType } from 'redis';
import { coloredLogger } from '../utils/coloredLogger';

interface CacheOptions {
    ttl?: number; // Time to live in seconds
}

class CacheService {
    private client: RedisClientType;
    private isConnected: boolean = false;

    constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        });

        this.client.on('error', (err: any) => {
            coloredLogger.logRedisConnection('REDIS', 'CONNECTION', false, {
                error: err.message,
                url: process.env.REDIS_URL || 'redis://localhost:6379'
            });
            this.isConnected = false;
        });

        this.client.on('connect', () => {
            coloredLogger.logRedisConnection('REDIS', 'CONNECTION', true, {
                url: process.env.REDIS_URL || 'redis://localhost:6379'
            });
            this.isConnected = true;
        });

        this.client.on('ready', () => {
            coloredLogger.info('REDIS', 'READY', 'Redis client ready for operations');
        });

        this.client.on('end', () => {
            coloredLogger.warning('REDIS', 'DISCONNECTED', 'Redis client disconnected');
            this.isConnected = false;
        });

        this.connect();
    }

    private async connect() {
        try {
            await this.client.connect();
        } catch (error) {
            coloredLogger.logRedisConnection('REDIS', 'INITIAL_CONNECTION', false, {
                error: (error as Error).message,
                fallback: 'Using mock cache'
            });
        }
    }

    async get<T>(key: string): Promise<T | null> {
        if (!this.isConnected) {
            coloredLogger.debug('CACHE', 'GET', `Mock cache get: ${key}`);
            return null;
        }

        try {
            const value = await this.client.get(key);
            coloredLogger.logCacheService('GET', true, { key, found: !!value });
            return value ? JSON.parse(value) : null;
        } catch (error) {
            coloredLogger.logCacheService('GET', false, { key, error: (error as Error).message });
            return null;
        }
    }

    async set(key: string, value: any, options: CacheOptions = {}): Promise<boolean> {
        if (!this.isConnected) {
            coloredLogger.debug('CACHE', 'SET', `Mock cache set: ${key}`);
            return true;
        }

        try {
            const serializedValue = JSON.stringify(value);
            if (options.ttl) {
                await this.client.setEx(key, options.ttl, serializedValue);
            } else {
                await this.client.set(key, serializedValue);
            }
            coloredLogger.logCacheService('SET', true, { key, ttl: options.ttl });
            return true;
        } catch (error) {
            coloredLogger.logCacheService('SET', false, { key, error: (error as Error).message });
            return false;
        }
    }

    async del(key: string): Promise<boolean> {
        if (!this.isConnected) {
            coloredLogger.debug('CACHE', 'DELETE', `Mock cache delete: ${key}`);
            return true;
        }

        try {
            await this.client.del(key);
            coloredLogger.logCacheService('DELETE', true, { key });
            return true;
        } catch (error) {
            coloredLogger.logCacheService('DELETE', false, { key, error: (error as Error).message });
            return false;
        }
    }

    async exists(key: string): Promise<boolean> {
        if (!this.isConnected) {
            coloredLogger.debug('CACHE', 'EXISTS', `Mock cache exists: ${key}`);
            return false;
        }

        try {
            const result = await this.client.exists(key);
            coloredLogger.logCacheService('EXISTS', true, { key, exists: result === 1 });
            return result === 1;
        } catch (error) {
            coloredLogger.logCacheService('EXISTS', false, { key, error: (error as Error).message });
            return false;
        }
    }

    async increment(key: string, amount: number = 1): Promise<number> {
        if (!this.isConnected) {
            coloredLogger.debug('CACHE', 'INCREMENT', `Mock cache increment: ${key} by ${amount}`);
            return amount;
        }

        try {
            const result = await this.client.incrBy(key, amount);
            coloredLogger.logCacheService('INCREMENT', true, { key, amount, result });
            return result;
        } catch (error) {
            coloredLogger.logCacheService('INCREMENT', false, { key, amount, error: (error as Error).message });
            return 0;
        }
    }

    async decrement(key: string, amount: number = 1): Promise<number> {
        if (!this.isConnected) {
            coloredLogger.debug('CACHE', 'DECREMENT', `Mock cache decrement: ${key} by ${amount}`);
            return -amount;
        }

        try {
            const result = await this.client.decrBy(key, amount);
            coloredLogger.logCacheService('DECREMENT', true, { key, amount, result });
            return result;
        } catch (error) {
            coloredLogger.logCacheService('DECREMENT', false, { key, amount, error: (error as Error).message });
            return 0;
        }
    }

    // Cache invalidation patterns
    async invalidatePattern(pattern: string): Promise<void> {
        if (!this.isConnected) {
            coloredLogger.debug('CACHE', 'INVALIDATE_PATTERN', `Mock cache invalidate pattern: ${pattern}`);
            return;
        }

        try {
            const keys = await this.client.keys(pattern);
            if (keys.length > 0) {
                await this.client.del(keys);
                coloredLogger.logCacheService('INVALIDATE_PATTERN', true, { pattern, keysDeleted: keys.length });
            } else {
                coloredLogger.info('CACHE', 'INVALIDATE_PATTERN', `No keys found for pattern: ${pattern}`);
            }
        } catch (error) {
            coloredLogger.logCacheService('INVALIDATE_PATTERN', false, { pattern, error: (error as Error).message });
        }
    }

    // Helper methods for common caching patterns
    async cacheUser(userId: number, userData: any, ttl: number = 3600): Promise<void> {
        await this.set(`user:${userId}`, userData, { ttl });
        coloredLogger.info('CACHE', 'CACHE_USER', `User data cached for user ${userId}`, { ttl });
    }

    async getUser(userId: number): Promise<any> {
        const result = await this.get(`user:${userId}`);
        if (result) {
            coloredLogger.info('CACHE', 'GET_USER', `Cache hit for user ${userId}`);
        } else {
            coloredLogger.info('CACHE', 'GET_USER', `Cache miss for user ${userId}`);
        }
        return result;
    }

    async cacheScan(scanId: number, scanData: any, ttl: number = 1800): Promise<void> {
        await this.set(`scan:${scanId}`, scanData, { ttl });
        coloredLogger.info('CACHE', 'CACHE_SCAN', `Scan data cached for scan ${scanId}`, { ttl });
    }

    async getScan(scanId: number): Promise<any> {
        const result = await this.get(`scan:${scanId}`);
        if (result) {
            coloredLogger.info('CACHE', 'GET_SCAN', `Cache hit for scan ${scanId}`);
        } else {
            coloredLogger.info('CACHE', 'GET_SCAN', `Cache miss for scan ${scanId}`);
        }
        return result;
    }

    async cacheProducts(products: any[], ttl: number = 7200): Promise<void> {
        await this.set('products:all', products, { ttl });
        coloredLogger.info('CACHE', 'CACHE_PRODUCTS', `Products cached`, { count: products.length, ttl });
    }

    async getProducts(): Promise<any[]> {
        const result = await this.get('products:all') as any[];
        if (result) {
            coloredLogger.info('CACHE', 'GET_PRODUCTS', `Cache hit for products`, { count: result.length });
        } else {
            coloredLogger.info('CACHE', 'GET_PRODUCTS', `Cache miss for products`);
        }
        return result || [];
    }

    async cacheDiseases(diseases: any[], ttl: number = 7200): Promise<void> {
        await this.set('diseases:all', diseases, { ttl });
        coloredLogger.info('CACHE', 'CACHE_DISEASES', `Diseases cached`, { count: diseases.length, ttl });
    }

    async getDiseases(): Promise<any[]> {
        const result = await this.get('diseases:all') as any[];
        if (result) {
            coloredLogger.info('CACHE', 'GET_DISEASES', `Cache hit for diseases`, { count: result.length });
        } else {
            coloredLogger.info('CACHE', 'GET_DISEASES', `Cache miss for diseases`);
        }
        return result || [];
    }

    async cacheUserScans(userId: number, scans: any[], ttl: number = 1800): Promise<void> {
        await this.set(`user:${userId}:scans`, scans, { ttl });
        coloredLogger.info('CACHE', 'CACHE_USER_SCANS', `User scans cached for user ${userId}`, { count: scans.length, ttl });
    }

    async getUserScans(userId: number): Promise<any[]> {
        const result = await this.get(`user:${userId}:scans`) as any[];
        if (result) {
            coloredLogger.info('CACHE', 'GET_USER_SCANS', `Cache hit for user scans`, { userId, count: result.length });
        } else {
            coloredLogger.info('CACHE', 'GET_USER_SCANS', `Cache miss for user scans`, { userId });
        }
        return result || [];
    }

    // Cache statistics
    async getStats(): Promise<{ connected: boolean; memory?: string }> {
        const stats = {
            connected: this.isConnected,
            memory: this.isConnected ? await this.client.info('memory') : undefined
        };
        
        coloredLogger.info('CACHE', 'GET_STATS', `Cache stats retrieved`, stats);
        return stats;
    }

    async disconnect(): Promise<void> {
        if (this.isConnected) {
            await this.client.disconnect();
            coloredLogger.info('CACHE', 'DISCONNECT', 'Redis client disconnected');
        }
    }
}

export const cacheService = new CacheService();
