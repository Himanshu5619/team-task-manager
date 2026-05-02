const router = require('express').Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET all users (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

module.exports = router;