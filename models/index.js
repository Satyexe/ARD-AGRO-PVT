const { Schema, model } = require('mongoose');

const Setting = model('Setting', new Schema({ key: { type: String, unique: true }, data: Schema.Types.Mixed }));

const Page = model('Page', new Schema({
  slug: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  menuGroup: { type: String, enum: ['services', 'agri', 'none'], default: 'none' },
  parent: { type: String, default: null },
  showOnHome: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  summary: String,
  image: String,
  cardImage: String,
  sections: [{ heading: String, body: String, image: String, images: [String], layout: String, accordion: [{ title: String, body: String }] }]
}, { timestamps: true }));

const Testimonial = model('Testimonial', new Schema({ name: String, role: String, location: String, image: String, quote: String, order: Number }));
const TeamMember = model('TeamMember', new Schema({ name: String, role: String, image: String, group: { type: String, default: 'core' }, order: Number }));
const Partner = model('Partner', new Schema({ name: String, image: String, order: Number }));

const Enquiry = model('Enquiry', new Schema({
  name: { type: String, required: true }, email: { type: String, required: true },
  phone: String, subject: String, message: { type: String, required: true }, read: { type: Boolean, default: false }
}, { timestamps: true }));

const Subscriber = model('Subscriber', new Schema({ email: { type: String, required: true, unique: true, lowercase: true }, website: String }, { timestamps: true }));

const User = model('User', new Schema({ email: { type: String, unique: true }, password: String, role: { type: String, default: 'admin' } }));

module.exports = { Setting, Page, Testimonial, TeamMember, Partner, Enquiry, Subscriber, User };
