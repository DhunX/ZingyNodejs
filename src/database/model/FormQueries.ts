import { model, Schema, Document } from 'mongoose';

export const DOCUMENT_NAME = 'FormQuery';
export const COLLECTION_NAME = 'form_queries';

export default interface FormQuery extends Document {
  email: string;
  subject?: string;
  text: string;
}

const schema = new Schema(
  {
    email: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    subject: {
      type: Schema.Types.String,
      required: false,
      trim: true,
      maxlength: 100,
    },
    text: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    createdAt: {
      type: Schema.Types.Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

export const FormQueryModel = model<FormQuery>(DOCUMENT_NAME, schema, COLLECTION_NAME);
