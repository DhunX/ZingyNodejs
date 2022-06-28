import User, { UserModel } from '../model/User';
import Role, { RoleModel } from '../model/Role';
import { InternalError } from '../../core/ApiError';
import { Types } from 'mongoose';
import KeystoreRepo from './KeystoreRepo';
import Keystore from '../model/Keystore';
import Post from '../model/Post';

export default class UserRepo {
  // contains critical information of the user
  public static findById(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findOne({ _id: id, status: true })
      .select('+email +password +roles')
      .populate({
        path: 'roles',
        match: { status: true },
      })
      .lean<User>()
      .exec();
  }
  public static findByUserName(username: string): Promise<User | null> {
    return UserModel.findOne({ username })
      .select('+email +password +roles')
      .populate({
        path: 'roles',
      })
      .lean<User>()
      .exec();
  }

  public static findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email: email, status: true })
      .select('+email +password +roles')
      .populate({
        path: 'roles',
        match: { status: true },
        select: { code: 1 },
      })
      .lean<User>()
      .exec();
  }
  public static findByPhoneNumber(number: string): Promise<User | null> {
    return UserModel.findOne({ number: number, status: true })
      .select('+phoneNumber +password +roles')
      .populate({
        path: 'roles',
        match: { status: true },
        select: { code: 1 },
      })
      .lean<User>()
      .exec();
  }

  public static findProfileById(id: Types.ObjectId): Promise<User | null> {
    return (
      UserModel.findOne({ _id: id, status: true })
        .select('+roles')
        .populate({
          path: 'roles',
          match: { status: true },
          select: { code: 1 },
        })
        .populate('posts')
        // .populate('tracks')
        .lean<User>()
        .exec()
    );
  }

  public static findPublicProfileById(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findOne({ _id: id, status: true }).lean<User>().exec();
  }

  public static async create(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
    roleCode: string,
  ): Promise<{ user: User; keystore: Keystore }> {
    const now = new Date();

    const role = await RoleModel.findOne({ code: roleCode })
      .select('+email +password')
      .lean<Role>()
      .exec();
    if (!role) throw new InternalError('Role must be defined');

    user.roles = [role._id];
    user.followers = { count: 0, users: [] };
    user.following = { count: 0, users: [] };
    user.status = true;
    user.tracks = [];
    user.posts = [];
    user.createdAt = user.updatedAt = now;
    const createdUser = await UserModel.create(user);
    const keystore = await KeystoreRepo.create(createdUser._id, accessTokenKey, refreshTokenKey);
    return { user: createdUser, keystore: keystore };
  }

  public static async update(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
  ): Promise<{ user: User; keystore: Keystore }> {
    user.updatedAt = new Date();
    await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
      .lean()
      .exec();
    const keystore = await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey);
    return { user: user, keystore: keystore };
  }

  public static async userAddPost(user: User, newPost: Post): Promise<{ message: string }> {
    user.posts.push(newPost);
    try {
      await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
        .lean()
        .exec();
      return { message: 'success' };
    } catch (error) {
      return { message: 'error' };
    }
  }

  public static updateInfo(user: User): Promise<any> {
    user.updatedAt = new Date();
    return UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
      .lean()
      .exec();
  }

  public static async followProfile({
    userId,
    myId,
  }: {
    userId: string;
    myId: string;
  }): Promise<{ message: string }> {
    const user = await UserModel.findOne({ _id: userId }).select('+followers').lean<User>().exec();
    const my = await UserModel.findOne({ _id: myId }).select('+followers').lean<User>().exec();
    if (!user || !my) throw new InternalError('User not found');
    if (user.followers.users.includes(my._id)) {
      user.followers.users = user.followers.users.filter((id) => id !== my._id);
      user.followers.count--;
    }
    user.followers.users.push(my._id);
    user.followers.count++;

    if (my.following.users.includes(user._id)) {
      my.following.users = my.following.users.filter((id) => id !== user._id);
      my.following.count--;
    }
    my.following.users.push(user._id);
    my.following.count++;

    await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
      .lean()
      .exec();

    await UserModel.updateOne({ _id: my._id }, { $set: { ...my } })
      .lean()
      .exec();

    return { message: 'success' };
  }
}
