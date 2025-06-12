// logger.js
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize } = format;

const formatter = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    formatter
  ),
  transports: [
    new transports.Console({ format: combine(colorize(), formatter) }),
    new transports.File({ filename: 'logs/app.log' })
  ]
});

export default logger;
