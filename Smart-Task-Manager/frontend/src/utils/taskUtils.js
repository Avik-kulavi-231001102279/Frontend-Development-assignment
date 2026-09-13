import { parseISO, format, differenceInDays, startOfDay } from 'date-fns';

export const calculateTaskStatus = (dueDate, completedAt) => {
  if (completedAt) return 'Completed';

  const today = startOfDay(new Date());
  const due = startOfDay(parseISO(dueDate));
  const diffDays = differenceInDays(due, today);

  if (diffDays < 0) return 'Pending'; // Overdue
  if (diffDays === 0) return 'Due Today';
  if (diffDays <= 5) return 'Raised';
  return 'Upcoming';
};

export const getRelativeDueInfo = (dueDate, completedAt) => {
  if (completedAt) {
    return `Completed on ${format(parseISO(completedAt), 'dd MMM yyyy, h:mm a')}`;
  }

  const today = startOfDay(new Date());
  const due = startOfDay(parseISO(dueDate));
  const diffDays = differenceInDays(due, today);

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    return `Overdue by ${absDays} day${absDays !== 1 ? 's' : ''}`;
  }
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  
  return `Due in ${diffDays} days`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return format(parseISO(dateString), 'dd MMM yyyy');
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  return format(parseISO(dateString), 'dd MMM yyyy, h:mm a');
};
