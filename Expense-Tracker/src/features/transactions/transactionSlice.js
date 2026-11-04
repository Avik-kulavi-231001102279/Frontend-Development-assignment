import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storageService } from '../../services/storageService';
import { v4 as uuidv4 } from 'uuid';

// Async Thunks for LocalStorage persistence with realistic async simulation
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const data = storageService.getTransactions();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch transactions');
    }
  }
);

export const addTransactionAsync = createAsyncThunk(
  'transactions/addTransactionAsync',
  async (transactionData, { getState, rejectWithValue }) => {
    try {
      const { transactions } = getState().transactions;

      // Validate required fields
      if (!transactionData.title || !transactionData.title.trim()) {
        throw new Error('Transaction title is required.');
      }
      if (!transactionData.amount || Number(transactionData.amount) <= 0) {
        throw new Error('Amount must be greater than zero.');
      }
      if (!transactionData.type) {
        throw new Error('Transaction type is required.');
      }
      if (!transactionData.category) {
        throw new Error('Category is required.');
      }
      if (!transactionData.date) {
        throw new Error('Date is required.');
      }

      // Check unique ID
      const newTransaction = {
        id: transactionData.id || uuidv4(),
        title: transactionData.title.trim(),
        amount: Number(transactionData.amount),
        type: transactionData.type,
        category: transactionData.category,
        date: transactionData.date,
        paymentMethod: transactionData.paymentMethod || 'Other',
        description: (transactionData.description || '').trim(),
        createdAt: new Date().toISOString(),
      };

      // Prevent duplicate ID if by chance one already exists
      if (transactions.some((t) => t.id === newTransaction.id)) {
        newTransaction.id = uuidv4();
      }

      const updated = [newTransaction, ...transactions];
      storageService.setTransactions(updated);
      return newTransaction;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add transaction');
    }
  }
);

export const updateTransactionAsync = createAsyncThunk(
  'transactions/updateTransactionAsync',
  async (updatedTx, { getState, rejectWithValue }) => {
    try {
      if (!updatedTx.id) {
        throw new Error('Transaction ID is required for updating.');
      }
      if (!updatedTx.title || !updatedTx.title.trim()) {
        throw new Error('Transaction title is required.');
      }
      if (!updatedTx.amount || Number(updatedTx.amount) <= 0) {
        throw new Error('Amount must be greater than zero.');
      }

      const { transactions } = getState().transactions;
      const index = transactions.findIndex((t) => t.id === updatedTx.id);
      if (index === -1) {
        throw new Error('Transaction not found.');
      }

      const cleanTx = {
        ...transactions[index],
        ...updatedTx,
        title: updatedTx.title.trim(),
        amount: Number(updatedTx.amount),
        description: (updatedTx.description || '').trim(),
        updatedAt: new Date().toISOString(),
      };

      const updatedList = transactions.map((t) => (t.id === cleanTx.id ? cleanTx : t));
      storageService.setTransactions(updatedList);
      return cleanTx;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update transaction');
    }
  }
);

export const deleteTransactionAsync = createAsyncThunk(
  'transactions/deleteTransactionAsync',
  async (transactionId, { getState, rejectWithValue }) => {
    try {
      const { transactions } = getState().transactions;
      const updatedList = transactions.filter((t) => t.id !== transactionId);
      storageService.setTransactions(updatedList);
      return transactionId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete transaction');
    }
  }
);

export const clearAllTransactionsAsync = createAsyncThunk(
  'transactions/clearAllTransactionsAsync',
  async (_, { rejectWithValue }) => {
    try {
      storageService.clearTransactions();
      return [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to clear transactions');
    }
  }
);

export const loadSampleTransactionsAsync = createAsyncThunk(
  'transactions/loadSampleTransactionsAsync',
  async (_, { rejectWithValue }) => {
    try {
      const sample = storageService.getSampleTransactions();
      storageService.setTransactions(sample);
      return sample;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load sample transactions');
    }
  }
);

const initialState = {
  transactions: storageService.getTransactions() || [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  lastActionMessage: null,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransactionStatus: (state) => {
      state.status = 'idle';
      state.error = null;
      state.lastActionMessage = null;
    },
    // Direct sync reducer if needed
    setTransactionsDirect: (state, action) => {
      state.transactions = action.payload;
      storageService.setTransactions(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactions = action.payload;
        state.error = null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add
      .addCase(addTransactionAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addTransactionAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactions.unshift(action.payload);
        state.lastActionMessage = 'Transaction added successfully!';
      })
      .addCase(addTransactionAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update
      .addCase(updateTransactionAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateTransactionAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.transactions.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
        state.lastActionMessage = 'Transaction updated successfully!';
      })
      .addCase(updateTransactionAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteTransactionAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteTransactionAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactions = state.transactions.filter((t) => t.id !== action.payload);
        state.lastActionMessage = 'Transaction deleted successfully!';
      })
      .addCase(deleteTransactionAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Clear All
      .addCase(clearAllTransactionsAsync.fulfilled, (state) => {
        state.status = 'succeeded';
        state.transactions = [];
        state.lastActionMessage = 'All transactions cleared!';
      })
      // Load sample
      .addCase(loadSampleTransactionsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactions = action.payload;
        state.lastActionMessage = 'Sample transactions loaded!';
      });
  },
});

export const { clearTransactionStatus, setTransactionsDirect } = transactionSlice.actions;
export default transactionSlice.reducer;

