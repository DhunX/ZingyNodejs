import express from 'express';
import authentication from '../../../auth/authentication';

import User, { UserModel } from '../../../database/model/User';

const router = express.Router();

router.use('/', authentication);

export const getAllUsers = router.get('/', async (req, res, next) => {
  const data = req.query;
  if (data.username && typeof data.username === 'string') {
    const q = data?.username;
    const user = await UserModel.findOne({ username: q });
    if (user) {
      return res.status(200).json({ status: 200, message: 'User found', data: user });
    }
    return res.status(404).json({ message: 'User not found', status: 404 });
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
