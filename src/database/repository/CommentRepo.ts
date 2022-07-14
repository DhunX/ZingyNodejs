import Comment, { CommentModel } from '../model/Comment';
import { Types } from 'mongoose';
import User from '../model/User';
import Post from '../model/Post';
import UserRepo from './UserRepo';
import PostRepo from './PostRepo';

export default class CommentRepo {
  public static async create(user: User, post: Post, content: string): Promise<Comment> {
    const comment = new CommentModel({
      content,
      user: {
        username: user.username,
        id: user._id,
      },
      post: {
        id: post._id,
      },
    });
    return await comment.save();
  }

  public static async delete(commentId: Types.ObjectId): Promise<Comment> {
    const comment = await CommentModel.findOne({ _id: commentId });
    if (!comment) {
      throw new Error('Comment not found');
    }
    return await comment.remove();
  }

  public static async edit(commentId: Types.ObjectId, content: string): Promise<Comment> {
    const comment = await CommentModel.findOne({ _id: commentId });
    if (!comment) {
      throw new Error('Comment not found');
    }
    comment.content = content;
    return await comment.save();
  }

  // Logic to like a comment
  // public static async likeComment(commentId: Types.ObjectId, userId: Types.ObjectId): Promise<Comment> {
  //   const comment = await CommentModel.findOne({ _id: commentId });
  //   if (!comment) {
  //     throw new Error('Comment not found');
  //   }
  //   const user = await UserRepo.findById(userId);
  //   if (!user) {
  //     throw new Error('User not found');
  //   }

  //   const like = await LikeRepo.create(user, comment);
  //   comment.likes.push(like);
  //   return comment.save();
  // }
}
