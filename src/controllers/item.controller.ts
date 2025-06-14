import { Request, Response } from 'express';
import List from '../models/list.model';
import Item from '../models/item.model';
import { OK, CREATED, BAD_REQUEST, NOT_FOUND } from '../utils/http-status';

export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId } = req.params;
    const { title, description = '', completed = false } = req.body;

    if (!title) {
      res.status(BAD_REQUEST).json({
        success: false,
        error: 'Title is required',
      });
      return;
    }

    const list = await List.findById(listId);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    const item = await Item.create({ listId, title, description, completed });
    res.status(CREATED).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create item',
    });
  }
};

export const getListItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId } = req.params;
    const list = await List.findById(listId);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    const items = await Item.find({ listId }).sort({ createdAt: -1 });
    res.status(OK).json({
      success: true,
      data: items,
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch items',
    });
  }
};

export const getItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId, id } = req.params;
    const list = await List.findById(listId);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    const item = await Item.findOne({ _id: id, listId });
    if (!item) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'Item not found in this list',
      });
      return;
    }

    res.status(OK).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch item',
    });
  }
};

export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId, id } = req.params;
    const list = await List.findById(listId);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    const item = await Item.findOneAndUpdate(
      { _id: id, listId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!item) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'Item not found in this list',
      });
      return;
    }

    res.status(OK).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update item',
    });
  }
};

export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId, id } = req.params;
    const list = await List.findById(listId);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    const item = await Item.findOneAndDelete({ _id: id, listId });
    if (!item) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'Item not found in this list',
      });
      return;
    }

    res.status(OK).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete item',
    });
  }
}; 