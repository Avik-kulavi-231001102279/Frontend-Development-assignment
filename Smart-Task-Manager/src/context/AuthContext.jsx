import React, { createContext } from 'react';

export const AuthContext = createContext();

// No login/register needed — always provide a default user
const defaultUser = {
  _id: 'local-user',
  name: 'User',
  email: 'user@taskflow.local',
};

export const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{ user: defaultUser }}>
      {children}
    </AuthContext.Provider>
  );
};
