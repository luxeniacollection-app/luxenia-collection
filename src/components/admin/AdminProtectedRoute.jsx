import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Crown } from 'lucide-react';

export default function AdminProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div 
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at 50% 30%, #171424 0%, #0c0c12 60%, #050508 100%)',
          color: '#fff',
          fontFamily: 'var(--font-sans)'
        }}
      >
        <div style={{ position: 'relative', width: '64px', height: '64px', marginBottom: '1.75rem' }}>
          <div 
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px solid rgba(212,175,55,0.2)',
              borderTopColor: 'var(--gold-400)',
              animation: 'spin 1s linear infinite'
            }} 
          />
          <Crown 
            size={22} 
            color="var(--gold-400)" 
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} 
          />
        </div>
        <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-300)', letterSpacing: '0.18em', fontSize: '0.92rem', textTransform: 'uppercase' }}>
          VERIFYING ADMINISTRATOR CREDENTIALS...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
}
