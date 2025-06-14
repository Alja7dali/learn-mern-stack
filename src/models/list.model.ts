import mongoose, { Document, Schema } from 'mongoose';
import { generateId } from '../utils/generate-id';

export interface ListDocument extends Document {
  userId: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const listSchema = new Schema<ListDocument>(
  {
    id: {
      type: String,
      default: () => `list_${generateId()}`,
    },
    userId: {
      type: String,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
    id: false,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        return {
          id: ret.id,
          userId: ret.userId,
          title: ret.title,
          description: ret.description,
          createdAt: ret.createdAt,
          updatedAt: ret.updatedAt,
        };
      },
    },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        return {
          id: ret.id,
          userId: ret.userId,
          title: ret.title,
          description: ret.description,
          createdAt: ret.createdAt,
          updatedAt: ret.updatedAt,
        };
      },
    },
  }
);

export const ListsCollection = mongoose.model<ListDocument>('Lists', listSchema);
