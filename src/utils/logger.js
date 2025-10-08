import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Define log format
const logFormat = winston.format.printf(({ timestamp, level, message, transactionId }) => {
    return `${timestamp} [${transactionId || 'N/A'}] ${level.toUpperCase()}: ${message}`;
});

const transports = [
    new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
];

// Only use file logging in non-production (local/dev)
if (process.env.NODE_ENV !== 'production') {
    transports.push(
        new DailyRotateFile({
            filename: path.join('logs', 'app-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '10m',
            maxFiles: '14d',
            level: 'info',
        }),
    );
    transports.push(
        new DailyRotateFile({
            filename: path.join('logs', 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '10m',
            maxFiles: '14d',
            level: 'error',
        }),
    );
}

// Create the logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat,
    ),
    transports,
});

export default logger;
