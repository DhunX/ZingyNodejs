import { Schema, model, Document } from 'mongoose';

export const DOCUMENT_NAME = 'Comment';
export const COLLECTION_NAME = 'comments';

export default interface Comment extends Document {
  content: string;
  author: [username: string, id: string];
}

const schema = new Schema(
  {
    content: {
      type: Schema.Types.String,
      required: true,
      select: false,
    },
    author: {
      username: Schema.Types.String,
      id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  },
  {
    versionKey: false,
  },
);

export const CommentModel = model<Comment>(DOCUMENT_NAME, schema, COLLECTION_NAME);
