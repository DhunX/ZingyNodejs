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

const formatEndpoint = (endpoint: string) => endpoint.replace(/\s/g, '').replace(/\//g, '-');

router.post(
  '/',
  validator(schema.postCreate),
  asyncHandler(async (req: ProtectedRequest, res) => {
    req.body.postUrl = formatEndpoint(req.body.postUrl);

    const post = await PostRepo.findUrlIfExists(req.body.postUrl);
    if (post) throw new BadRequestError('Post with this url already exists');

    const createdPost = await PostRepo.create({
      title: req.body.title,
      description: req.body.description,
      draftText: req.body.text,
      tags: req.body.tags,
      author: req.user,
      postUrl: req.body.postUrl,
      imgUrl: req.body.imgUrl,
      score: req.body.score,
      createdBy: req.user,
      updatedBy: req.user,
    } as Post);

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

    if (req.body.postUrl) {
      const endpoint = formatEndpoint(req.body.postUrl);
      const existingPost = await PostRepo.findUrlIfExists(endpoint);
      if (existingPost) throw new BadRequestError('Post URL already used');
      if (req.body.postUrl) post.postUrl = endpoint;
    }

    if (req.body.title) post.title = req.body.title;
    if (req.body.description) post.description = req.body.description;
    if (req.body.text) post.draftText = req.body.text;
    if (req.body.tags) post.tags = req.body.tags;
    if (req.body.imgUrl) post.imgUrl = req.body.imgUrl;
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
      post.draftText = post.text;
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
