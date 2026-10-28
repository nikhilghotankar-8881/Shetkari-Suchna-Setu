// API Client for Shetkari Suchna Setu
import {
  MOCK_SCHEMES,
  MOCK_UPDATES,
  MOCK_ALERTS,
  MOCK_SOURCES,
  MOCK_REVIEW_QUEUE,
  MOCK_AUDIT_LOG
} from './mockData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const api = {
  // Public & Farmer endpoints
  async getSchemes(district, crops) {
    try {
      const query = new URLSearchParams();
      if (district) query.append('district', district);
      if (crops && crops.length) query.append('crops', crops.join(','));
      
      const res = await fetch(`${API_BASE}/api/v1/schemes?${query.toString()}`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      // Filter mock schemes based on district & crop
      return MOCK_SCHEMES.filter(scheme => {
        const districtMatch = !district || scheme.districts.length === 0 || scheme.districts.includes(district);
        const cropMatch = !crops || crops.length === 0 || scheme.crops.length === 0 || scheme.crops.some(c => crops.includes(c));
        return districtMatch && cropMatch;
      });
    }
  },

  async getLatestUpdates(district, crops) {
    try {
      const query = new URLSearchParams();
      if (district) query.append('district', district);
      if (crops && crops.length) query.append('crops', crops.join(','));
      
      const res = await fetch(`${API_BASE}/api/v1/notices/latest?${query.toString()}`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return MOCK_UPDATES;
    }
  },

  async getAlerts(token) {
    try {
      const res = await fetch(`${API_BASE}/api/v1/alerts`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return MOCK_ALERTS;
    }
  },

  async markAlertRead(alertId, token) {
    try {
      await fetch(`${API_BASE}/api/v1/alerts/${alertId}/read`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
    } catch {
      // Mock update
      const alert = MOCK_ALERTS.find(a => a.id === alertId);
      if (alert) alert.read = true;
    }
  },

  // Admin endpoints (JWT secured)
  async getSources(jwt) {
    try {
      const res = await fetch(`${API_BASE}/admin/sources`, {
        headers: { 'Authorization': `Bearer ${jwt}` }
      });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return MOCK_SOURCES;
    }
  },

  async getReviewQueue(jwt) {
    try {
      const res = await fetch(`${API_BASE}/admin/queue`, {
        headers: { 'Authorization': `Bearer ${jwt}` }
      });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return MOCK_REVIEW_QUEUE;
    }
  },

  async approveExtraction(id, jwt) {
    try {
      await fetch(`${API_BASE}/admin/versions/${id}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${jwt}` }
      });
    } catch {
      // Local mock state
      const item = MOCK_REVIEW_QUEUE.find(q => q.id === id);
      if (item) item.status = 'Verified';
    }
  },

  async getAuditLog(jwt) {
    try {
      const res = await fetch(`${API_BASE}/admin/audit`, {
        headers: { 'Authorization': `Bearer ${jwt}` }
      });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return MOCK_AUDIT_LOG;
    }
  }
};

