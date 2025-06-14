import mongoose, { Document, Schema } from 'mongoose';
import { generateId } from '../utils/generate-id';

export interface List extends Document {
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const listSchema = new Schema<List>(
  {
    _id: {
      type: String,
      default: () => `list_${generateId()}`,
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
    _id: false,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        return {
          id: ret._id,
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
          id: ret._id,
          title: ret.title,
          description: ret.description,
          createdAt: ret.createdAt,
          updatedAt: ret.updatedAt,
        };
      },
    },
  }
);

export default mongoose.model<List>('List', listSchema);
