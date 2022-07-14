import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { NoDataError, BadRequestError } from '../../../core/ApiError';
import PostRepo from '../../../database/repository/PostRepo';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import User, { UserModel } from '../../../database/model/User';

const router = express.Router();

router.get(
  '/tag/:tag',
  validator(schema.postTag, ValidationSource.PARAM),
  validator(schema.pagination, ValidationSource.QUERY),
  asyncHandler(async (req, res) => {
    const posts = await PostRepo.findByTagAndPaginated(
      req.params.tag,
      parseInt(req.query.pageNumber as string),
      parseInt(req.query.pageItemCount as string),
    );

    if (!posts || posts.length < 1) throw new NoDataError();

    return new SuccessResponse('success', posts).send(res);
  }),
);

router.get(
  '/author/id/:id',
  validator(schema.authorId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const posts = await PostRepo.findAllPublishedForAuthor({
      _id: new Types.ObjectId(req.params.id),
    } as User);

    if (!posts || posts.length < 1) throw new NoDataError();

    return new SuccessResponse('success', posts).send(res);
  }),
);

router.get(
  '/latest',
  validator(schema.pagination, ValidationSource.QUERY),
  asyncHandler(async (req, res) => {
    const posts = await PostRepo.findLatestPosts(
      parseInt(req.query.pageNumber as string),
      parseInt(req.query.pageItemCount as string),
    );

    if (!posts || posts.length < 1) throw new NoDataError();

    return new SuccessResponse('success', posts).send(res);
  }),
);

router.get(
  '/similar/id/:id',
  validator(schema.postId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const post = await PostRepo.findPostAllDataById(new Types.ObjectId(req.params.id));
    if (!post || !post.isPublished) throw new BadRequestError('Post is not available');

    const posts = await PostRepo.searchSimilarPosts(post, 6);
    if (!posts || posts.length < 1) throw new NoDataError();

    return new SuccessResponse('success', posts).send(res);
  }),
);

router.post(
  '/comment/id/:id',
  validator(schema.postId, ValidationSource.PARAM),
  validator(schema.comment),
  asyncHandler(async (req, res) => {
    const post = await PostRepo.findPostAllDataById(new Types.ObjectId(req.params.id));
    if (!post || !post.isPublished) throw new BadRequestError('Post is not available');

    const user = await UserModel.findOne({ _id: new Types.ObjectId(req.body.userId) });
    if (!user) throw new BadRequestError('User is not available');

    const comment = await PostRepo.addComment(user._id, post._id, req.body);
    if (!comment) throw new BadRequestError('Comment could not be added');

    return new SuccessResponse('success', comment).send(res);
  }),
);

export default router;
