require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { Setting, Page, Testimonial, TeamMember, Partner, User } = require('./models');
const read = f => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'database', 'seed', f), 'utf8'));

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([Setting, Page, Testimonial, TeamMember, Partner].map(m => m.deleteMany({})));
  await Setting.create({ key: 'site', data: read('settings.json') });
  await Page.insertMany(read('pages.json'));
  await Testimonial.insertMany(read('testimonials.json'));
  await TeamMember.insertMany(read('team.json'));
  await Partner.insertMany(read('partners.json'));
  const email = (process.env.ADMIN_EMAIL || 'admin@ardagro.com').toLowerCase();
  await User.findOneAndUpdate({ email }, { email, password: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'ChangeMe@123', 10) }, { upsert: true });
  console.log('Seed complete. Admin:', email);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
