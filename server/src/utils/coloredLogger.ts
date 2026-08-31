import { Request, Response, NextFunction } from 'express';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

export enum LogType {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

export interface LogEntry {
  timestamp: string;
  type: LogType;
  service: string;
  operation: string;
  message: string;
  details?: any;
  requestId?: string;
  userId?: number;
  ip?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
}

class ColoredLogger {
  private logLevel: LogType;

  constructor() {
    this.logLevel = this.getLogLevel();
  }

  private getLogLevel(): LogType {
    const envLevel = process.env.LOG_LEVEL?.toUpperCase() as LogType;
    return envLevel || LogType.INFO;
  }

  private getColor(type: LogType): string {
    switch (type) {
      case LogType.SUCCESS:
        return colors.green;
      case LogType.FAILED:
        return colors.red;
      case LogType.WARNING:
        return colors.yellow;
      case LogType.ERROR:
        return colors.red;
      case LogType.INFO:
        return colors.blue;
      case LogType.DEBUG:
        return colors.cyan;
      default:
        return colors.white;
    }
  }

  private formatTimestamp(): string {
    const now = new Date();
    return now.toISOString();
  }

  private formatLog(entry: LogEntry): string {
    const color = this.getColor(entry.type);
    const reset = colors.reset;
    const timestamp = entry.timestamp;
    const type = entry.type.padEnd(7);
    const service = entry.service.padEnd(15);
    const operation = entry.operation.padEnd(20);
    
    let log = `${color}[${type}]${reset} ${colors.dim}${timestamp}${reset} ${colors.cyan}${service}${reset} ${colors.magenta}${operation}${reset} ${entry.message}`;
    
    if (entry.details) {
      log += ` ${colors.dim}${JSON.stringify(entry.details)}${reset}`;
    }
    
    if (entry.requestId) {
      log += ` ${colors.yellow}[ID:${entry.requestId}]${reset}`;
    }
    
    if (entry.userId) {
      log += ` ${colors.blue}[User:${entry.userId}]${reset}`;
    }
    
    if (entry.responseTime) {
      log += ` ${colors.green}${entry.responseTime}ms${reset}`;
    }
    
    return log;
  }

  private shouldLog(type: LogType): boolean {
    const levels = [LogType.ERROR, LogType.FAILED, LogType.WARNING, LogType.INFO, LogType.DEBUG];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(type);
    return messageLevelIndex <= currentLevelIndex;
  }

  public success(service: string, operation: string, message: string, details?: any): void {
    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      type: LogType.SUCCESS,
      service,
      operation,
      message,
      details
    };
    
    if (this.shouldLog(LogType.SUCCESS)) {
      console.log(this.formatLog(entry));
    }
  }

  public failed(service: string, operation: string, message: string, details?: any): void {
    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      type: LogType.FAILED,
      service,
      operation,
      message,
      details
    };
    
    if (this.shouldLog(LogType.FAILED)) {
      console.log(this.formatLog(entry));
    }
  }

  public info(service: string, operation: string, message: string, details?: any): void {
    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      type: LogType.INFO,
      service,
      operation,
      message,
      details
    };
    
    if (this.shouldLog(LogType.INFO)) {
      console.log(this.formatLog(entry));
    }
  }

  public warning(service: string, operation: string, message: string, details?: any): void {
    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      type: LogType.WARNING,
      service,
      operation,
      message,
      details
    };
    
    if (this.shouldLog(LogType.WARNING)) {
      console.log(this.formatLog(entry));
    }
  }

  public error(service: string, operation: string, message: string, details?: any): void {
    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      type: LogType.ERROR,
      service,
      operation,
      message,
      details
    };
    
    if (this.shouldLog(LogType.ERROR)) {
      console.log(this.formatLog(entry));
    }
  }

  public debug(service: string, operation: string, message: string, details?: any): void {
    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      type: LogType.DEBUG,
      service,
      operation,
      message,
      details
    };
    
    if (this.shouldLog(LogType.DEBUG)) {
      console.log(this.formatLog(entry));
    }
  }

  // Request logging middleware
  public requestLogger() {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      const requestId = Math.random().toString(36).substring(7);
      
      // Add request ID to request object
      (req as any).requestId = requestId;
      
      const service = 'EXPRESS';
      const operation = `${req.method} ${req.route?.path || req.path}`;
      
      this.info(service, operation, 'Request started', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        requestId
      });

      // Override res.end to log response
      const originalEnd = res.end;
      (res.end as any) = function(this: Response, chunk?: any, encoding?: any) {
        const responseTime = Date.now() - startTime;
        const logType = res.statusCode >= 400 ? LogType.FAILED : LogType.SUCCESS;
        
        const logger = new ColoredLogger();
        if (logType === LogType.SUCCESS) {
          logger.success(service, operation, `Request completed - Status: ${res.statusCode}`, {
            requestId,
            statusCode: res.statusCode,
            responseTime
          });
        } else {
          logger.failed(service, operation, `Request completed - Status: ${res.statusCode}`, {
            requestId,
            statusCode: res.statusCode,
            responseTime
          });
        }
        
        originalEnd.call(this, chunk, encoding);
        return res;
      };

      next();
    };
  }

  // Database connection logging
  public logDatabaseConnection(service: string, operation: string, success: boolean, details?: any): void {
    if (success) {
      this.success(service, operation, 'Database connection established', details);
    } else {
      this.failed(service, operation, 'Database connection failed', details);
    }
  }

  // Redis connection logging
  public logRedisConnection(service: string, operation: string, success: boolean, details?: any): void {
    if (success) {
      this.success(service, operation, 'Redis connection established', details);
    } else {
      this.failed(service, operation, 'Redis connection failed', details);
    }
  }

  // External service logging
  public logExternalService(service: string, operation: string, success: boolean, details?: any): void {
    if (success) {
      this.success(service, operation, 'External service call successful', details);
    } else {
      this.failed(service, operation, 'External service call failed', details);
    }
  }

  // ML Service logging
  public logMLService(operation: string, success: boolean, details?: any): void {
    const service = 'ML-SERVICE';
    if (success) {
      this.success(service, operation, 'ML prediction successful', details);
    } else {
      this.failed(service, operation, 'ML prediction failed', details);
    }
  }

  // Email service logging
  public logEmailService(operation: string, success: boolean, details?: any): void {
    const service = 'EMAIL-SERVICE';
    if (success) {
      this.success(service, operation, 'Email sent successfully', details);
    } else {
      this.failed(service, operation, 'Email send failed', details);
    }
  }

  // Cache service logging
  public logCacheService(operation: string, success: boolean, details?: any): void {
    const service = 'CACHE-SERVICE';
    if (success) {
      this.success(service, operation, 'Cache operation successful', details);
    } else {
      this.failed(service, operation, 'Cache operation failed', details);
    }
  }
}

export const coloredLogger = new ColoredLogger();
