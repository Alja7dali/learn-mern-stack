import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import logger from './utils/logger';
import { dev, port } from './utils/helpers';

// Load environment variables
dotenv.config();

const app: Express = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error route hit');
  res.status(500).json({
    message: 'Something went wrong!',
    error: dev ? err.message : undefined
  });
});

// Basic route
app.get('/', (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: 'Hello, World!' });
});

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
