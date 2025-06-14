import { ListsCollection } from '../models/list.model';
import { ItemsCollection } from '../models/item.model';
import { AppError } from '../utils/error';
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND } from '../utils/http-status';

const createList = async (data: {
  title: string;
  description?: string;
  userId: string;
}) => {
  if (!data.title) {
    throw new AppError('Title is required', BAD_REQUEST);
  }

  return ListsCollection.create(data);
}

const getLists = async (userId: string) => {
  return ListsCollection.find({ userId }).sort({ id: "asc" });
}

const getList = async (id: string, userId: string) => {
  const list = await ListsCollection.findOne({ id: id, userId });
  if (!list) {
    throw new AppError('List not found', NOT_FOUND);
  }

  const items = await ItemsCollection.find({ listId: list.id }).sort({ id: "asc" });
  return {
    ...list.toObject(),
    items,
  };
}

const updateList = async (id: string, data: Partial<{ title: string; description: string }>, userId: string) => {
  const list = await ListsCollection.findOne({ id: id });
  
  if (!list) {
    throw new AppError('List not found', NOT_FOUND);
  }

  if (list.userId !== userId) {
    throw new AppError('You are not authorized to update this list', FORBIDDEN);
  }

  const updatedList = await ListsCollection.findOneAndUpdate(
    { id: id, userId },
    { $set: data },
    { new: true, runValidators: true }
  );

  return updatedList;
};

const deleteList = async (id: string, userId: string) => {
  const list = await ListsCollection.findOne({ id: id });
  
  if (!list) {
    throw new AppError('List not found', NOT_FOUND);
  }

  if (list.userId !== userId) {
    throw new AppError('You are not authorized to delete this list', FORBIDDEN);
  }

  await ListsCollection.findOneAndDelete({ id: id });
  // Delete all items in the list
  await ItemsCollection.deleteMany({ listId: id });
};

export {
  createList,
  getLists,
  getList,
  updateList,
  deleteList,
};
