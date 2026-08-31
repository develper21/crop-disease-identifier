import { Request, Response, NextFunction } from 'express';

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  requestId?: string;
  userId?: number;
  ip?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
  error?: any;
}

class Logger {
  private logLevel: LogLevel;

  constructor() {
    this.logLevel = this.getLogLevel();
  }

  private getLogLevel(): LogLevel {
    const envLevel = process.env.LOG_LEVEL;
    switch (envLevel) {
      case 'ERROR':
        return LogLevel.ERROR;
      case 'WARN':
        return LogLevel.WARN;
      case 'DEBUG':
        return LogLevel.DEBUG;
      default:
        return LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  private formatLog(entry: LogEntry): string {
    const logObject = {
      timestamp: entry.timestamp,
      level: entry.level,
      message: entry.message,
      ...(entry.requestId && { requestId: entry.requestId }),
      ...(entry.userId && { userId: entry.userId }),
      ...(entry.ip && { ip: entry.ip }),
      ...(entry.userAgent && { userAgent: entry.userAgent }),
      ...(entry.method && { method: entry.method }),
      ...(entry.url && { url: entry.url }),
      ...(entry.statusCode && { statusCode: entry.statusCode }),
      ...(entry.responseTime && { responseTime: entry.responseTime }),
      ...(entry.error && { error: entry.error }),
    };

    return JSON.stringify(logObject);
  }

  private writeLog(level: LogLevel, message: string, meta?: any) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta,
    };

    const formattedLog = this.formatLog(entry);

    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedLog);
        break;
      case LogLevel.WARN:
        console.warn(formattedLog);
        break;
      case LogLevel.INFO:
        console.info(formattedLog);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedLog);
        break;
    }
  }

  error(message: string, meta?: any) {
    this.writeLog(LogLevel.ERROR, message, meta);
  }

  warn(message: string, meta?: any) {
    this.writeLog(LogLevel.WARN, message, meta);
  }

  info(message: string, meta?: any) {
    this.writeLog(LogLevel.INFO, message, meta);
  }

  debug(message: string, meta?: any) {
    this.writeLog(LogLevel.DEBUG, message, meta);
  }

  // Request logging middleware
  requestLogger() {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      const requestId = this.generateRequestId();

      // Add request ID to request object
      (req as any).requestId = requestId;

      // Log request
      this.info('Request started', {
        requestId,
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: (req as any).user?.userId,
      });

      // Listen for response finish event instead of overriding end
      res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        
        this.info('Request completed', {
          requestId,
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          responseTime,
        });
      });

      next();
    };
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }
}

export const logger = new Logger();

// Error logging middleware
export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error', {
    requestId: (req as any).requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: (req as any).user?.userId,
    error: {
      message: err.message,
      stack: err.stack,
      code: err.code,
    },
  });

  next(err);
};
