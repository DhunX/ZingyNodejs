import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError } from '../../../core/ApiError';
import PostRepo from '../../../database/repository/PostRepo';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';

const router = express.Router();

router.get(
  '/url',
  validator(schema.postUrl, ValidationSource.QUERY),
  asyncHandler(async (req, res) => {
    const post = await PostRepo.findByUrl(req.query.endpoint as string);
    if (!post) throw new BadRequestError('Post do not exists');
    new SuccessResponse('success', post).send(res);
  }),
);

router.get(
  '/id/:id',
  validator(schema.postId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const post = await PostRepo.findInfoWithTextById(new Types.ObjectId(req.params.id));
    if (!post) throw new BadRequestError('Post do not exists');
    return new SuccessResponse('success', post).send(res);
  }),
);

export default router;
