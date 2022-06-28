import { model, Schema, Document } from 'mongoose';
import Post from './Post';
import Track from './Track';
import Role from './Role';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export default interface User extends Document {
  username?: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
  bio?: string;
  followers: { count: number; users: string[] };
  following: { count: number; users: string[] };
  tracks: Track[];
  posts: Post[];
  dob?: Date;
  password?: string;
  profilePicUrl?: string;
  roles: Role[];
  verified?: boolean;
  isCreator?: boolean;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  interests?: string[];
  genere?: string[];
}

const schema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    username: {
      type: Schema.Types.String,
      required: false,
      trim: true,
      maxlength: 20,
      unique: true,
    },
    location: {
      type: Schema.Types.String,
      required: false,
      trim: true,
      maxlength: 40,
    },
    email: {
      type: Schema.Types.String,
      required: false,
      unique: true,
      trim: true,
      select: false,
    },
    phoneNumber: {
      type: Schema.Types.String,
      required: false,
      unique: true,
      trim: true,
      select: false,
      length: 10,
    },
    dob: {
      type: Schema.Types.Date,
      required: false,
      unique: false,
    },
    password: {
      type: Schema.Types.String,
      select: false,
    },
    profilePicUrl: {
      type: Schema.Types.String,
      trim: true,
    },
    bio: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 500,
    },
    interests: {
      type: [{ type: Schema.Types.String, trim: true, maxlength: 40, required: false }],
    },
    genere: {
      type: [{ type: Schema.Types.String, trim: true, maxlength: 40, required: false }],
    },
    tracks: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Track', required: false }],
    },
    posts: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Post', required: false }],
    },
    followers: {
      type: {
        count: {
          type: Schema.Types.Number,
          default: 0,
          nullable: false,
        },
        users: [
          {
            type: Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
      },
    },
    following: {
      type: {
        count: {
          type: Schema.Types.Number,
          default: 0,
          nullable: false,
        },
        users: [
          {
            type: Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
      },
    },
    roles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Role',
        },
      ],
      required: true,
      select: false,
    },
    verified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    isCreator: {
      type: Schema.Types.Boolean,
      default: false,
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
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
);

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
