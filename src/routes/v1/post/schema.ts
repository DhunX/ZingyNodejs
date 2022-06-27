import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
  postId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  postTag: Joi.object().keys({
    tag: Joi.string().required(),
  }),
  pagination: Joi.object().keys({
    pageNumber: Joi.number().required().integer().min(1),
    pageItemCount: Joi.number().required().integer().min(1),
  }),
  authorId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  postCreate: Joi.object().keys({
    description: Joi.string().optional().min(3).max(2000),

    // job post specific fields
    genre: Joi.string().optional().min(3).max(50),
    location: Joi.string().optional().min(3).max(50),
    skill: Joi.string().optional().min(3).max(50),
    duration: Joi.string().optional().min(3).max(50),

    imgUrl: Joi.string().optional().uri().max(200),
    vdoUrl: Joi.string().optional().uri().max(200),
    audioUrl: Joi.string().optional().uri().max(200),
    score: Joi.number().optional().min(0).max(1),
    tags: Joi.array().optional().min(0).items(Joi.string().uppercase()),
    type: Joi.string().required().min(1).uppercase(),
  }),
  postUpdate: Joi.object().keys({
    description: Joi.string().optional().min(3).max(2000),
    imgUrl: Joi.string().optional().uri().max(200),
    audioUrl: Joi.string().optional().uri().max(200),
    vdoUrl: Joi.string().optional().uri().max(200),
    postUrl: Joi.string().optional().max(200),
    score: Joi.number().optional().min(0).max(1),
    tags: Joi.array().optional().min(1).items(Joi.string().uppercase()),
  }),
  postType: Joi.object().keys({
    id: Joi.number().required(),
    name: Joi.string().required().min(3).max(50),
  }),
};
