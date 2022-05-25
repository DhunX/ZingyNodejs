import Post, { PostModel } from '../model/Post';
import { Types } from 'mongoose';
import User from '../model/User';

export default class PostRepo {
  private static AUTHOR_DETAIL = 'name profilePicUrl interests username';
  private static POST_INFO_ADDITIONAL = '+isSubmitted +isDraft +isPublished +createdBy +updatedBy';
  private static POST_ALL_DATA =
    '+text +isSubmitted +isDraft +isPublished +status +createdBy +updatedBy';

  public static async create(post: Post): Promise<Post> {
    const now = new Date();
    post.createdAt = now;
    post.updatedAt = now;
    const createdPost = await PostModel.create(post);
    return createdPost;
  }

  public static update(post: Post): Promise<any> {
    post.updatedAt = new Date();
    return PostModel.updateOne({ _id: post._id }, { $set: { ...post } })
      .lean<Post>()
      .exec();
  }

  public static findInfoById(id: Types.ObjectId): Promise<Post | null> {
    return PostModel.findOne({ _id: id, status: true })
      .populate('author', this.AUTHOR_DETAIL)
      .lean<Post>()
      .exec();
  }

  public static findInfoWithTextById(id: Types.ObjectId): Promise<Post | null> {
    return PostModel.findOne({ _id: id, status: true })
      .select('+text')
      .populate('author', this.AUTHOR_DETAIL)
      .lean<Post>()
      .exec();
  }

  public static findInfoWithTextAndDraftTextById(id: Types.ObjectId): Promise<Post | null> {
    return PostModel.findOne({ _id: id, status: true })
      .select('+text +isSubmitted +isDraft +isPublished +status')
      .populate('author', this.AUTHOR_DETAIL)
      .lean<Post>()
      .exec();
  }

  public static findPostAllDataById(id: Types.ObjectId): Promise<Post | null> {
    return PostModel.findOne({ _id: id, status: true })
      .select(this.POST_ALL_DATA)
      .populate('author', this.AUTHOR_DETAIL)
      .lean<Post>()
      .exec();
  }

  public static findById(id: string): Promise<Post | null> {
    return PostModel.findOne({ _id: id })
      .populate('author', this.AUTHOR_DETAIL)
      .populate('comments')
      .lean<Post>()
      .exec();
  }

  public static findUrlIfExists(postUrl: string): Promise<Post | null> {
    return PostModel.findOne({ postUrl: postUrl }).lean<Post>().exec();
  }

  public static findByTagAndPaginated(
    tag: string,
    pageNumber: number,
    limit: number,
  ): Promise<Post[]> {
    return PostModel.find({ tags: tag, status: true, isPublished: true })
      .skip(limit * (pageNumber - 1))
      .limit(limit)
      .populate('author', this.AUTHOR_DETAIL)
      .sort({ updatedAt: -1 })
      .lean<Post[]>()
      .exec();
  }

  public static findAllPublishedForAuthor(user: User): Promise<Post[]> {
    return PostModel.find({ author: user, status: true, isPublished: true })
      .populate('author', this.AUTHOR_DETAIL)
      .sort({ updatedAt: -1 })
      .lean<Post[]>()
      .exec();
  }

  public static findAllDrafts(): Promise<Post[]> {
    return this.findDetailedPosts({ isDraft: true, status: true });
  }

  public static findAllSubmissions(): Promise<Post[]> {
    return this.findDetailedPosts({ isSubmitted: true, status: true });
  }

  public static findAllPublished(): Promise<Post[]> {
    return this.findDetailedPosts({ isPublished: true, status: true });
  }

  public static findAllSubmissionsForWriter(user: User): Promise<Post[]> {
    return this.findDetailedPosts({ author: user, status: true, isSubmitted: true });
  }

  public static findAllPublishedForWriter(user: User): Promise<Post[]> {
    return this.findDetailedPosts({ author: user, status: true, isPublished: true });
  }

  public static findAllDraftsForWriter(user: User): Promise<Post[]> {
    return this.findDetailedPosts({ author: user, status: true, isDraft: true });
  }

  private static findDetailedPosts(query: Record<string, unknown>): Promise<Post[]> {
    return PostModel.find(query)
      .select(this.POST_INFO_ADDITIONAL)
      .populate('author', this.AUTHOR_DETAIL)
      .populate('createdBy', this.AUTHOR_DETAIL)
      .populate('updatedBy', this.AUTHOR_DETAIL)
      .sort({ updatedAt: -1 })
      .lean<Post[]>()
      .exec();
  }

  public static findLatestPosts(pageNumber: number, limit: number): Promise<Post[]> {
    return PostModel.find({ status: true, isPublished: true })
      .skip(limit * (pageNumber - 1))
      .limit(limit)
      .populate('author', this.AUTHOR_DETAIL)
      .sort({ publishedAt: -1 })
      .lean<Post[]>()
      .exec();
  }

  public static searchSimilarPosts(post: Post, limit: number): Promise<Post[]> {
    return PostModel.find(
      {
        $text: { $search: post.description, $caseSensitive: false },
        status: true,
        isPublished: true,
        _id: { $ne: post._id },
      },
      {
        similarity: { $meta: 'textScore' },
      },
    )
      .populate('author', this.AUTHOR_DETAIL)
      .sort({ updatedAt: -1 })
      .limit(limit)
      .sort({ similarity: { $meta: 'textScore' } })
      .lean<Post[]>()
      .exec();
  }

  public static search(query: string, limit: number): Promise<Post[]> {
    return PostModel.find(
      {
        $text: { $search: query, $caseSensitive: false },
        status: true,
        isPublished: true,
      },
      {
        similarity: { $meta: 'textScore' },
      },
    )
      .select('-status -description')
      .limit(limit)
      .sort({ similarity: { $meta: 'textScore' } })
      .lean<Post[]>()
      .exec();
  }

  public static searchLike(query: string, limit: number): Promise<Post[]> {
    return PostModel.find({
      title: { $regex: `.*${query}.*`, $options: 'i' },
      status: true,
      isPublished: true,
    })
      .select('-status -description')
      .limit(limit)
      .sort({ score: -1 })
      .lean<Post[]>()
      .exec();
  }
}
