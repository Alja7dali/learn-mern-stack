import { Request, Response } from 'express';
import List from '../models/list.model';
import Item from '../models/item.model';
import { OK, CREATED, BAD_REQUEST, NOT_FOUND } from '../utils/http-status';

export const createList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description = '' } = req.body;

    if (!title) {
      res.status(BAD_REQUEST).json({
        success: false,
        error: 'Title is required',
      });
      return;
    }

    const list = await List.create({ title, description });
    res.status(CREATED).json({
      success: true,
      data: list,
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create list',
    });
  }
};

export const getLists = async (_req: Request, res: Response): Promise<void> => {
  try {
    const lists = await List.find().sort({ createdAt: -1 });
    res.status(OK).json({
      success: true,
      data: lists,
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch lists',
    });
  }
};

export const getList = async (req: Request, res: Response): Promise<void> => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    const items = await Item.find({ listId: list._id }).sort({ createdAt: -1 });
    res.status(OK).json({
      success: true,
      data: {
        ...list.toObject(),
        items,
      },
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch list',
    });
  }
};

export const updateList = async (req: Request, res: Response): Promise<void> => {
  try {
    const list = await List.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    res.status(OK).json({
      success: true,
      data: list,
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update list',
    });
  }
};

export const deleteList = async (req: Request, res: Response): Promise<void> => {
  try {
    const list = await List.findByIdAndDelete(req.params.id);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    // Delete all items in the list
    await Item.deleteMany({ listId: list._id });

    res.status(OK).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete list',
    });
  }
}; 