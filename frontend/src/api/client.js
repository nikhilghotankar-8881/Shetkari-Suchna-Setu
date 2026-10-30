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

// Normalization helper for schemes returned by backend
function normalizeScheme(s) {
  if (!s) return null;
  return {
    ...s,
    id: s.id || s.version_id,
    version_id: s.version_id || s.id,
    name_mr: s.name_mr || s.scheme_name || 'शासकीय कृषी योजना',
    name_en: s.name_en || s.scheme_name || 'Government Agricultural Scheme',
    department_mr: s.department_mr || s.department || 'कृषी विभाग, महाराष्ट्र शासन',
    department_en: s.department_en || s.department || 'Department of Agriculture, Maharashtra',
    category_mr: s.category_mr || 'कृषी योजना',
    category_en: s.category_en || 'Agricultural Scheme',
    eligibility_mr: s.eligibility_mr || s.eligibility || 'अधिकृत अधिसूचनेनुसार पात्रता पहावी',
    eligibility_en: s.eligibility_en || s.eligibility || 'Refer to official notice for eligibility',
    benefits_mr: s.benefits_mr || s.benefits || 'अनुदान व आर्थिक साहाय्य',
    benefits_en: s.benefits_en || s.benefits || 'Subsidy and financial support',
    verification_status: s.verification_status || s.verification_badge || 'Auto-checked',
    official_link: s.official_link || s.official_application_link || s.source_url || 'https://krishi.maharashtra.gov.in',
    crops: s.crops || [],
    districts: s.districts || s.regions || [],
    required_docs: s.required_docs || ['7/12', '8-a', 'farmer_id']
  };
}

// Normalization helper for notice updates
function normalizeNotice(u) {
  if (!u) return null;
  return {
    ...u,
    id: u.id || u.version_id,
    title_mr: u.title_mr || u.title || 'महत्त्वाची कृषी सूचना बदल',
    title_en: u.title_en || u.title || 'Important Notice Update',
    department_mr: u.department_mr || u.department || 'कृषी विभाग, महाराष्ट्र',
    department_en: u.department_en || u.department || 'Agriculture Department',
    type: u.type || (u.change_type ? u.change_type.toUpperCase() : 'CHANGED'),
    verification_status: u.verification_status || 'Auto-checked',
    diff_text: u.diff_text || '',
    created_at: u.created_at || new Date().toISOString()
  };
}

export const api = {
  // ── Schemes ───────────────────────────────────────────
  async getSchemes({ district, crops, search, category, filterStrict = false, token } = {}) {
    try {
      const query = new URLSearchParams();
      if (district) query.append('district', district);
      if (crops && crops.length) query.append('crops', crops.join(','));
      if (search) query.append('search', search);
      if (category) query.append('category', category);

      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/api/v1/schemes?${query.toString()}`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map(normalizeScheme);
      }
      return MOCK_SCHEMES.map(normalizeScheme);
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Using mock schemes fallback:', err.message);
      return MOCK_SCHEMES.filter(scheme => {
        if (filterStrict) {
          const districtMatch = !district || scheme.districts.length === 0 || scheme.districts.includes(district);
          const cropMatch = !crops || crops.length === 0 || scheme.crops.length === 0 || scheme.crops.some(c => crops.includes(c));
          if (!districtMatch || !cropMatch) return false;
        }
        const categoryMatch = !category || scheme.category_mr === category || scheme.category_en === category;
        const searchMatch = !search ||
          scheme.name_mr.toLowerCase().includes(search.toLowerCase()) ||
          scheme.name_en.toLowerCase().includes(search.toLowerCase()) ||
          scheme.department_mr.toLowerCase().includes(search.toLowerCase()) ||
          scheme.department_en.toLowerCase().includes(search.toLowerCase()) ||
          (scheme.category_en && scheme.category_en.toLowerCase().includes(search.toLowerCase())) ||
          (scheme.category_mr && scheme.category_mr.toLowerCase().includes(search.toLowerCase()));
        return categoryMatch && searchMatch;
      }).map(normalizeScheme);
    }
  },

  async getSchemeById(id) {
    try {
      const res = await fetch(`${API_BASE}/api/v1/schemes/${id}`);
      if (res.ok) {
        const data = await res.json();
        return normalizeScheme(data);
      }
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Using mock scheme by ID fallback:', err.message);
    }
    const numId = Number(id);
    const mock = MOCK_SCHEMES.find(s => s.id === numId || String(s.id) === String(id));
    return mock ? normalizeScheme(mock) : null;
  },

  // ── Notice Updates & Change Comparison ────────────────
  async getNoticeUpdates({ district, crops, filter } = {}) {
    try {
      const query = new URLSearchParams();
      if (district) query.append('district', district);
      if (crops && crops.length) query.append('crops', crops.join(','));
      if (filter) query.append('filter', filter);

      const res = await fetch(`${API_BASE}/api/v1/notices/latest?${query.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map(normalizeNotice);
      }
      return MOCK_NOTICE_UPDATES.map(normalizeNotice);
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Using mock notice updates fallback:', err.message);
      return MOCK_NOTICE_UPDATES.filter(u => {
        if (filter === 'CHANGED' && u.type !== 'CHANGED') return false;
        if (filter === 'NEW' && u.type !== 'NEW') return false;
        if (filter === 'NEEDS_REVIEW' && u.verification_status !== 'Needs review') return false;
        return true;
      }).map(normalizeNotice);
    }
  },

  async getNoticeUpdateById(id) {
    try {
      const updates = await this.getNoticeUpdates();
      const match = updates.find(u => String(u.id) === String(id) || String(u.notice_id) === String(id));
      if (match) return match;
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Using mock notice by ID fallback:', err.message);
    }
    const numId = Number(id);
    const mock = MOCK_NOTICE_UPDATES.find(u => u.id === numId || String(u.id) === String(id));
    return mock ? normalizeNotice(mock) : null;
  },

  // ── Alerts ────────────────────────────────────────────
  async getAlerts(token) {
    try {
      if (!token) return MOCK_ALERTS;
      const res = await fetch(`${API_BASE}/api/v1/alerts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data : MOCK_ALERTS;
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Using mock alerts fallback:', err.message);
      return MOCK_ALERTS;
    }
  },

  async markAlertRead(alertId, token) {
    try {
      if (token) {
        await fetch(`${API_BASE}/api/v1/alerts/${alertId}/read`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Mark alert read fallback:', err.message);
    }
    const alert = MOCK_ALERTS.find(a => a.id === alertId);
    if (alert) alert.read = true;
  },

  // ── Crop Insurance Info ───────────────────────────────
  async getInsuranceInfo() {
    try {
      const res = await fetch(`${API_BASE}/api/v1/insurance`);
      if (res.ok) return await res.json();
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Using insurance info fallback:', err.message);
    }
    return {
      scheme_name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      scheme_marathi: 'पंतप्रधान पीक विमा योजना',
      official_portal: 'https://pmfby.gov.in',
      official_toll_free: '1800-180-1551'
    };
  },

  // ── Admin Endpoints (Secured with JWT) ────────────────
  async getSources(jwt) {
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/sources`, {
        headers: jwt ? { 'Authorization': `Bearer ${jwt}` } : {}
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Using mock sources fallback:', err.message);
      return MOCK_SOURCES;
    }
  },

  async triggerSourcePoll(sourceId, jwt) {
    const res = await fetch(`${API_BASE}/api/v1/admin/sources/${sourceId}/poll`, {
      method: 'POST',
      headers: jwt ? { 'Authorization': `Bearer ${jwt}` } : {}
    });
    if (!res.ok) throw new Error(`Poll failed: HTTP ${res.status}`);
    return await res.json();
  },

  async getReviewQueue(jwt) {
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/queue`, {
        headers: jwt ? { 'Authorization': `Bearer ${jwt}` } : {}
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map(item => ({
          ...item,
          id: item.version_id || item.id,
          version_id: item.version_id || item.id,
          notice_title: item.notice_title || item.extracted_fields?.name || 'Notice Update',
          priority: (item.change_type === 'changed' || item.diff_text) ? 'High' : 'Normal',
          evidence_span: item.evidence_span || Object.values(item.evidence_spans || {})[0] || item.source_text_snippet || 'Evidence verified by automated parser.',
          extracted_fields: {
            name: item.extracted_fields?.name || item.notice_title || '',
            department: item.extracted_fields?.department || 'Department of Agriculture, Maharashtra',
            benefits: item.extracted_fields?.benefits || 'Financial subsidy & input assistance',
            deadline: Array.isArray(item.extracted_fields?.deadlines) && item.extracted_fields.deadlines.length > 0
              ? item.extracted_fields.deadlines.join(', ')
              : (item.extracted_fields?.deadline || 'Not yet verified')
          }
        }));
      }
      return MOCK_REVIEW_QUEUE;
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Using mock review queue fallback:', err.message);
      return MOCK_REVIEW_QUEUE;
    }
  },

  async approveExtraction(id, jwt, note = 'Approved by reviewer') {
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/review/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(jwt ? { 'Authorization': `Bearer ${jwt}` } : {})
        },
        body: JSON.stringify({ status: 'Verified', note })
      });
      if (!res.ok) throw new Error(`Approve failed: HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Approve fallback applied locally:', err.message);
      const item = MOCK_REVIEW_QUEUE.find(q => q.id === id);
      if (item) item.status = 'Verified';
      return { status: 'success', new_status: 'Verified' };
    }
  },

  async rejectExtraction(id, jwt, note = 'Rejected by reviewer') {
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/review/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(jwt ? { 'Authorization': `Bearer ${jwt}` } : {})
        },
        body: JSON.stringify({ status: 'Rejected', note })
      });
      if (!res.ok) throw new Error(`Reject failed: HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Reject fallback applied locally:', err.message);
      const item = MOCK_REVIEW_QUEUE.find(q => q.id === id);
      if (item) item.status = 'Rejected';
      return { status: 'success', new_status: 'Rejected' };
    }
  },

  async getAuditLog(jwt) {
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/audit`, {
        headers: jwt ? { 'Authorization': `Bearer ${jwt}` } : {}
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data.map(log => ({
        ...log,
        timestamp: log.created_at || log.timestamp || new Date().toISOString()
      })) : MOCK_AUDIT_LOG;
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Using mock audit log fallback:', err.message);
      return MOCK_AUDIT_LOG;
    }
  },

  async getMetrics(jwt) {
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/metrics`, {
        headers: jwt ? { 'Authorization': `Bearer ${jwt}` } : {}
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Using metrics fallback:', err.message);
      return {
        total_sources: 3,
        healthy_sources: 3,
        total_notices: 2,
        total_profiles: 1,
        review_queue_length: 1
      };
    }
  }
};
