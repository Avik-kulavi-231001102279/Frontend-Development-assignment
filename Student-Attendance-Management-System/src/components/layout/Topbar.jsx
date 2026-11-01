import React from 'react';
import { Navbar } from './Navbar';

/**
 * Attendify - Topbar Component
 * Header navigation with live date, threshold compliance badge, and title
 */
export const Topbar = (props) => {
  return <Navbar {...props} />;
};

export default Topbar;
