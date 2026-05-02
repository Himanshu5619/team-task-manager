const router = require('express').Router();
const Project = require('../models/Project');
const { protect, adminOnly } = require('../middleware/auth');

// GET all projects for user
router.get('/', protect, async (req, res) => {
  const filter = req.user.role === 'admin'
    ? {}
    : { members: req.user._id };
  const projects = await Project.find(filter).populate('owner members', 'name email');
  res.json(projects);
});

// POST create project (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, members } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    const project = await Project.create({
      name, description, owner: req.user._id,
      members: members || []
    });
    res.status(201).json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update project (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE project (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;