import express from 'express';

import CityNames, { CityNamesModel } from '../../../database/model/CityNames';

const router = express.Router();

export const getCities = router.get('/', async (req, res) => {
  console.log('getCities');
  const data = req.query;
  if (data.city && typeof data.city === 'string') {
    const q = data?.city;
    const cities: CityNames[] = await CityNamesModel.find({ enum: { $regex: q } }).limit(10);
    if (cities) {
      return res.status(200).json({ status: 200, message: 'Cities found', data: cities });
    }
    return res.status(404).json({ message: 'Cities not found', status: 404 });
  }
  try {
    const response = await CityNamesModel.find().limit(20);
    res.status(200).json({
      status: 200,
      message: 'Cities found',
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      err: error,
    });
  }
});
