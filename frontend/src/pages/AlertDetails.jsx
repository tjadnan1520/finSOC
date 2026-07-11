import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';
import useAlerts from '../hooks/useAlerts';
import { ROLES } from '../utils/constants';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import AlertDetailsComponent from '../components/alerts/AlertDetails';
import './AlertDetails.css';

export default function AlertDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const { getAlertDetails, assignAlert, resolveAlert, closeAlert } = useAlerts();

  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getAlertDetails(id)
      .then((data) => setAlert(data))
      .catch((err) => setError(err.response?.data?.message || err.message || 'Failed to load alert details'))
      .finally(() => setLoading(false));
  }, [id, getAlertDetails]);

  const handleBack = () => navigate('/alerts');

  const handleAssign = async () => {
    if (!alert) return;
    setActionLoading(true);
    try {
      const updated = await assignAlert(alert.id, null);
      setAlert((prev) => ({ ...prev, ...updated }));
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!alert) return;
    setActionLoading(true);
    try {
      const updated = await resolveAlert(alert.id);
      setAlert((prev) => ({ ...prev, ...updated }));
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = async () => {
    if (!alert) return;
    setActionLoading(true);
    try {
      await closeAlert(alert.id);
      navigate('/alerts');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="alert-details-page">
      <div className="alert-details-page__header">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <FiArrowLeft size={16} /> Back to Alerts
        </Button>
        <h1 className="alert-details-page__title">Alert Details</h1>
      </div>

      {loading && (
        <div className="alert-details-page__loader">
          <Loader size="lg" />
        </div>
      )}

      {error && !loading && (
        <div className="alert-details-page__error">
          <FiAlertTriangle size={40} />
          <p>Failed to load alert</p>
          <span>{error}</span>
          <div className="alert-details-page__error-actions">
            <Button variant="primary" onClick={handleBack}>Back to Alerts</Button>
            <Button variant="ghost" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      )}

      {!loading && !error && !alert && (
        <div className="alert-details-page__not-found">
          <FiAlertTriangle size={40} />
          <p>Alert not found</p>
          <span>The alert you are looking for does not exist or has been removed.</span>
          <Button variant="primary" onClick={handleBack}>Back to Alerts</Button>
        </div>
      )}

      {!loading && !error && alert && (
        <div className="alert-details-page__content">
          <AlertDetailsComponent
            alert={alert}
            userRole={role}
            onAssign={handleAssign}
            onResolve={handleResolve}
            onClose={handleClose}
          />
          {actionLoading && <Loader overlay />}
        </div>
      )}
    </div>
  );
}
