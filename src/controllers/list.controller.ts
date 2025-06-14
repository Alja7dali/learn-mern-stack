import { Request, Response, NextFunction } from 'express';
import * as ListService from '../services/list.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { CREATED, OK } from '../utils/http-status';

const createList = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description = '' } = req.body;
    const list = await ListService.createList({ 
      title, 
      description,
      userId: req.user.id 
    });

    res.status(CREATED).json({
      status: 'success',
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

const getLists = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const lists = await ListService.getLists(req.user.id);

    res.status(OK).json({
      status: 'success',
      data: lists,
    });
  } catch (error) {
    next(error);
  }
};

const getList = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const list = await ListService.getList(req.params.id, req.user.id);

    res.status(OK).json({
      status: 'success',
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

const updateList = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const list = await ListService.updateList(req.params.id, req.body, req.user.id);

    res.status(OK).json({
      status: 'success',
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

const deleteList = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await ListService.deleteList(req.params.id, req.user.id);

    res.status(OK).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createList,
  getLists,
  getList,
  updateList,
  deleteList
};
