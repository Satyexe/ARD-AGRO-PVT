const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/[^\w.-]/g, '_'))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (r, f, cb) => cb(null, /^image\//.test(f.mimetype)) });
router.post('/', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Image file required' });
  res.json({ url: `/uploads/${req.file.filename}` });
});
module.exports = router;
