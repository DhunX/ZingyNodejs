import express from 'express';
import { SuccessResponse, SuccessMsgResponse } from '../../../core/ApiResponse';
import { ProtectedRequest } from 'app-request';
import { BadRequestError, ForbiddenError } from '../../../core/ApiError';
import PostRepo from '../../../database/repository/PostRepo';
import Post from '../../../database/model/Post';
import { RoleCode } from '../../../database/model/Role';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import authentication from '../../../auth/authentication';
import authorization from '../../../auth/authorization';
import role from '../../../helpers/role';

const router = express.Router();

/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for writer's role
router.use('/', authentication, role(RoleCode.WRITER), authorization);
/*-------------------------------------------------------------------------*/

router.post(
  '/',
  validator(schema.postCreate),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const url = new Date().toString() + Math.random().toString() + req.user.username;

    const createdPost = await PostRepo.create({
      description: req.body?.description,

      // job post specific fields
      genre: req.body?.genre,
      location: req.body?.location,
      skill: req.body?.skill,
      duration: req.body?.duration,

      // event post specific fields
      date: req.body?.date,
      eventName: req.body?.eventName,

      tags: req.body?.tags,
      author: req.user,
      imgUrl: req.body?.imgUrl,
      audioUrl: req.body?.audioUrl,
      vdoUrl: req.body?.vdoUrl,
      score: req.body?.score,
      createdBy: req.user,
      updatedBy: req.user,
      type: req.body.type,
      comments: [],
      postUrl: url,
    } as unknown as Post);

    new SuccessResponse('Post created successfully', createdPost).send(res);
  }),
);

router.put(
  '/id/:id',
  validator(schema.postId, ValidationSource.PARAM),
  validator(schema.postUpdate),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const post = await PostRepo.findPostAllDataById(new Types.ObjectId(req.params.id));
    if (post == null) throw new BadRequestError('Post does not exists');
    if (!post.author._id.equals(req.user._id))
      throw new ForbiddenError("You don't have necessary permissions");

    if (req.body.description) post.description = req.body.description;
    if (req.body.tags) post.tags = req.body.tags;
    if (req.body.imgUrl) post.imgUrl = req.body.imgUrl;
    if (req.body.audioUrl) post.audioUrl = req.body.audioUrl;
    if (req.body.vdoUrl) post.vdoUrl = req.body.vdoUrl;
    if (req.body.score) post.score = req.body.score;

    await PostRepo.update(post);
    new SuccessResponse('Post updated successfully', post).send(res);
  }),
);

router.put(
  '/submit/:id',
  validator(schema.postId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const post = await PostRepo.findPostAllDataById(new Types.ObjectId(req.params.id));
    if (!post) throw new BadRequestError('Post does not exists');
    if (!post.author._id.equals(req.user._id))
      throw new ForbiddenError("You don't have necessary permissions");

    post.isSubmitted = true;
    post.isDraft = false;

    await PostRepo.update(post);
    return new SuccessMsgResponse('Post submitted successfully').send(res);
  }),
);

router.put(
  '/withdraw/:id',
  validator(schema.postId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const post = await PostRepo.findPostAllDataById(new Types.ObjectId(req.params.id));
    if (!post) throw new BadRequestError('Post does not exists');
    if (!post.author._id.equals(req.user._id))
      throw new ForbiddenError("You don't have necessary permissions");

    post.isSubmitted = false;
    post.isDraft = true;

    await PostRepo.update(post);
    return new SuccessMsgResponse('Post withdrawn successfully').send(res);
  }),
);

router.delete(
  '/id/:id',
  validator(schema.postId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const post = await PostRepo.findPostAllDataById(new Types.ObjectId(req.params.id));
    if (!post) throw new BadRequestError('Post does not exists');
    if (!post.author._id.equals(req.user._id))
      throw new ForbiddenError("You don't have necessary permissions");

    if (post.isPublished) {
      post.isDraft = false;
      // revert to the original state
    } else {
      post.status = false;
    }

    await PostRepo.update(post);
    return new SuccessMsgResponse('Post deleted successfully').send(res);
  }),
);

router.get(
  '/submitted/all',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const posts = await PostRepo.findAllSubmissionsForWriter(req.user);
    return new SuccessResponse('success', posts).send(res);
  }),
);

router.get(
  '/published/all',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const posts = await PostRepo.findAllPublishedForWriter(req.user);
    return new SuccessResponse('success', posts).send(res);
  }),
);

router.get(
  '/drafts/all',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const posts = await PostRepo.findAllDraftsForWriter(req.user);
    return new SuccessResponse('success', posts).send(res);
  }),
);

router.get(
  '/id/:id',
  validator(schema.postId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const post = await PostRepo.findPostAllDataById(new Types.ObjectId(req.params.id));
    if (!post) throw new BadRequestError('Post does not exists');
    if (!post.author._id.equals(req.user._id))
      throw new ForbiddenError("You don't have necessary permissions");
    new SuccessResponse('success', post).send(res);
  }),
);

export default router;
