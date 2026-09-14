import { v4 as uuidv4 } from 'uuid';
import { generateSimulatedToken, isTokenValid } from '../utils/token';

const USERS_KEY = 'registeredUsers';
const CURRENT_USER_KEY = 'currentUser';
const AUTH_TOKEN_KEY = 'authToken';
const REMEMBER_USER_KEY = 'rememberUser';

export const authService = {
  getRegisteredUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  registerUser(userData) {
    const users = this.getRegisteredUsers();
    
    // Check if username or email already exists
    if (users.some(u => u.username === userData.username)) {
      throw new Error('Username already exists');
    }
    if (users.some(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: uuidv4(),
      ...userData
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
  },

  login(username, password, rememberMe) {
    const users = this.getRegisteredUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      throw new Error('Invalid username or password');
    }

    const token = generateSimulatedToken(user);
    
    // Store user data
    const userToStore = { id: user.id, username: user.username, fullName: user.fullName };
    
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToStore));
    localStorage.setItem(REMEMBER_USER_KEY, JSON.stringify(rememberMe));

    return { user: userToStore, token };
  },

  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(REMEMBER_USER_KEY);
  },

  getCurrentUser() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const user = localStorage.getItem(CURRENT_USER_KEY);
    const rememberMe = JSON.parse(localStorage.getItem(REMEMBER_USER_KEY) || 'false');

    if (!token || !user) return null;

    if (!isTokenValid(token)) {
      this.logout();
      return null;
    }

    // In a real app with session storage for non-remembered users, 
    // we would handle the persistence difference differently. 
    // Here we simulate it by trusting the localStorage if token is valid.

    return JSON.parse(user);
  },
  
  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },
  
  initSessionStorageHandling() {
     // A simple way to handle "Remember me" in simulated environments:
     // If the user didn't check "Remember me", we could clear local storage on browser close.
     // However, doing this reliably across all browsers with JS is tricky.
     // For this assignment, checking the token is usually sufficient, 
     // but we can also use sessionStorage as an alternative for token storage if rememberMe is false.
     // To keep things simple and unified as requested by the prompt (Local Storage prerequisite), 
     // we'll stick to LocalStorage and rely on the token expiration/manual logout.
  }
};
