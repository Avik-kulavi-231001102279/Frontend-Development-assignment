import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserAvatar } from '../../utils/avatar';

// Pre-seeded mock users with gender-appropriate avatar portraits
export const DEMO_USERS = [
  {
    id: 'user_001',
    name: 'Alex Morgan',
    email: 'demo@shopsphere.com',
    password: 'password123',
    avatar: getUserAvatar('Alex Morgan', 'demo@shopsphere.com'),
    phone: '+91 98765 43210',
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
    avatar: getUserAvatar('Sarah Connor', 'sarah@example.com'),
    phone: '+91 98765 98765',
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
        return rejectWithValue('Invalid password. Please check your credentials and try again.');
      }
      return {
        user: {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          avatar: foundUser.avatar || getUserAvatar(foundUser.name, foundUser.email),
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
      const rawName = normalizedEmail.split('@')[0];
      const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      return {
        user: {
          id: `user_${Date.now()}`,
          name: displayName,
          email: normalizedEmail,
          avatar: null,
          phone: '+91 98765 00000',
          address: '42 Park Street',
          city: 'Kolkata',
          state: 'West Bengal',
          pinCode: '700016',
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
    const trimmedName = name.trim();

    return {
      user: {
        id: `user_${Date.now()}`,
        name: trimmedName,
        email: normalizedEmail,
        avatar: null,
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
