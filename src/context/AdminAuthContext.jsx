import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();
const STORAGE_KEY_TOKEN = 'luxenia_ceo_token';
const STORAGE_KEY_USER = 'luxenia_ceo_user';

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(STORAGE_KEY_TOKEN) || localStorage.getItem('luxenia_admin_token') || null;
      }
    } catch (e) {
      return null;
    }
    return null;
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(STORAGE_KEY_USER) || localStorage.getItem('luxenia_admin_user');
        return saved ? JSON.parse(saved) : null;
      }
    } catch (e) {
      return null;
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return !!(localStorage.getItem(STORAGE_KEY_TOKEN) || localStorage.getItem('luxenia_admin_token'));
      }
    } catch (e) {
      return false;
    }
    return false;
  });

  // Validate existing token on mount against the secure backend
  useEffect(() => {
    async function verifySession() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.admin) {
            setAdminUser(data.admin);
          } else {
            logout();
          }
        } else if (res.status === 401) {
          logout();
        }
      } catch (err) {
        console.warn('Session verification fallback in dev mode:', err);
      } finally {
        setIsLoading(false);
      }
    }

    verifySession();
  }, [token]);

  const login = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Please enter both CEO email and password.' };
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass })
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setToken(data.token);
        setAdminUser(data.admin);

        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.admin));
          }
        } catch (e) {}

        return { success: true, admin: data.admin };
      } else {
        return { 
          success: false, 
          error: data.error || 'Invalid credentials. Only authorized LUXE NIA CEO can sign in.' 
        };
      }
    } catch (err) {
      console.error('CEO Login Error:', err);
      return { 
        success: false, 
        error: 'Unable to connect to the authentication server. Please check your connection.' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setAdminUser(null);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_USER);
        localStorage.removeItem('luxenia_admin_token');
        localStorage.removeItem('luxenia_admin_user');
      }
    } catch (e) {
      // ignore
    }
  };

  const getAuthHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated: !!token,
        adminUser,
        token,
        isLoading,
        login,
        logout,
        getAuthHeaders
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
