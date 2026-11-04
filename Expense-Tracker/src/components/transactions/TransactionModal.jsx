import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../common/Modal';
import TransactionForm from './TransactionForm';
import {
  addTransactionAsync,
  updateTransactionAsync,
} from '../../features/transactions/transactionSlice';

export const TransactionModal = ({
  isOpen,
  onClose,
  transactionToEdit = null,
}) => {
  const dispatch = useDispatch();
  const txStatus = useSelector((state) => state.transactions.status);
  const isSubmitting = txStatus === 'loading';

  const handleFormSubmit = async (formData) => {
    if (transactionToEdit) {
      await dispatch(
        updateTransactionAsync({
          ...formData,
          id: transactionToEdit.id,
        })
      );
    } else {
      await dispatch(addTransactionAsync(formData));
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transactionToEdit ? 'Edit Transaction' : 'Add New Transaction'}
      subtitle={
        transactionToEdit
          ? 'Modify your transaction details below'
          : 'Record a new income or expense in your ledger'
      }
      maxWidth="max-w-lg"
    >
      <TransactionForm
        initialData={transactionToEdit}
        onSubmit={handleFormSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
};

export default TransactionModal;

