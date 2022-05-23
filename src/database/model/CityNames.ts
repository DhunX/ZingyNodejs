import { model, Schema, Document } from 'mongoose';

export const DOCUMENT_NAME = 'CityNames';
export const COLLECTION_NAME = 'city_names';

export default interface CityNames extends Document {
  city: string;
  city_enum: string;
  state: string;
  state_enum: string;
  enum: string;
  lat: string;
  lng: string;
}

const schema = new Schema(
  {
    city: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    city_enum: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    state: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    state_enum: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    enum: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    lat: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    lng: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
    },
  },
  {
    versionKey: false,
  },
);

export const CityNamesModel = model<CityNames>(DOCUMENT_NAME, schema, COLLECTION_NAME);
