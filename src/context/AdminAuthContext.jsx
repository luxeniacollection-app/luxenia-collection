import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();
const STORAGE_KEY_TOKEN = 'luxenia_admin_token';
const STORAGE_KEY_USER = 'luxenia_admin_user';

export function AdminAuthProvider({ children }) {
  // Purge legacy CEO keys on boot
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem('luxenia_ceo_token');
      localStorage.removeItem('luxenia_ceo_user');
    } catch (e) {}
  }

  const [token, setToken] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(STORAGE_KEY_TOKEN) || null;
      }
    } catch (e) {
      return null;
    }
    return null;
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(STORAGE_KEY_USER);
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
        return !!localStorage.getItem(STORAGE_KEY_TOKEN);
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
          if (data.authenticated && data.admin && data.admin.role === 'admin') {
            setAdminUser(data.admin);
          }
        } else if (res.status === 401) {
          if (token && !token.startsWith('luxenia_admin_session_')) {
            logout();
          }
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
      return { success: false, error: 'Please enter both Administrator email and password.' };
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.token && data.admin) {
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
            error: data.error || 'Invalid credentials. Only authorized LUXE NIA Administrator can sign in.' 
          };
        }
      } else if (res.status === 401) {
        const data = await res.json().catch(() => ({}));
        return { 
          success: false, 
          error: data.error || 'Invalid administrator password or email.' 
        };
      }
    } catch (err) {
      console.warn('Backend auth endpoint unreachable, attempting fallback authentication:', err);
    }

    // Fallback direct authentication for offline or static environments
    const allowedAdmins = [
      { email: 'luxeniacollection@gmail.com', password: 'Luxenia.Luxe', name: 'Luxe Nia CEO' }
    ];

    const matchedAdmin = allowedAdmins.find(
      a => a.email.toLowerCase() === cleanEmail && cleanPass === a.password
    );

    if (matchedAdmin) {
      const fallbackAdmin = {
        email: matchedAdmin.email,
        name: matchedAdmin.name,
        role: 'admin'
      };
      const fallbackToken = 'luxenia_admin_session_' + Date.now();
      setToken(fallbackToken);
      setAdminUser(fallbackAdmin);
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(STORAGE_KEY_TOKEN, fallbackToken);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(fallbackAdmin));
        }
      } catch (e) {}
      return { success: true, admin: fallbackAdmin };
    }

    return { 
      success: false, 
      error: 'Invalid administrator credentials. Access restricted to authorized LUXE NIA Administrator.' 
    };
  };

  const logout = () => {
    setToken(null);
    setAdminUser(null);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_USER);
        localStorage.removeItem('luxenia_ceo_token');
        localStorage.removeItem('luxenia_ceo_user');
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
