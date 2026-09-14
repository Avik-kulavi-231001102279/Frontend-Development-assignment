export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validateUsername = (username) => {
  return username && username.length >= 3;
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};
