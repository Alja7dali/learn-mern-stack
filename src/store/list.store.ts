import { List } from "../models/list.model";
import { generateId } from "../utils/generate-id";

// This plays the role of a database for this app
const lists: Map<string, List> = new Map();

// the following are functions for lists CRUD operations 

const create = (data: Omit<List, 'id' | 'createdAt' | 'updatedAt'>): List => {
  const id = generateId();
  const now = new Date();
  const list: List = {
    id,
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  console.log(`Creating a new list wiith title: ${data.title}`)
  lists.set(id, list);
  return list;
}

const findAll = (): List[] => {
  console.log(`getting all lists`)
  return Array.from(lists.values());
}

const findById = (id: string): List | undefined => {
  return lists.get(id);
}

const update = (id: string, data: Partial<Omit<List, 'id' | 'createdAt'>>): List | undefined => {
  const list = lists.get(id);
  if (!list) return undefined;

  const updatedList: List = {
    ...list,
    ...data,
    updatedAt: new Date(),
  };
  console.log(`Updating list wiith id: ${list.id}`)
  lists.set(id, updatedList);
  return updatedList;
}

const deleteList = (id: string): boolean => {
  console.log(`Deleting list with id: ${id}`)
  return lists.delete(id);
  
}

export const listStore = {
  create,
  findAll,
  findById,
  update,
  delete: deleteList,
};