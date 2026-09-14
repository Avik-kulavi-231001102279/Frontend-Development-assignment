/**
 * Normalizes a date to start of day for comparison.
 */
const getStartOfDay = (dateStr) => {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Calculates the number of full days remaining between today and the due date.
 * Positive = future, 0 = today, Negative = past
 */
export const getDaysRemaining = (dueDateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = getStartOfDay(dueDateStr);
  
  // Calculate difference in ms
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 
  
  return diffDays;
};

/**
 * Calculates the task status based on due date rules.
 */
export const calculateTaskStatus = (dueDateStr, isCompleted) => {
  if (isCompleted) {
    return 'Completed';
  }
  
  if (!dueDateStr) return 'Upcoming'; // Fallback

  const daysRemaining = getDaysRemaining(dueDateStr);

  if (daysRemaining > 5) {
    return 'Upcoming';
  } else if (daysRemaining >= 1 && daysRemaining <= 5) {
    return 'Raised';
  } else if (daysRemaining === 0) {
    return 'Due Today';
  } else {
    return 'Pending'; // Represents overdue
  }
};

/**
 * Generates human-friendly due date information.
 */
export const getHumanReadableDue = (dueDateStr, status, completedAtStr) => {
  if (status === 'Completed') {
    if (!completedAtStr) return 'Completed';
    const completedDate = new Date(completedAtStr);
    const formattedDate = completedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedTime = completedDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `Completed on ${formattedDate}, ${formattedTime}`;
  }

  const daysRemaining = getDaysRemaining(dueDateStr);

  if (daysRemaining > 1) {
    return `Due in ${daysRemaining} days`;
  } else if (daysRemaining === 1) {
    return `Due tomorrow`;
  } else if (daysRemaining === 0) {
    return `Due today`;
  } else if (daysRemaining === -1) {
    return `Overdue by 1 day`;
  } else {
    return `Overdue by ${Math.abs(daysRemaining)} days`;
  }
};
