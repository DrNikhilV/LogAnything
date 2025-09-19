// backend/routes/user.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User.model');

// GET /api/user - Get user data based on token
router.get('/', auth, async (req, res) => { // Use auth middleware here
  try {
    const user = await User.findById(req.user.id).select('-password -__v');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT /api/user - update firstName / lastName (requires token)
router.put('/', auth, async (req, res) => {
  const { firstName, lastName } = req.body;
  if (!firstName || typeof firstName !== 'string' || !firstName.trim()) {
    return res.status(400).json({ msg: 'First name is required' });
  }

  try {
    const updates = {
      firstName: firstName.trim(),
      lastName: lastName ? String(lastName).trim() : '',
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true, context: 'query' }
    ).select('-password -__v');

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;