const router = require('express').Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect, adminOnly } = require('../middleware/auth');

// GET tasks (filtered by role)
router.get('/', protect, async (req, res) => {
  const { projectId, status } = req.query;
  let filter = {};
  if (projectId) filter.project = projectId;
  if (status) filter.status = status;
  if (req.user.role !== 'admin') filter.assignedTo = req.user._id;

  const tasks = await Task.find(filter)
    .populate('project', 'name')
    .populate('assignedTo createdBy', 'name email');
  res.json(tasks);
});

// POST create task
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate } = req.body;
    if (!title || !project) return res.status(400).json({ message: 'Title & project required' });
    const task = await Task.create({
      title, description, project, assignedTo,
      priority, dueDate, createdBy: req.user._id
    });
    res.status(201).json(task);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update task
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    // Members can only update status of their own tasks
    if (req.user.role !== 'admin' &&
        task.assignedTo?.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE task (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;