import express from 'express';
import { SuccessResponse, SuccessMsgResponse } from '../../../core/ApiResponse';
import { ProtectedRequest } from 'app-request';
import { BadRequestError, ForbiddenError } from '../../../core/ApiError';
import PostRepo from '../../../database/repository/PostRepo';
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
// Below all APIs are private APIs protected for Access Token and Editor's Role
router.use('/', authentication, role(RoleCode.EDITOR), authorization);
/*-------------------------------------------------------------------------*/

router.put(
  '/publish/:id',
  validator(schema.postId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const post = await PostRepo.findPostAllDataById(new Types.ObjectId(req.params.id));
    if (!post) throw new BadRequestError('Post does not exists');

    post.isDraft = false;
    post.isSubmitted = false;
    post.isPublished = true;
    post.text = post.draftText;
    if (!post.publishedAt) post.publishedAt = new Date();

    await PostRepo.update(post);
    return new SuccessMsgResponse('Post published successfully').send(res);
  }),
);

router.put(
  '/unpublish/:id',
  validator(schema.postId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const post = await PostRepo.findPostAllDataById(new Types.ObjectId(req.params.id));
    if (!post) throw new BadRequestError('Post does not exists');

    post.isDraft = true;
    post.isSubmitted = false;
    post.isPublished = false;

    await PostRepo.update(post);
    return new SuccessMsgResponse('Post unpublished successfully').send(res);
  }),
);

router.delete(
  '/id/:id',
  validator(schema.postId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const post = await PostRepo.findPostAllDataById(new Types.ObjectId(req.params.id));
    if (!post) throw new BadRequestError('Post does not exists');

    post.status = false;

    await PostRepo.update(post);
    return new SuccessMsgResponse('Post deleted successfully').send(res);
  }),
);

router.get(
  '/published/all',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const posts = await PostRepo.findAllPublished();
    return new SuccessResponse('success', posts).send(res);
  }),
);

router.get(
  '/submitted/all',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const posts = await PostRepo.findAllSubmissions();
    return new SuccessResponse('success', posts).send(res);
  }),
);

router.get(
  '/drafts/all',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const posts = await PostRepo.findAllDrafts();
    return new SuccessResponse('success', posts).send(res);
  }),
);

router.get(
  '/id/:id',
  validator(schema.postId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const post = await PostRepo.findPostAllDataById(new Types.ObjectId(req.params.id));

    if (!post) throw new BadRequestError('Post does not exists');
    if (!post.isSubmitted && !post.isPublished) throw new ForbiddenError('This post is private');

    new SuccessResponse('success', post).send(res);
  }),
);

export default router;
