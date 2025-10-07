import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Define log format
const logFormat = winston.format.printf(async ({ timestamp, level, message, transactionId }) => {
    return `${timestamp} [${transactionId || 'N/A'}] ${level.toUpperCase()}: ${message}`;
});

// Create the logger instance
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat,
    ),
    transports: [
        // Info logs (detailed logs)
        new DailyRotateFile({
            filename: path.join('logs', 'app-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '10m',
            maxFiles: '14d',
            level: 'info',
        }),
        // Error logs
        new DailyRotateFile({
            filename: path.join('logs', 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '10m',
            maxFiles: '14d',
            level: 'error',
        }),
        new winston.transports.Console(),
    ],
});

export default logger;
