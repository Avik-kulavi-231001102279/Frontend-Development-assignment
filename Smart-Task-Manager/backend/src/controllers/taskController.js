const Task = require('../models/Task');

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, category, search } = req.query;

    let query = { user: req.user.id };

    // Filtering
    if (priority) query.priority = priority;
    if (category) query.category = category;

    if (status) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      if (status === 'Completed' || status === 'Closed') {
        query.completedAt = { $ne: null };
      } else {
        query.completedAt = null;
        
        if (status === 'Upcoming') {
          const in5Days = new Date(today);
          in5Days.setDate(in5Days.getDate() + 5);
          query.dueDate = { $gt: in5Days };
        } else if (status === 'Raised') {
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const in5Days = new Date(today);
          in5Days.setDate(in5Days.getDate() + 5);
          query.dueDate = { $gte: tomorrow, $lte: in5Days };
        } else if (status === 'Due Today') {
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          query.dueDate = { $gte: today, $lt: tomorrow };
        } else if (status === 'Pending') {
          query.dueDate = { $lt: today };
        }
      }
    }

    // Searching
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let queryBuilder = Task.find(query).sort({ createdAt: -1 });

    const tasks = await queryBuilder;
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check for user
    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Make sure the logged in user matches the task user
    if (task.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Set task
// @route   POST /api/tasks
// @access  Private
const setTask = async (req, res, next) => {
  try {
    const { title, description, priority, category, dueDate } = req.body;

    if (!title || !description || !priority || !category || !dueDate) {
      res.status(400);
      throw new Error('Please add all required fields including due date');
    }

    const task = await Task.create({
      title,
      description,
      priority,
      category,
      dueDate,
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check for user
    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Make sure the logged in user matches the task user
    if (task.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    // Prevent updating computed or sensitive fields
    delete req.body.raisedAt;
    delete req.body.completedAt;
    delete req.body.status;

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (task.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    if (req.body.status === 'Closed' || req.body.status === 'Completed') {
      task.completedAt = new Date();
    } else if (req.body.completedAt === null) {
      task.completedAt = null; // optional logic if we ever un-complete
    }
    
    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check for user
    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Make sure the logged in user matches the task user
    if (task.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await task.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  setTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
