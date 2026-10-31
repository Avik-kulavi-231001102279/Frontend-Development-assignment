import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  logout,
  updateProfile,
  clearAuthError,
} from '../features/auth/authSlice';
import { simulateLogin, simulateRegistration } from '../features/auth/authThunks';
import { removeFromStorage, STORAGE_KEYS } from '../utils/localStorage';

/**
 * Convenient Authentication Hook encapsulating auth state and methods
 */
export const useAuth = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: (credentials) => dispatch(simulateLogin(credentials)),
    register: (details) => dispatch(simulateRegistration(details)),
    signOut: () => {
      dispatch(logout());
      removeFromStorage(STORAGE_KEYS.AUTH);
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem(STORAGE_KEYS.AUTH);
        sessionStorage.removeItem('token');
      } catch {
        // Safe fallback
      }
    },
    editProfile: (data) => dispatch(updateProfile(data)),
    resetAuthError: () => dispatch(clearAuthError()),
  };
};

export default useAuth;
