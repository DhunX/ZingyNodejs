import Post from '../../../../../src/database/model/Post';
import { Types } from 'mongoose';
import { USER_ID_WRITER } from '../../../../auth/authorization/mock';

jest.unmock('../../../../../src/database/repository/PostRepo');

export const POST_ID = new Types.ObjectId();
export const POST_ID_2 = new Types.ObjectId();
export const POST_URL = 'abc';

export const mockPostFindUrlIfExists = jest.fn(async (postUrl: string): Promise<Post | null> => {
  if (postUrl === POST_URL)
    return {
      _id: POST_ID,
      postUrl: postUrl,
    } as Post;
  return null;
});

export const mockPostCreate = jest.fn(async (post: Post): Promise<Post> => {
  post._id = POST_ID;
  return post;
});

export const mockPostUpdate = jest.fn(async (post: Post): Promise<Post> => post);

export const mockFindPostAllDataById = jest.fn(async (id: Types.ObjectId): Promise<Post | null> => {
  if (POST_ID.equals(id))
    return {
      _id: POST_ID,
      author: { _id: USER_ID_WRITER },
      isDraft: true,
      isSubmitted: false,
      isPublished: false,
    } as Post;
  if (POST_ID_2.equals(id))
    return {
      _id: POST_ID,
      author: { _id: new Types.ObjectId() },
      isDraft: true,
      isSubmitted: false,
      isPublished: false,
    } as Post;
  return null;
});

jest.mock('../../../../../src/database/repository/PostRepo', () => ({
  get findUrlIfExists() {
    return mockPostFindUrlIfExists;
  },
  get create() {
    return mockPostCreate;
  },
  get update() {
    return mockPostUpdate;
  },
  get findPostAllDataById() {
    return mockFindPostAllDataById;
  },
}));
