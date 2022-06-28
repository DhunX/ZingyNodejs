import { Schema, model, Document } from 'mongoose';
import { POST_TYPES } from '../../constants';
import User from './User';
import Comment from './Comment';

export const DOCUMENT_NAME = 'Post';
export const COLLECTION_NAME = 'posts';

export default interface Post extends Document {
  description: string;

  // job posting specific fields
  genre: string;
  location: string;
  skill: string;
  duration: string;

  //event posting specific fields
  date: string;
  eventName: string;

  tags: string[];
  author: User;
  imgUrl?: string;
  postUrl: string;
  audioUrl?: string;
  vdoUrl?: string;
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
  type: string;
  comments?: Comment[];
}

const schema = new Schema(
  {
    description: {
      type: Schema.Types.String,
      required: true,
      maxlength: 2000,
      trim: true,
    },
    genre: {
      type: Schema.Types.String,
      required: false,
      maxlength: 20,
    },
    location: {
      type: Schema.Types.String,
      required: false,
      maxlength: 20,
    },
    eventName: {
      type: Schema.Types.String,
      required: false,
      maxlength: 20,
    },
    date: {
      type: Schema.Types.String,
      required: false,
      maxlength: 20,
    },
    skill: {
      type: Schema.Types.String,
      required: false,
      maxlength: 20,
    },
    duration: {
      type: Schema.Types.String,
      required: false,
      maxlength: 20,
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
    postUrl: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      maxlength: 200,
      trim: true,
    },
    imgUrl: {
      type: Schema.Types.String,
      required: false,
      maxlength: 500,
      trim: true,
    },
    audioUrl: {
      type: Schema.Types.String,
      required: false,
      maxlength: 500,
      trim: true,
    },
    vdoUrl: {
      type: Schema.Types.String,
      required: false,
      maxlength: 500,
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
    },
    updatedAt: {
      type: Date,
      required: true,
    },
    type: {
      type: Schema.Types.String,
      required: true,
      enum: [
        POST_TYPES.AUDIO_POST,
        POST_TYPES.VIDEO_POST,
        POST_TYPES.IMAGE_POST,
        POST_TYPES.TEXT_POST,
        POST_TYPES.JOB_POST,
        POST_TYPES.HIRE_ME_POST,
        POST_TYPES.COLLAB_POST,
        POST_TYPES.EVENT_POST,
      ],
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    versionKey: false,
  },
);

export const PostModel = model<Post>(DOCUMENT_NAME, schema, COLLECTION_NAME);
