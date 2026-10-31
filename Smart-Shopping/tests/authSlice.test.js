import { describe, it, expect } from 'vitest';
import authReducer, {
  logout,
  updateProfile,
  clearAuthError,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from '../src/features/auth/authSlice';
import { simulateLogin, simulateRegistration } from '../src/features/auth/authThunks';

describe('authSlice reducer and selectors', () => {
  const initialTestState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  const sampleUser = {
    id: 'user_001',
    name: 'Alex Morgan',
    email: 'demo@shopsphere.com',
  };

  it('should return initial auth state', () => {
    const state = authReducer(undefined, { type: 'unknown' });
    expect(state).toHaveProperty('isAuthenticated');
  });

  it('should handle simulateLogin pending, fulfilled, rejected', () => {
    // 1. Pending
    const pendingState = authReducer(
      initialTestState,
      simulateLogin.pending('req_1', { email: 'demo@shopsphere.com', password: '123' })
    );
    expect(pendingState.loading).toBe(true);
    expect(pendingState.error).toBeNull();

    // 2. Fulfilled
    const fulfilledState = authReducer(
      pendingState,
      simulateLogin.fulfilled(
        { user: sampleUser, token: 'mock_jwt_123', rememberMe: true },
        'req_1',
        { email: 'demo@shopsphere.com', password: '123' }
      )
    );
    expect(fulfilledState.loading).toBe(false);
    expect(fulfilledState.isAuthenticated).toBe(true);
    expect(fulfilledState.user.name).toBe('Alex Morgan');
    expect(fulfilledState.token).toBe('mock_jwt_123');

    // 3. Rejected
    const rejectedState = authReducer(
      pendingState,
      simulateLogin.rejected(null, 'req_1', null, 'Invalid credentials')
    );
    expect(rejectedState.loading).toBe(false);
    expect(rejectedState.isAuthenticated).toBe(false);
    expect(rejectedState.error).toBe('Invalid credentials');
  });

  it('should handle logout action and clear credentials', () => {
    const loggedInState = {
      user: sampleUser,
      token: 'mock_jwt_123',
      isAuthenticated: true,
      loading: false,
      error: null,
    };

    const nextState = authReducer(loggedInState, logout());
    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.user).toBeNull();
    expect(nextState.token).toBeNull();
  });

  it('should handle updateProfile action', () => {
    const loggedInState = {
      user: sampleUser,
      token: 'mock_jwt_123',
      isAuthenticated: true,
      loading: false,
      error: null,
    };

    const updatedState = authReducer(
      loggedInState,
      updateProfile({ phone: '+1 555 123 4567', city: 'Seattle' })
    );

    expect(updatedState.user.phone).toBe('+1 555 123 4567');
    expect(updatedState.user.city).toBe('Seattle');
    expect(updatedState.user.name).toBe('Alex Morgan');
  });

  it('should handle clearAuthError action', () => {
    const errorState = {
      ...initialTestState,
      error: 'Some error message',
    };
    const clearedState = authReducer(errorState, clearAuthError());
    expect(clearedState.error).toBeNull();
  });

  it('should handle simulateRegistration pending, fulfilled, rejected', () => {
    const pending = authReducer(
      initialTestState,
      simulateRegistration.pending('req_2', { name: 'New User', email: 'new@example.com' })
    );
    expect(pending.loading).toBe(true);

    const fulfilled = authReducer(
      pending,
      simulateRegistration.fulfilled(
        { user: { id: 'user_new', name: 'New User' }, token: 'new_token' },
        'req_2',
        { name: 'New User' }
      )
    );
    expect(fulfilled.loading).toBe(false);
    expect(fulfilled.isAuthenticated).toBe(true);
    expect(fulfilled.user.name).toBe('New User');

    const rejected = authReducer(
      pending,
      simulateRegistration.rejected(null, 'req_2', null, 'Registration failed')
    );
    expect(rejected.loading).toBe(false);
    expect(rejected.error).toBe('Registration failed');
  });

  it('should test auth selectors correctly', () => {
    const rootState = {
      auth: {
        user: sampleUser,
        token: 'token_abc',
        isAuthenticated: true,
        loading: false,
        error: null,
      },
    };

    expect(selectCurrentUser(rootState)).toEqual(sampleUser);
    expect(selectIsAuthenticated(rootState)).toBe(true);
    expect(selectAuthLoading(rootState)).toBe(false);
    expect(selectAuthError(rootState)).toBeNull();
  });
});
