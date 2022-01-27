import Blog from '../../../../../src/database/model/Blog';
import { Types } from 'mongoose';

jest.unmock('../../../../../src/database/repository/BlogRepo');

export const BLOG_ID = new Types.ObjectId();
export const BLOG_URL = 'abc';

export const mockBlogFindByUrl = jest.fn(
  async (postUrl: string): Promise<Blog | null> => {
    if (postUrl === BLOG_URL)
      return {
        _id: BLOG_ID,
        postUrl: postUrl,
      } as Blog;
    return null;
  },
);

export const mockFindInfoWithTextById = jest.fn(
  async (id: Types.ObjectId): Promise<Blog | null> => {
    if (BLOG_ID.equals(id))
      return {
        _id: BLOG_ID,
        postUrl: BLOG_URL,
      } as Blog;
    return null;
  },
);

jest.mock('../../../../../src/database/repository/BlogRepo', () => ({
  get findByUrl() {
    return mockBlogFindByUrl;
  },
  get findInfoWithTextById() {
    return mockFindInfoWithTextById;
  },
}));
