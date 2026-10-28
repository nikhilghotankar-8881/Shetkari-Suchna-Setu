// API Client for Shetkari Suchna Setu
import {
  MOCK_SCHEMES,
  MOCK_NOTICE_UPDATES,
  MOCK_ALERTS,
  MOCK_SOURCES,
  MOCK_REVIEW_QUEUE,
  MOCK_AUDIT_LOG
} from './mockData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const api = {
  // ── Schemes ───────────────────────────────────────────
  async getSchemes({ district, crops, search, category } = {}) {
    try {
      const query = new URLSearchParams();
      if (district) query.append('district', district);
      if (crops && crops.length) query.append('crops', crops.join(','));
      if (search) query.append('search', search);
      if (category) query.append('category', category);

      const res = await fetch(`${API_BASE}/api/v1/schemes?${query.toString()}`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      // Mock filter
      return MOCK_SCHEMES.filter(scheme => {
        const districtMatch = !district || scheme.districts.length === 0 || scheme.districts.includes(district);
        const cropMatch = !crops || crops.length === 0 || scheme.crops.length === 0 || scheme.crops.some(c => crops.includes(c));
        const categoryMatch = !category || scheme.category_mr === category || scheme.category_en === category;
        const searchMatch = !search ||
          scheme.name_mr.toLowerCase().includes(search.toLowerCase()) ||
          scheme.name_en.toLowerCase().includes(search.toLowerCase()) ||
          scheme.department_mr.toLowerCase().includes(search.toLowerCase()) ||
          scheme.department_en.toLowerCase().includes(search.toLowerCase());
        return districtMatch && cropMatch && categoryMatch && searchMatch;
      });
    }
  },

  async getSchemeById(id) {
    try {
      const res = await fetch(`${API_BASE}/api/v1/schemes/${id}`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      const numId = Number(id);
      return MOCK_SCHEMES.find(s => s.id === numId) || null;
    }
  },

  // ── Notice Updates & Change Comparison ────────────────
  async getNoticeUpdates({ district, crops, filter } = {}) {
    try {
      const query = new URLSearchParams();
      if (district) query.append('district', district);
      if (crops && crops.length) query.append('crops', crops.join(','));
      if (filter) query.append('filter', filter);

      const res = await fetch(`${API_BASE}/api/v1/notices/latest?${query.toString()}`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return MOCK_NOTICE_UPDATES.filter(u => {
        if (filter === 'CHANGED' && u.type !== 'CHANGED') return false;
        if (filter === 'NEW' && u.type !== 'NEW') return false;
        if (filter === 'NEEDS_REVIEW' && u.verification_status !== 'Needs review') return false;
        return true;
      });
    }
  },

  async getNoticeUpdateById(id) {
    try {
      const res = await fetch(`${API_BASE}/api/v1/notices/${id}`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      const numId = Number(id);
      return MOCK_NOTICE_UPDATES.find(u => u.id === numId) || null;
    }
  },

  // ── Alerts ────────────────────────────────────────────
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
      const alert = MOCK_ALERTS.find(a => a.id === alertId);
      if (alert) alert.read = true;
    }
  },

  // ── Admin Endpoints ───────────────────────────────────
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
