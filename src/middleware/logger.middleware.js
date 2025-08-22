// Import required modules
import winston from "winston";

// Define custom log format
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

// Configure Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    customFormat
  ),
  transports: [
    new winston.transports.File({ filename: "logs.txt" })
  ],
});

// Logger middleware for incoming requests
const loggerMiddleware = async (req, res, next) => {
  const excludedRoutes = ["/signin", "/signup"];
  const shouldLog = !excludedRoutes.some((route) => req.url.includes(route));

  if (shouldLog) {
    const logMessage = `${req.method} ${req.originalUrl} ${req.body ? JSON.stringify(req.body): "Request Body Is Empty"}`;
    logger.info(logMessage);
  }

  next();
};

export default loggerMiddleware;
