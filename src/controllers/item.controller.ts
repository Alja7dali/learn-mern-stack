import { Request, Response, NextFunction } from 'express';
import * as ItemService from '../services/item.service';

const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { listId } = req.params;
    const { title, description = '', completed = false } = req.body;

    const item = await ItemService.createItem(listId, {
      title,
      description,
      completed,
    });

    res.status(201).json({
      status: 'success',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

const getListItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { listId } = req.params;
    const items = await ItemService.getListItems(listId);

    res.status(200).json({
      status: 'success',
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

const getItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { listId, id } = req.params;
    const item = await ItemService.getItem(listId, id);

    res.status(200).json({
      status: 'success',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { listId, id } = req.params;
    const item = await ItemService.updateItem(listId, id, req.body);

    res.status(200).json({
      status: 'success',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { listId, id } = req.params;
    await ItemService.deleteItem(listId, id);

    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
}

export {
  createItem,
  getListItems,
  getItem,
  updateItem,
  deleteItem
};