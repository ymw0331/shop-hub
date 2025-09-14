import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;

    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += ` | ${JSON.stringify(meta)}`;
    }

    // Add stack trace for errors
    if (stack) {
      log += `\n${stack}`;
    }

    return log;
  })
);

// Console format with colors for development
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} ${level}: ${message}`;

    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta, null, 2)}`;
    }

    return log;
  })
);

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');

// Define transports
const transports: winston.transport[] = [];

// Console transport (always enabled)
transports.push(
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? format : consoleFormat,
  })
);

// File transports with rotation
if (process.env.NODE_ENV === 'production') {
  // Error log file
  transports.push(
    new DailyRotateFile({
      filename: path.join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
      format,
    })
  );

  // Combined log file
  transports.push(
    new DailyRotateFile({
      filename: path.join(logsDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format,
    })
  );
} else {
  // Development: All logs to single file
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'debug.log'),
      level: 'debug',
      format,
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  levels,
  transports,
  exitOnError: false,
});

// Helper functions for logging with context
export class Logger {
  private context: string;
  private metadata: Record<string, any>;

  constructor(context: string, metadata: Record<string, any> = {}) {
    this.context = context;
    this.metadata = metadata;
  }

  private log(level: string, message: string, meta?: Record<string, any>) {
    const fullMeta = {
      context: this.context,
      ...this.metadata,
      ...meta,
    };

    logger.log(level, message, fullMeta);
  }

  error(message: string, error?: Error | any, meta?: Record<string, any>) {
    const errorMeta = error ? {
      error: error.message || error,
      stack: error.stack,
      ...meta,
    } : meta;

    this.log('error', message, errorMeta);
  }

  warn(message: string, meta?: Record<string, any>) {
    this.log('warn', message, meta);
  }

  info(message: string, meta?: Record<string, any>) {
    this.log('info', message, meta);
  }

  http(message: string, meta?: Record<string, any>) {
    this.log('http', message, meta);
  }

  debug(message: string, meta?: Record<string, any>) {
    this.log('debug', message, meta);
  }

  // Log method entry with parameters
  methodEntry(methodName: string, params?: Record<string, any>) {
    this.debug(`Entering ${methodName}`, { method: methodName, params: this.sanitizeParams(params) });
  }

  // Log method exit with result
  methodExit(methodName: string, result?: any) {
    this.debug(`Exiting ${methodName}`, { method: methodName, result: this.sanitizeResult(result) });
  }

  // Log database query
  query(operation: string, details?: Record<string, any>) {
    this.debug(`Database ${operation}`, { operation, ...details });
  }

  // Log API request
  request(method: string, url: string, body?: any, params?: any) {
    this.http(`${method} ${url}`, {
      method,
      url,
      body: this.sanitizeParams(body),
      params: this.sanitizeParams(params),
    });
  }

  // Log API response
  response(statusCode: number, data?: any) {
    const level = statusCode >= 400 ? 'warn' : 'http';
    this.log(level, `Response ${statusCode}`, {
      statusCode,
      data: this.sanitizeResult(data),
    });
  }

  // Sanitize sensitive data
  private sanitizeParams(params: any): any {
    if (!params) return params;

    const sanitized = { ...params };
    const sensitiveFields = ['password', 'token', 'secret', 'authorization', 'cookie'];

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  private sanitizeResult(result: any): any {
    if (!result) return result;

    // Limit array size in logs
    if (Array.isArray(result)) {
      return {
        type: 'array',
        length: result.length,
        sample: result.slice(0, 3),
      };
    }

    // Sanitize object fields
    if (typeof result === 'object') {
      return this.sanitizeParams(result);
    }

    return result;
  }

  // Performance logging
  startTimer(label: string): () => void {
    const start = Date.now();
    this.debug(`Timer started: ${label}`);

    return () => {
      const duration = Date.now() - start;
      this.debug(`Timer ended: ${label}`, { duration: `${duration}ms` });
    };
  }
}

// Create default logger instance
export const defaultLogger = new Logger('Application');

// Export logger for direct use
export default logger;