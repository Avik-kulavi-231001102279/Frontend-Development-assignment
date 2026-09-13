const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    priority: {
      type: String,
      required: [true, 'Please select a priority'],
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Academic', 'Personal'],
      default: 'Personal',
    },
    raisedAt: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, 'Please add a due date'],
    },
    completedAt: {
      type: Date,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

taskSchema.virtual('status').get(function() {
  if (this.completedAt) return 'Completed';
  
  const now = new Date();
  const due = this.dueDate;
  
  // Reset times to compare just the dates
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Pending';
  if (diffDays === 0) return 'Due Today';
  if (diffDays <= 5) return 'Raised';
  return 'Upcoming';
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
