export const calculatePasswordStrength = (password) => {
  if (!password) return { label: '', color: 'transparent' };
  
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score < 3) return { label: 'Weak', color: '#ff4d4f' };
  if (score < 5) return { label: 'Medium', color: '#faad14' };
  return { label: 'Strong', color: '#52c41a' };
};
