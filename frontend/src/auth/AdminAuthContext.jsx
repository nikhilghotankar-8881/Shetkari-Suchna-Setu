import { createContext, useContext, useState } from 'react';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('sss_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [mfaPending, setMfaPending] = useState(null);

  const login = async (email, password) => {
    // Stage 1: Email + Password validation
    // For local prototype / demo or backend connection
    if (email && password) {
      // Mock step or real backend call
      const pendingState = {
        email,
        tempToken: 'temp_mfa_token_' + Date.now()
      };
      setMfaPending(pendingState);
      return { mfaRequired: true };
    }
    throw new Error('Invalid credentials');
  };

  const verifyMFA = async (totpCode) => {
    if (!mfaPending) throw new Error('No login in progress');

    // Any valid 6-digit code passes for demo / real auth
    if (totpCode && totpCode.trim().length === 6) {
      const role = mfaPending.email.includes('admin') ? 'admin' : 'reviewer';
      const user = {
        email: mfaPending.email,
        role: role,
        jwt: 'jwt_token_sample_' + Date.now(),
        expiresAt: Date.now() + 15 * 60 * 1000 // 15 mins per authentication.md
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

  return (
    <AdminAuthContext.Provider value={{
      adminUser,
      mfaPending,
      isAuthenticated: Boolean(adminUser && adminUser.jwt),
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

