import { model, Schema, Document } from 'mongoose';
import Role from './Role';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export default interface User extends Document {
  name: string;
  email?: string;
  password?: string;
  contact?:number;
  dateOfBirth?:Date;
  profilePicUrl?: string;
  roles: Role[];
  verified?: boolean;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    dateOfBirth: {
      type: Date,
      trim: true
  },
    contact:{
       type:Schema.Types.Number
  },
    
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      trim: true,
      select: false,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
      type: Schema.Types.String,
      select: false,
    },
    bio: {
        type: Schema.Types.String
    },
    profilePicUrl: {
      type: Schema.Types.String,
      trim: true,
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
    status: {
      type: Schema.Types.Boolean,
      default: true,
    },

    facebook: {
      id: Schema.Types.String,
      token: Schema.Types.String,
      email: Schema.Types.String,
      name: Schema.Types.String
  },
  google: {
      id: Schema.Types.String,
      token: Schema.Types.String,
      email: Schema.Types.String,
  },

  spotify: {
    id: Schema.Types.String,
    token: Schema.Types.String,
    email: Schema.Types.String,
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
