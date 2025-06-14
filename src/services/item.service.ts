import { ListsCollection } from '../models/list.model';
import { ItemsCollection } from '../models/item.model';
import { AppError } from '../utils/error';
import { BAD_REQUEST, NOT_FOUND } from '../utils/http-status';

const createItem = async (listId: string, data: {
  title: string;
  description?: string;
  completed?: boolean;
}) => {
  if (!data.title) {
    throw new AppError('Title is required', BAD_REQUEST);
  }

  const list = await ListsCollection.findOne({ id: listId });
  if (!list) {
    throw new AppError('List not found', NOT_FOUND);
  }

  return ItemsCollection.create({ ...data, listId });
}

const getListItems = async (listId: string) => {
  const list = await ListsCollection.findOne({ id: listId });
  if (!list) {
    throw new AppError('List not found', NOT_FOUND);
  }

  return ItemsCollection.find({ listId }).sort({ id: "asc" });
}

const getItem = async (listId: string, itemId: string) => {
  const list = await ListsCollection.findOne({ id: listId });
  if (!list) {
    throw new AppError('List not found', NOT_FOUND);
  }

  const item = await ItemsCollection.findOne({ id: itemId, listId });
  if (!item) {
    throw new AppError('Item not found in this list', NOT_FOUND);
  }

  return item;
}

const updateItem = async (
  listId: string,
  itemId: string,
  data: Partial<{ title: string; description: string; completed: boolean }>
) => {
  const list = await ListsCollection.findOne({ id: listId });
  if (!list) {
    throw new AppError('List not found', NOT_FOUND);
  }

  const item = await ItemsCollection.findOneAndUpdate(
    { id: itemId, listId },
    { $set: data },
    { new: true, runValidators: true }
  );

  if (!item) {
    throw new AppError('Item not found in this list', NOT_FOUND);
  }

  return item;
}

const deleteItem = async (listId: string, itemId: string) => {
  const list = await ListsCollection.findOne({ id: listId });
  if (!list) {
    throw new AppError('List not found', NOT_FOUND);
  }

  const item = await ItemsCollection.findOneAndDelete({ id: itemId, listId });
  if (!item) {
    throw new AppError('Item not found in this list', NOT_FOUND);
  }
};

export {
  createItem,
  getListItems,
  getItem,
  updateItem,
  deleteItem,
};