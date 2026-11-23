require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const { Setting } = require('../models');
const profile = require('../../database/seed/settings.json');

(async () => {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing from backend/.env');
  await mongoose.connect(process.env.MONGO_URI);
  const site = await Setting.findOne({ key: 'site' });
  if (!site) throw new Error('The site settings record was not found; no data was changed.');
  const fields = ['name', 'address', 'phone', 'phone2', 'email', 'legal'];
  site.data = { ...site.data, ...Object.fromEntries(fields.map(key => [key, profile[key]])) };
  site.markModified('data');
  await site.save();
  console.log('Updated ARD Agro address, phone numbers, email, CIN, PAN and TAN in the site settings.');
  await mongoose.disconnect();
})().catch(async error => {
  console.error('Company profile update failed:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
