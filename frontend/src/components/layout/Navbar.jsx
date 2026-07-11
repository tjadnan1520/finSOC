import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiSearch, FiBell, FiChevronDown, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transactions',
  '/alerts': 'Alerts',
  '/cases': 'Cases',
  '/assignments': 'Assignments',
  '/analytics': 'Analytics',
  '/providers': 'Providers',
  '/reports': 'Reports',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const pageTitle = Object.entries(PAGE_TITLES).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] || 'finSOC';

  const unreadCount = 0;

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.name || user?.email || 'User';
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const userRole = typeof user?.role === 'object' ? user?.role?.name || '' : user?.role || '';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="navbar-hamburger" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <FiMenu size={22} />
        </button>
        <h1 className="navbar-title">{pageTitle}</h1>
      </div>

      <div className="navbar-right">
        <div className="navbar-search">
          <FiSearch size={16} className="navbar-search-icon" />
          <input type="text" placeholder="Search..." className="navbar-search-input" />
        </div>

        <button className="navbar-notification" aria-label="Notifications">
          <FiBell size={20} />
          {unreadCount > 0 && <span className="navbar-badge">{unreadCount}</span>}
        </button>

        <div className="navbar-profile" ref={dropdownRef}>
          <button
            className="navbar-profile-btn"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <div className="navbar-avatar">{avatarLetter}</div>
            <div className="navbar-user-info">
              <span className="navbar-user-name">{displayName}</span>
              <span className="navbar-user-role">{userRole}</span>
            </div>
            <FiChevronDown size={16} className={`navbar-chevron ${dropdownOpen ? 'navbar-chevron--open' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="navbar-dropdown">
              <button className="navbar-dropdown-item" onClick={() => { navigate('/profile'); setDropdownOpen(false); }}>
                <FiUser size={16} />
                Profile
              </button>
              <div className="navbar-dropdown-divider" />
              <button className="navbar-dropdown-item navbar-dropdown-item--danger" onClick={logout}>
                <FiLogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
