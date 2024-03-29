import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
  userId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  followProfile: Joi.object().keys({
    userId: Joi.string().required().min(1).max(200),
  }),
  profile: Joi.object().keys({
    name: Joi.string().optional().min(1).max(200),
    profilePicUrl: Joi.string().optional().uri(),
    phoneNumber: Joi.string().optional().length(10),
    email: Joi.string().optional().email(),
    bio: Joi.string().optional().min(0).max(500),
    username: Joi.string().optional().min(5).max(20),
    location: Joi.string().optional().min(2).max(40),
    dob: Joi.date().optional(),
    interests: Joi.array().optional().items(Joi.string().min(1).max(40)),
    genere: Joi.array().optional().items(Joi.string().min(1).max(40)),
    posts: Joi.array().optional().items(Joi.string().min(1).max(40)),
    tracks: Joi.array().optional().items(Joi.string().min(1).max(40)),
    followers: Joi.object().keys({
      count: Joi.number().min(0).default(0),
      users: Joi.array().items(Joi.string()),
    }),
    following: Joi.object().keys({
      count: Joi.number().min(0).default(0),
      users: Joi.array().items(Joi.string()),
    }),
    isCreator: Joi.boolean().optional(),
  }),
};
