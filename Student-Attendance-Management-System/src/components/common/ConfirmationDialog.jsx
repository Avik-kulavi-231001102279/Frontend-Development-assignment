import React from 'react';
import { ConfirmationModal } from './ConfirmationModal';

/**
 * Attendify - Accessible Modal Confirmation Dialog
 * Direct drop-in alias for ConfirmationModal
 */
export const ConfirmationDialog = (props) => {
  return <ConfirmationModal {...props} />;
};

export default ConfirmationDialog;
