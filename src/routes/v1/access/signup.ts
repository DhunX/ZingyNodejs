import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { RoleRequest } from 'app-request';
import crypto from 'crypto';
import UserRepo from '../../../database/repository/UserRepo';
import { BadRequestError } from '../../../core/ApiError';
import User from '../../../database/model/User';
import { createTokens } from '../../../auth/authUtils';
import validator from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import { RoleCode } from '../../../database/model/Role';

const router = express.Router();

router.post(
  '/username',
  validator(schema.signupUsername),
  asyncHandler(async (req: RoleRequest, res) => {
    const user = await UserRepo.findByUserName(req.body.username);
    if (user) throw new BadRequestError('User already registered');

    if (!req.body.password) throw new BadRequestError('Password is required');
    if (!req.body.username) throw new BadRequestError('Username is required');
    if (!req.body.phoneNumber) throw new BadRequestError('Phone Number is required');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const { user: createdUser, keystore } = await UserRepo.create(
      {
        name: req.body.name,
        username: req.body.username,
        profilePicUrl: req.body.profilePicUrl,
        phoneNumber: req.body.phoneNumber,
        password: passwordHash,
      } as User,
      accessTokenKey,
      refreshTokenKey,
      RoleCode.LEARNER,
    );

    try {
      const tokens = await createTokens(createdUser, keystore.primaryKey, keystore.secondaryKey);
      new SuccessResponse('Signup Successful', {
        user: _.pick(createdUser, ['_id', 'name', 'email', 'roles', 'profilePicUrl']),
        tokens: tokens,
      }).send(res);
    } catch (error) {
      console.log('Error:', error);
    }
  }),
);

router.post(
  '/',
  validator(schema.signup),
  asyncHandler(async (req: RoleRequest, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (user) throw new BadRequestError('User already registered');

    if (!req.body.password) throw new BadRequestError('Password is required');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const { user: createdUser, keystore } = await UserRepo.create(
      {
        name: req.body.name,
        email: req.body.email,
        profilePicUrl: req.body.profilePicUrl,
        password: passwordHash,
      } as User,
      accessTokenKey,
      refreshTokenKey,
      RoleCode.LEARNER,
    );

    try {
      const tokens = await createTokens(createdUser, keystore.primaryKey, keystore.secondaryKey);
      new SuccessResponse('Signup Successful', {
        user: _.pick(createdUser, ['_id', 'name', 'email', 'roles', 'profilePicUrl']),
        tokens: tokens,
      }).send(res);
    } catch (error) {
      console.log('Error:', error);
    }
  }),
);

export default router;
