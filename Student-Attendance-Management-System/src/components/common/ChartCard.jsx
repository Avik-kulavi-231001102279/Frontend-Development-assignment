import React from 'react';
import { Card } from './Card';
import { EmptyState } from './EmptyState';
import { BarChart3 } from 'lucide-react';

/**
 * Attendify - Reusable wrapper for Recharts with header actions and empty states
 */
export const ChartCard = ({
  title,
  icon = BarChart3,
  actions,
  children,
  hasData = true,
  emptyMessage = 'No chart data available for the selected filters.',
  height = 320,
}) => {
  return (
    <Card title={title} icon={icon} actions={actions}>
      {hasData ? (
        <div style={{ width: '100%', height: `${height}px`, marginTop: '0.75rem' }}>
          {children}
        </div>
      ) : (
        <EmptyState
          title="No Data to Display"
          description={emptyMessage}
          compact
        />
      )}
    </Card>
  );
};

export default ChartCard;
