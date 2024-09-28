import { join } from 'path';
import 'dotenv/config';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

// Create transports instance
let transports: any[] = [
  // transport logs to Console
  new winston.transports.Console({
    format: winston.format.combine(
      // Add a timestamp to the console logs
      winston.format.timestamp(),
      // Add colors to you logs
      winston.format.colorize(),
      // What the details you need as logs
      winston.format.printf(
        ({ timestamp, level, message, context, trace, options }) => {
          return `${timestamp} [${context}] ${level}: ${message}${trace ? `\n${trace}` : ''}${options ? `\n${options}` : ''}`;
        },
      ),
    ),
  }),
];

if (
  process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'stagging'
) {
  transports = transports.concat(
    new winston.transports.DailyRotateFile({
      filename: join(process.env.LOG_PATH, '%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      filename: join(process.env.LOG_PATH, 'error.log'),
      level: 'error',
    }),
  );
}

// Create and export the logger instance
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports,
});
