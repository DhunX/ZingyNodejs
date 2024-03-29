import express from 'express';

import EmailLead, { EmailLeadModel } from '../../../database/model/EmailLeads';
import { FormQueryModel } from '../../../database/model/FormQueries';
import { isEmailAddress } from '../../../helpers/regex';

const router = express.Router();

export const enterEarlyAccess = router.post('/early-access-request', async (req, res) => {
  const data = req.body.email;
  if (!data || data.length === 0) {
    return res.status(400).json({
      message: 'Email is required',
      status: 400,
    });
  }
  if (!isEmailAddress(data)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid email address',
    });
  }
  const email_lead: EmailLead | null = await EmailLeadModel.findOne({ email: data });
  if (email_lead && email_lead.email.length > 0) {
    return res.status(400).json({ status: 400, message: 'Already Registered', data: email_lead });
  }
  try {
    const now = new Date();
    const response = await EmailLeadModel.create({
      email: data,
      source: '001 - Website: Early access request',
      createdAt: now,
    });
    res.status(200).json({
      status: 200,
      message: 'Request sent successfully',
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      err: error,
      message: 'Internal server error',
    });
  }
});
export const sendQuery = router.post('/form-query', async (req, res) => {
  const email = req.body.email;
  const subject = req.body.subject;
  const text = req.body.text;
  if (!isEmailAddress(email)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid email address',
    });
  }
  if (!email || email.length === 0) {
    return res.status(400).json({
      message: 'Email is required',
      status: 400,
    });
  }
  if (!text || text.length === 0) {
    return res.status(400).json({
      message: 'Query Text is required',
      status: 400,
    });
  }
  try {
    const now = new Date();
    const response = await FormQueryModel.create({
      email,
      subject,
      text,
      createdAt: now,
    });
    res.status(200).json({
      status: 200,
      message: 'Request sent successfully',
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      err: error,
      message: 'Internal server error',
    });
  }
});

export const getEarlyAccessList = router.get('/list-early-access-requests', async (req, res) => {
  try {
    const response = await EmailLeadModel.find();
    res.status(200).json({
      status: 200,
      message: 'Success',
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      err: error,
      message: 'Internal server error',
    });
  }
});
