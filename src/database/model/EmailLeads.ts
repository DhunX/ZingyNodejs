import { model, Schema, Document } from 'mongoose';

export const DOCUMENT_NAME = 'EmailLead';
export const COLLECTION_NAME = 'email_leads';

export default interface EmailLead extends Document {
  email: string;
  source: string;
}

const schema = new Schema(
  {
    email: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    source: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
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

export const EmailLeadModel = model<EmailLead>(DOCUMENT_NAME, schema, COLLECTION_NAME);
