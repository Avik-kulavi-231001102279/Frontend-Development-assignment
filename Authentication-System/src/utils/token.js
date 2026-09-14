// Simulated JWT token generation
export const generateSimulatedToken = (user) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ 
    id: user.id, 
    username: user.username, 
    iat: Date.now(),
    exp: Date.now() + 3600000 // 1 hour expiration for simulation
  }));
  const signature = btoa("simulated_signature");
  
  return `${header}.${payload}.${signature}`;
};

export const decodeSimulatedToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch (error) {
    return null;
  }
};

export const isTokenValid = (token) => {
  const decoded = decodeSimulatedToken(token);
  if (!decoded) return false;
  return decoded.exp > Date.now();
};
