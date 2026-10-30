import { createAsyncThunk } from '@reduxjs/toolkit';

// Pre-seeded mock users for instant testing
export const DEMO_USERS = [
  {
    id: 'user_001',
    name: 'Alex Morgan',
    email: 'demo@shopsphere.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Suite 101',
    city: 'Springfield',
    state: 'Oregon',
    pinCode: '97477',
  },
  {
    id: 'user_002',
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 987-6543',
    address: '10880 Wilshire Boulevard',
    city: 'Los Angeles',
    state: 'California',
    pinCode: '90024',
  },
];

/**
 * Async Thunk to simulate user login
 */
export const simulateLogin = createAsyncThunk(
  'auth/simulateLogin',
  async ({ email, password, rememberMe = true }, { rejectWithValue }) => {
    // Simulate brief network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const normalizedEmail = (email || '').trim().toLowerCase();
    const foundUser = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (foundUser) {
      if (foundUser.password !== password) {
        return rejectWithValue('Invalid password. For demo, use: password123');
      }
      return {
        user: {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          avatar: foundUser.avatar,
          phone: foundUser.phone,
          address: foundUser.address,
          city: foundUser.city,
          state: foundUser.state,
          pinCode: foundUser.pinCode,
        },
        token: `mock_jwt_token_${Date.now()}`,
        rememberMe,
      };
    }

    // Allow custom registered email or fallback user creation if password is reasonable
    if (password && password.length >= 6) {
      const name = normalizedEmail.split('@')[0];
      return {
        user: {
          id: `user_${Date.now()}`,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          email: normalizedEmail,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${normalizedEmail}`,
          phone: '+1 (555) 000-0000',
          address: '123 Market Street',
          city: 'San Francisco',
          state: 'California',
          pinCode: '94105',
        },
        token: `mock_jwt_token_${Date.now()}`,
        rememberMe,
      };
    }

    return rejectWithValue('Invalid credentials. Password must be at least 6 characters.');
  }
);

/**
 * Async Thunk to simulate user registration
 */
export const simulateRegistration = createAsyncThunk(
  'auth/simulateRegistration',
  async ({ name, email, password }, { rejectWithValue }) => {
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (!name || name.trim().length < 2) {
      return rejectWithValue('Full name must be at least 2 characters.');
    }
    if (!email || !email.includes('@')) {
      return rejectWithValue('Please enter a valid email address.');
    }
    if (!password || password.length < 6) {
      return rejectWithValue('Password must be at least 6 characters.');
    }

    const normalizedEmail = email.trim().toLowerCase();

    return {
      user: {
        id: `user_${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${normalizedEmail}`,
        phone: '',
        address: '',
        city: '',
        state: '',
        pinCode: '',
      },
      token: `mock_jwt_token_${Date.now()}`,
      rememberMe: true,
    };
  }
);
