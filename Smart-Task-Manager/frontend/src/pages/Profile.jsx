import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '2rem' }}>My Profile</h1>
      
      <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700 }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{user.name}</h2>
            <p style={{ color: 'var(--text-muted)' }}>TaskFlow User</p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <User size={20} color="var(--text-muted)" />
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Full Name</p>
              <p style={{ fontWeight: 500 }}>{user.name}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <Mail size={20} color="var(--text-muted)" />
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Email Address</p>
              <p style={{ fontWeight: 500 }}>{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
