import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
  userId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  profile: Joi.object().keys({
    name: Joi.string().optional().min(1).max(200),
    profilePicUrl: Joi.string().optional().uri(),
    bio: Joi.string().optional().min(0).max(500),
    username: Joi.string().optional().min(5).max(20),
    dob: Joi.date().optional(),
    followers: Joi.object().keys({
      count: Joi.number().min(0).default(0),
      list: Joi.array().items(Joi.string()),
    }),
    following: Joi.object().keys({
      count: Joi.number().min(0).default(0),
      users: Joi.array().items(Joi.string()),
    }),
    isCreator: Joi.boolean().optional(),
  }),
};
