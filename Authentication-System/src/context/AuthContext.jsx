import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on mount
    const user = authService.getCurrentUser();
    const currentToken = authService.getToken();
    
    if (user && currentToken) {
      setCurrentUser(user);
      setToken(currentToken);
    }
    
    setLoading(false);
  }, []);

  const login = (username, password, rememberMe) => {
    try {
      const { user, token } = authService.login(username, password, rememberMe);
      setCurrentUser(user);
      setToken(token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = (userData) => {
    try {
      authService.registerUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setToken(null);
  };

  const value = {
    currentUser,
    token,
    isAuthenticated: !!currentUser && !!token,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
