require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const { Setting } = require('../models');

const mission = `Promoting Sustainable Farming: To integrate traditional farming wisdom with modern agricultural practices that protect soil health and biodiversity.\n\nEmpowering Farmers: To support local farmers and livestock caretakers by creating equitable opportunities and fostering rural growth.\n\nDelivering Excellence: To provide premium, responsibly sourced agricultural and dairy products that ensure health, purity, and consumer trust.\n\nEnvironmental Stewardship: To harmonize agricultural productivity with ecological balance, harnessing the power of nature for a greener tomorrow.`;
const vision = "To be a trusted leader in sustainable and holistic agriculture, empowering rural communities, nurturing nature's resources, and delivering wholesome quality from our fields to the world.";
const hero = {
  heroSub: 'ARD AGRO PVT LTD',
  heroImage: 'home/greenhouse.jpg',
  heroTagline: 'Smart Farming. Richer Harvests. Brighter Tomorrow.',
  heroTitle: 'Build a More Productive, Resilient Farm',
  heroDescription: 'Whether you farm a few acres or work with a large farmer group, we connect practical field support—from protected cultivation and solar irrigation to hands-on training and market linkages—to your local needs.'
};

(async () => {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing from backend/.env');
  await mongoose.connect(process.env.MONGO_URI);
  const site = await Setting.findOne({ key: 'site' });
  if (!site) throw new Error('The site settings record was not found; no data was changed.');
  site.data = { ...site.data, ...hero, about: { ...site.data.about, mission, vision } };
  site.markModified('data');
  await site.save();
  console.log('Updated the homepage hero and About Us Vision and Mission.');
  await mongoose.disconnect();
})().catch(async error => {
  console.error('Site content update failed:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});