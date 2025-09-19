// backend/routes/logs.js
const router = require('express').Router();
let Log = require('../models/Log.model');
const auth = require('../middleware/auth'); // Import the middleware
const multer = require('multer');
const path = require('path');

// Multer storage for videos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, safeName);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['.mp4', '.webm', '.mov', '.mkv'];
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (allowed.includes(ext)) return cb(null, true);
    cb(new Error('Only video files are allowed'));
  },
});

// GET all logs for the authenticated user
router.route('/').get(auth, (req, res) => { // Use auth middleware here
  Log.find({ user: req.user.id })
    .then(logs => res.json(logs))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST a new log for the authenticated user (for AddLogModal.jsx)
router.route('/').post(auth, async (req, res) => {
  try {
    const user = req.user.id;
    const { title, type, mood, content, date } = req.body;
    const newLog = new Log({
      user,
      title,
      type,
      mood,
      content,
      date: new Date(date),
    });
    await newLog.save();
    // return the created log so frontend can update state safely
    res.json({ message: 'Log added!', log: newLog });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Upload a video and create a video log in one request
router.post('/upload-video', auth, upload.single('video'), async (req, res) => {
  try {
    const user = req.user.id;
    const { title, mood, notes, date } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No video file uploaded' });

    const publicUrl = `/uploads/${req.file.filename}`;

    const newLog = new Log({
      user,
      title: title || 'Video Log',
      type: 'video',
      mood: mood || '',
      content: { url: publicUrl, notes: notes || '' },
      date: date ? new Date(date) : new Date(),
    });
    await newLog.save();
    res.json({ message: 'Video log added!', log: newLog });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a log
router.route('/:id').delete(auth, async (req, res) => {
  try {
    const log = await Log.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!log) return res.status(404).json({ error: 'Log not found' });
    res.json({ message: 'Log deleted!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE a log
router.route('/:id').put(auth, async (req, res) => {
  try {
    const { title, type, mood, content, date } = req.body;
    const log = await Log.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, type, mood, content, date: new Date(date) },
      { new: true }
    );
    if (!log) return res.status(404).json({ error: 'Log not found' });
    res.json({ message: 'Log updated!', log });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;