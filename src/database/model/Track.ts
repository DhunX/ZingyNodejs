import { Schema, model, Document } from 'mongoose';
import User from './User';

export const DOCUMENT_NAME = 'Track';
export const COLLECTION_NAME = 'tracks';

export default interface Track extends Document {
  title: string;
  description: string;
  tags: string[];
  author: User;
  imgUrl?: string;
  trackUrl: string;
  likes?: number;
  score: number;
  isSubmitted: boolean;
  isDraft: boolean;
  isPublished: boolean;
  status?: boolean;
  publishedAt?: Date;
  createdBy?: User;
  updatedBy?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
      maxlength: 2000,
      trim: true,
    },
    tags: [
      {
        type: Schema.Types.String,
        trim: true,
        uppercase: true,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    imgUrl: {
      type: Schema.Types.String,
      required: false,
      maxlength: 500,
      trim: true,
    },
    trackUrl: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      maxlength: 200,
      trim: true,
    },
    likes: {
      type: Schema.Types.Number,
      default: 0,
    },
    score: {
      type: Schema.Types.Number,
      default: 0.01,
      max: 1,
      min: 0,
    },
    isSubmitted: {
      type: Schema.Types.Boolean,
      default: false,
      select: false,
      index: true,
    },
    isDraft: {
      type: Schema.Types.Boolean,
      default: true,
      select: false,
      index: true,
    },
    isPublished: {
      type: Schema.Types.Boolean,
      default: false,
      select: false,
      index: true,
    },
    publishedAt: {
      type: Schema.Types.Date,
      required: false,
      index: true,
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
      select: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
      index: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    createdAt: {
      type: Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Date,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
).index(
  { title: 'text', description: 'text' },
  { weights: { title: 3, description: 1 }, background: false },
);

export const TrackModel = model<Track>(DOCUMENT_NAME, schema, COLLECTION_NAME);
