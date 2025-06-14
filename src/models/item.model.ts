import mongoose, { Document, Schema } from 'mongoose';
import { generateId } from '../utils/generate-id';

export interface ItemDocument extends Document {
  listId: string;
  title: string;
  description: string;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<ItemDocument>(
  {
    id: {
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
    id: false,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        return {
          id: ret.id,
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
          id: ret.id,
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

itemSchema.virtual('completed').get(function (this: ItemDocument) {
  return this.completedAt !== null;
}).set(function (this: ItemDocument, value: boolean) {
  this.completedAt = value ? new Date() : null;
});

export const ItemsCollection = mongoose.model<ItemDocument>('Items', itemSchema);
