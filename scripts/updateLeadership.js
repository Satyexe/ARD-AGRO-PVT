require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const { Setting } = require('../models');
const profile = require('../../database/seed/settings.json');
(async () => {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing from backend/.env');
  await mongoose.connect(process.env.MONGO_URI);
  const site = await Setting.findOne({ key: 'site' });
  if (!site) throw new Error('The site settings record was not found.');
  const data = { ...site.data };
  delete data.ceo;
  site.data = { ...data, md: profile.md, director: profile.director };
  site.markModified('data');
  await site.save();
  console.log('Updated the leadership profiles for Rupali Sharma and Rana Vishav Vijay.');
  await mongoose.disconnect();
})().catch(async error => {
  console.error('Leadership update failed:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});