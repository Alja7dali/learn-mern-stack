import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import logger from './utils/logger';
import { dev, port } from './utils/helpers';
import listRoutes from './routes/list.routes';
import itemRoutes from './routes/item.routes';
import { OK, INTERNAL_SERVER_ERROR } from './utils/http-status';

// Load environment variables
dotenv.config();

const app: Express = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('tiny', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/lists', listRoutes);
// 1) after doning any CRUD operation to lists with this route
// 2) go to routes folder and check the specifed ROUTE with the specified METHOD.
// 3) use the right function from the controller ( createList, getLists, getList, updateList, deleteList) for the request.
// 4) the controller will handle the request and update the fake DB using the right listStore.( create,findAll, findById, update, delete: deleteList).

app.use('/api/lists/:listId/items', itemRoutes);
// This handles the requests items implimenting similar steps to the lists

// Basic route
app.get('/', (req: Request, res: Response) => {
  res
    .status(OK)
    .json({ message: 'List & Items API - Welcome!' });
});

// Basic error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error:', err.message);
  res
    .status(INTERNAL_SERVER_ERROR)
    .json({
      success: false,
      message: 'Something went wrong!',
      error: dev ? err.message : undefined
    });
});

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
