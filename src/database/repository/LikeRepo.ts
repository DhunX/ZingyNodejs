import Like, { LikeModel } from '../model/Like';
import { Types } from 'mongoose';
import User from '../model/User';
import Post from '../model/Post';
import UserRepo from './UserRepo';
import PostRepo from './PostRepo';

export default class LikeRepo {
  public static async create(user: User, post: Post): Promise<Like> {
    const like = new LikeModel({
      user: {
        username: user.username,
        id: user._id,
      },
      post: {
        id: post._id,
      },
    });
    return await like.save();
  }
}
