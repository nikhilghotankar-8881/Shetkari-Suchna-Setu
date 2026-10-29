import { createContext, useContext, useState, useEffect } from 'react';

const FarmerTokenContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

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
    let savedProfile = null;
    let savedToken = token;

    const payload = {
      district: profileData.district || 'Pune',
      taluka: profileData.taluka || '',
      crops: profileData.crops || [],
      lang: profileData.lang || 'mr'
    };

    try {
      if (token) {
        // Profile update
        const res = await fetch(`${API_BASE}/api/v1/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          savedProfile = {
            ...profileData,
            ...data
          };
        }
      } else {
        // Initial registration - server generates 256-bit token
        const res = await fetch(`${API_BASE}/api/v1/profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          savedToken = data.token;
          savedProfile = {
            ...profileData,
            ...data
          };
        }
      }
    } catch (err) {
      console.warn('Backend profile sync failed, saving in offline-first mode:', err);
    }

    // Fallback if offline / backend unreachable
    if (!savedToken) {
      savedToken = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0')).join('');
    }
    if (!savedProfile) {
      savedProfile = {
        ...profileData,
        id: profile?.id || crypto.randomUUID(),
        created_at: profile?.created_at || new Date().toISOString(),
        last_seen_at: new Date().toISOString()
      };
    }

    localStorage.setItem('sss_farmer_token', savedToken);
    localStorage.setItem('sss_farmer_profile', JSON.stringify(savedProfile));
    setTokenState(savedToken);
    setProfileState(savedProfile);
    return savedProfile;
  };

  const deleteProfile = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE}/api/v1/profile`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch((err) => {
          console.warn('Backend profile deletion offline fallback:', err);
        });
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

