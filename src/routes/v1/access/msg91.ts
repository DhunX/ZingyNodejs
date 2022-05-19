import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError } from '../../../core/ApiError';
import asyncHandler from '../../../helpers/asyncHandler';

const router = express.Router();

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    fetch(
      `https://api.msg91.com/api/v5/otp?template_id=${process.env.MSG91_TEMPLATE_ID}&mobile=${phoneNumber}&authkey=${process.env.MSG91_TEMPLATE_ID}`,
    )
      .then((response) => {})
      .catch((error) => {});
  }),
);

router.post(
  '/test',
  asyncHandler(async (req, res) => {
    res.send('test');
  }),
);

export default router;
