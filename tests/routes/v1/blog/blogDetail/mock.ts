import Post from '../../../../../src/database/model/Post';
import { Types } from 'mongoose';

jest.unmock('../../../../../src/database/repository/PostRepo');

export const POST_ID = new Types.ObjectId();
export const POST_URL = 'abc';

export const mockPostFindByUrl = jest.fn(async (postUrl: string): Promise<Post | null> => {
  if (postUrl === POST_URL)
    return {
      _id: POST_ID,
      postUrl: postUrl,
    } as Post;
  return null;
});

export const mockFindInfoWithTextById = jest.fn(
  async (id: Types.ObjectId): Promise<Post | null> => {
    if (POST_ID.equals(id))
      return {
        _id: POST_ID,
        postUrl: POST_URL,
      } as Post;
    return null;
  },
);

jest.mock('../../../../../src/database/repository/PostRepo', () => ({
  get findByUrl() {
    return mockPostFindByUrl;
  },
  get findInfoWithTextById() {
    return mockFindInfoWithTextById;
  },
}));
