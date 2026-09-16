import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { Sun, Moon, Bell, User } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  return (
    <header className="navbar">
      <div className="flex items-center gap-4">
        <button
          className="btn btn-outline lg:hidden"
          onClick={toggleSidebar}
          style={{ padding: '0.5rem' }}
        >
          ☰
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>TaskFlow</h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn btn-outline" onClick={toggleTheme} style={{ padding: '0.5rem', borderRadius: '50%' }}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }}>
          <Bell size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <User size={18} />
          </div>
          <span style={{ fontWeight: 500, fontSize: '0.875rem' }} className="hidden sm:block">
            {user?.name || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
