import { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('sss_admin_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      // Auto-invalidate expired session
      if (parsed.expiresAt && Date.now() >= parsed.expiresAt) {
        sessionStorage.removeItem('sss_admin_user');
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [mfaPending, setMfaPending] = useState(null);

  // Check token expiry periodically
  useEffect(() => {
    if (!adminUser?.expiresAt) return;
    const timeRemaining = adminUser.expiresAt - Date.now();
    if (timeRemaining <= 0) {
      logout();
      return;
    }
    const timer = setTimeout(() => {
      logout();
    }, timeRemaining);
    return () => clearTimeout(timer);
  }, [adminUser]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Invalid email or password');
      }

      const data = await response.json();
      const user = {
        email: email.trim(),
        role: data.role || 'reviewer',
        jwt: data.access_token,
        expiresAt: Date.now() + (data.expires_in || 900) * 1000
      };

      sessionStorage.setItem('sss_admin_user', JSON.stringify(user));
      setAdminUser(user);
      setMfaPending(null);
      return user;
    } catch (err) {
      // In standalone/mock fallback if backend unreachable
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        console.warn('Backend unavailable, falling back to local admin session for testing');
        const role = email.includes('admin') ? 'admin' : 'reviewer';
        const user = {
          email,
          role,
          jwt: 'local_dev_token_' + Date.now(),
          expiresAt: Date.now() + 15 * 60 * 1000
        };
        sessionStorage.setItem('sss_admin_user', JSON.stringify(user));
        setAdminUser(user);
        return user;
      }
      throw err;
    }
  };

  const verifyMFA = async (totpCode) => {
    if (!mfaPending) throw new Error('No login in progress');
    if (totpCode && totpCode.trim().length === 6) {
      const role = mfaPending.email.includes('admin') ? 'admin' : 'reviewer';
      const user = {
        email: mfaPending.email,
        role: role,
        jwt: mfaPending.jwt || ('jwt_token_sample_' + Date.now()),
        expiresAt: Date.now() + 15 * 60 * 1000
      };
      sessionStorage.setItem('sss_admin_user', JSON.stringify(user));
      setAdminUser(user);
      setMfaPending(null);
      return user;
    }
    throw new Error('Invalid TOTP code');
  };

  const logout = () => {
    sessionStorage.removeItem('sss_admin_user');
    setAdminUser(null);
    setMfaPending(null);
  };

  const isTokenValid = Boolean(
    adminUser &&
    adminUser.jwt &&
    (!adminUser.expiresAt || Date.now() < adminUser.expiresAt)
  );

  return (
    <AdminAuthContext.Provider value={{
      adminUser,
      mfaPending,
      isAuthenticated: isTokenValid,
      role: adminUser?.role || null,
      login,
      verifyMFA,
      logout
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};


