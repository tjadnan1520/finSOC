'use strict';

const EVIDENCE_CATEGORIES = [
  'RECONCILIATION',
  'AUDIT_TRAIL',
  'COMPLIANCE',
  'PROVIDER_REPORT',
  'TRANSACTION_LOG',
  'USER_REPORT',
  'SYSTEM_ALERT',
  'MANUAL_REVIEW',
];

function categorizeEvidence(evidence) {
  if (!evidence || typeof evidence !== 'object') return 'UNKNOWN';

  const type = (evidence.type || evidence.evidenceType || '').toUpperCase();
  const source = (evidence.source || '').toUpperCase();

  for (const category of EVIDENCE_CATEGORIES) {
    if (type.includes(category) || source.includes(category)) return category;
  }

  if (type.includes('BANK') || type.includes('RECONCIL')) return 'RECONCILIATION';
  if (type.includes('AUDIT') || type.includes('TRAIL')) return 'AUDIT_TRAIL';
  if (type.includes('COMPLIANCE') || type.includes('REGULATORY')) return 'COMPLIANCE';
  if (type.includes('PROVIDER') || source.includes('PROVIDER')) return 'PROVIDER_REPORT';
  if (type.includes('TRANSACTION') || type.includes('TX')) return 'TRANSACTION_LOG';
  if (type.includes('USER') || source.includes('USER')) return 'USER_REPORT';
  if (type.includes('ALERT') || type.includes('SYSTEM')) return 'SYSTEM_ALERT';
  if (type.includes('MANUAL') || type.includes('REVIEW')) return 'MANUAL_REVIEW';

  return 'UNKNOWN';
}

function normalizeEvidence(evidence) {
  if (!evidence || typeof evidence !== 'object') {
    return {
      id: null,
      type: 'UNKNOWN',
      source: 'UNKNOWN',
      category: 'UNKNOWN',
      timestamp: null,
      description: '',
      metadata: {},
      confidence: 0,
    };
  }

  const normalized = {
    id: evidence.id || evidence.evidenceId || null,
    type: evidence.type || evidence.evidenceType || 'UNKNOWN',
    source: evidence.source || evidence.origin || 'UNKNOWN',
    category: categorizeEvidence(evidence),
    timestamp: evidence.timestamp || evidence.date || evidence.createdAt || null,
    description: evidence.description || evidence.summary || evidence.note || '',
    metadata: evidence.metadata || evidence.details || {},
    confidence: (() => {
      const c = Number(evidence.confidence);
      return isNaN(c) ? 0 : Math.min(100, Math.max(0, c));
    })(),
  };

  return normalized;
}

function prepareEvidenceSummary(evidenceArray) {
  if (!Array.isArray(evidenceArray) || evidenceArray.length === 0) {
    return { total: 0, categories: {}, timeline: [], keyFindings: [] };
  }

  const normalized = evidenceArray.map(e => normalizeEvidence(e));
  const total = normalized.length;

  const categories = {};
  for (const ev of normalized) {
    const cat = ev.category || 'UNKNOWN';
    categories[cat] = (categories[cat] || 0) + 1;
  }

  const timeline = normalized
    .filter(e => e.timestamp)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .map(e => ({ timestamp: e.timestamp, type: e.type, category: e.category }));

  const highConfidence = normalized.filter(e => e.confidence >= 80);
  const anomalies = normalized.filter(e => e.type === 'SYSTEM_ALERT' || e.category === 'SYSTEM_ALERT');
  const reconciliations = normalized.filter(e => e.category === 'RECONCILIATION');

  const keyFindings = [];
  if (highConfidence.length > 0) {
    keyFindings.push(`${highConfidence.length} high-confidence evidence item(s) identified.`);
  }
  if (anomalies.length > 0) {
    keyFindings.push(`${anomalies.length} system alert(s) found requiring attention.`);
  }
  if (reconciliations.length > 0) {
    keyFindings.push(`${reconciliations.length} reconciliation record(s) available for verification.`);
  }
  if (total > 0 && keyFindings.length === 0) {
    keyFindings.push(`${total} evidence item(s) processed. No significant findings.`);
  }

  return { total, categories, timeline, keyFindings };
}

module.exports = { prepareEvidenceSummary, categorizeEvidence, normalizeEvidence };
