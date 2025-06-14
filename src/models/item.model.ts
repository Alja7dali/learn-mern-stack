import mongoose, { Document, Schema } from 'mongoose';
import { generateId } from '../utils/generate-id';

export interface Item extends Document {
  listId: string;
  title: string;
  description: string;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<Item>(
  {
    _id: {
      type: String,
      default: () => `item_${generateId()}`,
    },
    listId: {
      type: String,
      ref: 'List',
      required: [true, 'List ID is required'],
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
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    _id: false,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        return {
          id: ret._id,
          listId: ret.listId,
          title: ret.title,
          description: ret.description,
          completedAt: ret.completedAt,
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
          id: ret._id,
          listId: ret.listId,
          title: ret.title,
          description: ret.description,
          completedAt: ret.completedAt,
          createdAt: ret.createdAt,
          updatedAt: ret.updatedAt,
        };
      },
    },
  }
);

itemSchema.virtual('completed').get(function (this: Item) {
  return this.completedAt !== null;
}).set(function (this: Item, value: boolean) {
  this.completedAt = value ? new Date() : null;
});

export default mongoose.model<Item>('Item', itemSchema);
