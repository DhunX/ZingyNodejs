import express from 'express';
// import { SuccessResponse } from '../../../core/ApiResponse';
// import { BadRequestError } from '../../../core/ApiError';
import asyncHandler from '../../../helpers/asyncHandler';

const router = express.Router();

export const sendOTP = router.post(
  '/',
  asyncHandler(async (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    fetch(
      `https://api.msg91.com/api/v5/otp?template_id=${process.env.MSG91_TEMPLATE_ID}&mobile=${phoneNumber}&authkey=${process.env.MSG91_AUTH_KEY}`,
    )
      .then((response) => {
        res.status(200).json({ res: response, message: 'OTP sent' });
      })
      .catch((error) => {
        res.status(400).json({ error: error, message: "Couldn't send OTP" });
      });
  }),
);

export const verifyOTP = router.post(
  '/',
  asyncHandler(async (req, res) => {
    const otp = req.body.otp;
    const phoneNumber = req.body.phoneNumber;
    fetch(
      `https://api.msg91.com/api/v5/otp/verify?mobile=${phoneNumber}&otp=${otp}&authkey=${process.env.MSG91_AUTH_KEY}`,
    )
      .then((response) => {
        res.status(200).json({ res: response, message: 'OTP sent' });
      })
      .catch((error) => {
        res.status(400).json({ error: error, message: "Couldn't send OTP" });
      });
  }),
);

export const resendOTP = router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { phoneNumber, retrytype } = req.body;
    fetch(
      `https://api.msg91.com/api/v5/otp?retrytype=${retrytype}&mobile=${phoneNumber}&authkey=${process.env.MSG91_AUTH_KEY}`,
    )
      .then((response) => {
        res.status(200).json({ res: response, message: 'OTP resent' });
      })
      .catch((error) => {
        res.status(400).json({ error: error, message: "Couldn't resend OTP" });
      });
  }),
);

export const test = router.get('/', (req, res) => {
  res.send('test');
});
