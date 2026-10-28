import { createContext, useContext, useState, useEffect } from 'react';

const FarmerTokenContext = createContext();

export const FarmerTokenProvider = ({ children }) => {
  const [profile, setProfileState] = useState(() => {
    try {
      const saved = localStorage.getItem('sss_farmer_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setTokenState] = useState(() => {
    return localStorage.getItem('sss_farmer_token') || null;
  });

  const saveProfile = async (profileData) => {
    // Generate UUID and token if not present
    const profileId = profile?.id || crypto.randomUUID();
    const generatedToken = token || Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0')).join('');

    const newProfile = {
      ...profileData,
      id: profileId,
      created_at: profile?.created_at || new Date().toISOString(),
      last_seen_at: new Date().toISOString()
    };

    try {
      // Attempt backend sync if running
      await fetch('/api/v1/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${generatedToken}`
        },
        body: JSON.stringify(newProfile)
      }).catch(() => {
        // Fallback for standalone/offline demo
      });
    } catch {
      // Ignore network errors in demo/mock mode
    }

    localStorage.setItem('sss_farmer_token', generatedToken);
    localStorage.setItem('sss_farmer_profile', JSON.stringify(newProfile));
    setTokenState(generatedToken);
    setProfileState(newProfile);
    return newProfile;
  };

  const deleteProfile = async () => {
    try {
      if (token) {
        await fetch('/api/v1/profile', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(() => {});
      }
    } finally {
      localStorage.removeItem('sss_farmer_token');
      localStorage.removeItem('sss_farmer_profile');
      setTokenState(null);
      setProfileState(null);
    }
  };

  return (
    <FarmerTokenContext.Provider value={{
      profile,
      token,
      hasProfile: Boolean(profile && token),
      saveProfile,
      deleteProfile
    }}>
      {children}
    </FarmerTokenContext.Provider>
  );
};

export const useFarmerToken = () => {
  const context = useContext(FarmerTokenContext);
  if (!context) {
    throw new Error('useFarmerToken must be used within FarmerTokenProvider');
  }
  return context;
};

