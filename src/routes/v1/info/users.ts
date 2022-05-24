import express from 'express';
import authentication from '../../../auth/authentication';

import { UserModel } from '../../../database/model/User';

const router = express.Router();

router.use('/', authentication);

export const getAllUsers = router.get('/', async (req, res) => {
  const data = req.query;
  if (data.username && typeof data.username === 'string') {
    const q = data?.username;
    const user = await UserModel.findOne({ username: q });
    if (user) {
      return res.status(200).json({ status: 200, message: 'User found', data: user });
    }
    return res.status(404).json({ message: 'User not found', status: 404 });
  }
  if (data.q && typeof data.q === 'string') {
    const q = data?.q;
    const userByName = await UserModel.find({ name: { $regex: q } });
    const userByUserName = await UserModel.find({ username: { $regex: q } });
    const userByEmail = await UserModel.find({ email: { $regex: q } });
    const user = [...userByName, ...userByUserName, ...userByEmail];
    if (user && user.length > 0) {
      return res.status(200).json({ status: 200, message: 'Users found', data: user, q: q });
    }
    return res.status(404).json({ message: 'No User found', status: 404 });
  }
  try {
    const response = await UserModel.find();
    res.status(200).json({
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      err: error,
    });
  }
});
