const router = require('express').Router();
const { Page } = require('../models');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => res.json(await Page.find().sort('order')));
router.get('/:slug', async (req, res) => {
  const page = await Page.findOne({ slug: req.params.slug }).lean();
  if (!page) return res.status(404).json({ message: 'Page not found' });
  const children = await Page.find({ parent: page.slug }).select('slug title summary image cardImage').sort('order').lean();
  res.json({ ...page, children });
});
router.post('/', auth, async (req, res, next) => { try { res.status(201).json(await Page.create(req.body)); } catch (e) { next(e); } });
router.put('/:id', auth, async (req, res, next) => { try { res.json(await Page.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { next(e); } });
router.delete('/:id', auth, async (req, res) => { await Page.findByIdAndDelete(req.params.id); res.json({ ok: true }); });
module.exports = router;
