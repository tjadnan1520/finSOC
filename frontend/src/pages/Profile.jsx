import { useState, useCallback } from 'react';
import { FiMail, FiPhone, FiMapPin, FiCalendar, FiClock, FiShield, FiEdit2, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';
import { ROLES } from '../utils/constants';
import './Profile.css';

function formatDate(date) {
  if (!date) return '—';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

function formatDateTime(date) {
  if (!date) return '—';
  try {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

function getRoleBadgeClass(role) {
  switch (role) {
    case ROLES.OPERATOR: return 'profile-role-badge--operator';
    case ROLES.MANAGEMENT: return 'profile-role-badge--management';
    case ROLES.AGENT: return 'profile-role-badge--agent';
    default: return '';
  }
}

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Profile() {
  const { user, role } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = useCallback((e) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }, [currentPassword, newPassword, confirmPassword]);

  if (!user) {
    return (
      <div className="profile-page">
        <Loader overlay />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1 className="profile-title">Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {getInitials(user.name)}
            </div>
            <div className="profile-avatar-info">
              <h2 className="profile-name">{user.name || 'User'}</h2>
              <span className={`profile-role-badge ${getRoleBadgeClass(role)}`}>
                {role || 'Unknown'}
              </span>
            </div>
          </div>

          <div className="profile-details-grid">
            <div className="profile-detail-item">
              <FiMail size={16} className="profile-detail-icon" />
              <div className="profile-detail-content">
                <span className="profile-detail-label">Email</span>
                <span className="profile-detail-value">{user.email || '—'}</span>
              </div>
            </div>

            <div className="profile-detail-item">
              <FiPhone size={16} className="profile-detail-icon" />
              <div className="profile-detail-content">
                <span className="profile-detail-label">Phone</span>
                <span className="profile-detail-value">{user.phone || '—'}</span>
              </div>
            </div>

            <div className="profile-detail-item">
              <FiMapPin size={16} className="profile-detail-icon" />
              <div className="profile-detail-content">
                <span className="profile-detail-label">Area</span>
                <span className="profile-detail-value">{user.area || user.region || '—'}</span>
              </div>
            </div>

            <div className="profile-detail-item">
              <FiShield size={16} className="profile-detail-icon" />
              <div className="profile-detail-content">
                <span className="profile-detail-label">Role</span>
                <span className="profile-detail-value">{role || '—'}</span>
              </div>
            </div>

            <div className="profile-detail-item">
              <FiClock size={16} className="profile-detail-icon" />
              <div className="profile-detail-content">
                <span className="profile-detail-label">Last Login</span>
                <span className="profile-detail-value">{formatDateTime(user.lastLogin)}</span>
              </div>
            </div>

            <div className="profile-detail-item">
              <FiCalendar size={16} className="profile-detail-icon" />
              <div className="profile-detail-content">
                <span className="profile-detail-label">Member Since</span>
                <span className="profile-detail-value">{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <h3 className="profile-card-title">Account Information</h3>
          </div>
          <div className="profile-account-info">
            <div className="profile-info-row">
              <span className="profile-info-label">User ID</span>
              <span className="profile-info-value">{user.id || '—'}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Username</span>
              <span className="profile-info-value">{user.username || user.name || '—'}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Email Verified</span>
              <span className="profile-info-value">
                {user.emailVerified ? (
                  <span className="profile-verified">Verified</span>
                ) : (
                  <span className="profile-not-verified">Not Verified</span>
                )}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Account Status</span>
              <span className="profile-info-value">
                <span className={`profile-status-badge profile-status-badge--${(user.status || 'active').toLowerCase()}`}>
                  {user.status || 'Active'}
                </span>
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Member Since</span>
              <span className="profile-info-value">{formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <h3 className="profile-card-title">Change Password</h3>
          </div>
          <form className="profile-password-form" onSubmit={handlePasswordChange}>
            <div className="profile-password-field">
              <Input
                label="Current Password"
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                icon={
                  <button
                    type="button"
                    className="profile-password-toggle"
                    onClick={() => setShowCurrent((v) => !v)}
                    tabIndex={-1}
                  >
                    {showCurrent ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                }
              />
            </div>
            <div className="profile-password-field">
              <Input
                label="New Password"
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={
                  <button
                    type="button"
                    className="profile-password-toggle"
                    onClick={() => setShowNew((v) => !v)}
                    tabIndex={-1}
                  >
                    {showNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                }
              />
            </div>
            <div className="profile-password-field">
              <Input
                label="Confirm New Password"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={
                  <button
                    type="button"
                    className="profile-password-toggle"
                    onClick={() => setShowConfirm((v) => !v)}
                    tabIndex={-1}
                  >
                    {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                }
              />
            </div>

            {passwordError && (
              <p className="profile-password-error">{passwordError}</p>
            )}

            <div className="profile-password-actions">
              <Button type="submit" variant="primary" size="sm">
                <FiSave size={14} /> Update Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
