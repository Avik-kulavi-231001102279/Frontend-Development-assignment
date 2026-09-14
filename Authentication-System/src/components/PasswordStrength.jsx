import React from 'react';
import { calculatePasswordStrength } from '../utils/passwordStrength';

const PasswordStrength = ({ password }) => {
  const strength = calculatePasswordStrength(password);
  
  if (!password) return null;

  return (
    <div className="password-strength-container">
      <div className="strength-bar-container">
        <div 
          className={`strength-bar ${strength.label.toLowerCase()}`}
          style={{ 
            backgroundColor: strength.color,
            width: strength.label === 'Weak' ? '33%' : strength.label === 'Medium' ? '66%' : '100%'
          }}
        ></div>
      </div>
      <p className="strength-text" style={{ color: strength.color }}>
        Password Strength: {strength.label}
      </p>
    </div>
  );
};

export default PasswordStrength;
