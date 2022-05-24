import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import UserRepo from '../../../database/repository/UserRepo';
import { ProtectedRequest } from 'app-request';
import { BadRequestError } from '../../../core/ApiError';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import _ from 'lodash';
import authentication from '../../../auth/authentication';

const router = express.Router();

router.get(
  '/public/id/:id',
  validator(schema.userId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findPublicProfileById(new Types.ObjectId(req.params.id));
    if (!user) throw new BadRequestError('User not registered');
    return new SuccessResponse('success', _.omit(user, 'password')).send(res);
  }),
);
router.get(
  '/public/username/:username',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findByUserName(req.params.username);
    if (!user) throw new BadRequestError('User not registered');
    return new SuccessResponse('success', _.omit(user, 'password')).send(res);
  }),
);

/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for Access Token
router.use('/', authentication);
/*-------------------------------------------------------------------------*/

router.get(
  '/my',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');
    return new SuccessResponse('success', user).send(res);
  }),
);

router.put(
  '/',
  validator(schema.profile),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');

    if (req.body.name) user.name = req.body.name;
    if (req.body.profilePicUrl) user.profilePicUrl = req.body.profilePicUrl;
    if (req.body.bio) user.bio = req.body.bio;
    if (req.body.username) user.username = req.body.username;
    if (req.body.genere) user.genere = req.body.genere;
    if (req.body.interests) user.interests = req.body.interests;
    if (req.body.location) user.location = req.body.location;
    if (req.body.followers) user.followers = req.body.followers;
    if (req.body.following) user.following = req.body.following;
    if (req.body.tracks) user.tracks = req.body.tracks;
    if (req.body.posts) user.posts = req.body.posts;

    if (req.body.username) {
      const temp = await UserRepo.findByUserName(req.body.username);
      if (temp) {
        console.log('username already exists');
        throw new BadRequestError('Username already taken');
      }
    }

    if (req.body.isCreator) user.isCreator = req.body.isCreator;
    if (req.body.dob) user.dob = req.body.dob;
    if (req.body.profilePicUrl) user.profilePicUrl = req.body.profilePicUrl;

    await UserRepo.updateInfo(user);
    return new SuccessResponse(
      'Profile updated',
      _.pick(user, ['name', 'profilePicUrl', 'roles']),
    ).send(res);
  }),
);

export default router;
