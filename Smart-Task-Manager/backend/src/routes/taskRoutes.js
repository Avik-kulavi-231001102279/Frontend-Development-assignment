const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  setTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTasks).post(protect, setTask);
router
  .route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);
router.route('/:id/status').patch(protect, updateTaskStatus);

module.exports = router;
