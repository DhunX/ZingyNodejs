import { Schema, model, Document } from 'mongoose';

export const DOCUMENT_NAME = 'Like';
export const COLLECTION_NAME = 'like';

export default interface Like extends Document {
  post: [id: string];
  user: [username: string, id: string];
}

const schema = new Schema(
  {
    post: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    },
    user: {
      username: Schema.Types.String,
      id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const LikeModel = model<Like>(DOCUMENT_NAME, schema, COLLECTION_NAME);
