import React from 'react';
import { Badge } from './Badge';

/**
 * Attendify - StatusBadge Component
 * Color-coded visual status badge for P/A/PL/E, Late, Active/Inactive
 */
export const StatusBadge = (props) => {
  return <Badge {...props} />;
};

export default StatusBadge;
