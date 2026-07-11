import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import useCases from '../hooks/useCases';
import CaseDetailsComponent from '../components/cases/CaseDetails';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import './CaseDetails.css';

export default function CaseDetails() {
  const { id } = useParams();
  const { role, user } = useAuth();
  const { getCaseDetails, assignCase, acceptCase, resolveCase, closeCase, addNote } = useCases();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCaseDetails(id);
      setCaseData(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load case details');
      setCaseData(null);
    } finally {
      setLoading(false);
    }
  }, [id, getCaseDetails]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleAssign = useCallback(async () => {
    setActionLoading(true);
    try {
      const updated = await assignCase(id, user?.id);
      setCaseData((prev) => ({ ...prev, ...updated }));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to assign case');
    } finally {
      setActionLoading(false);
    }
  }, [id, user, assignCase]);

  const handleAccept = useCallback(async () => {
    setActionLoading(true);
    try {
      const updated = await acceptCase(id);
      setCaseData((prev) => ({ ...prev, ...updated }));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to accept case');
    } finally {
      setActionLoading(false);
    }
  }, [id, acceptCase]);

  const handleResolve = useCallback(async () => {
    setActionLoading(true);
    try {
      const updated = await resolveCase(id);
      setCaseData((prev) => ({ ...prev, ...updated }));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to resolve case');
    } finally {
      setActionLoading(false);
    }
  }, [id, resolveCase]);

  const handleClose = useCallback(async () => {
    setActionLoading(true);
    try {
      await closeCase(id);
      setCaseData(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to close case');
    } finally {
      setActionLoading(false);
    }
  }, [id, closeCase]);

  const handleAddNote = useCallback(async (content) => {
    setActionLoading(true);
    try {
      const note = await addNote(id, content);
      setCaseData((prev) => ({
        ...prev,
        notes: [...(prev?.notes || []), note],
      }));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add note');
    } finally {
      setActionLoading(false);
    }
  }, [id, addNote]);

  if (loading) {
    return (
      <div className="case-details-page">
        <Loader overlay />
      </div>
    );
  }

  if (error && !caseData) {
    return (
      <div className="case-details-page">
        <div className="case-details-page-error">
          <h2>Case Not Found</h2>
          <p>{error}</p>
          <Link to="/cases">
            <Button variant="primary"><FiArrowLeft size={14} /> Back to Cases</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="case-details-page">
        <div className="case-details-page-error">
          <h2>Case Not Found</h2>
          <p>The requested case could not be found.</p>
          <Link to="/cases">
            <Button variant="primary"><FiArrowLeft size={14} /> Back to Cases</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="case-details-page">
      <div className="case-details-page-header">
        <Link to="/cases" className="case-details-page-back">
          <FiArrowLeft size={16} />
          <span>Back to Cases</span>
        </Link>
      </div>

      {error && (
        <div className="case-details-page-banner">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={() => setError(null)}>Dismiss</Button>
        </div>
      )}

      <CaseDetailsComponent
        caseData={caseData}
        userRole={role}
        onAssign={handleAssign}
        onAccept={handleAccept}
        onResolve={handleResolve}
        onClose={handleClose}
        onAddNote={handleAddNote}
      />
    </div>
  );
}
