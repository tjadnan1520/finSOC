import { NavLink } from 'react-router-dom';
import { FiHome, FiDollarSign, FiArrowUpRight, FiArrowDownLeft, FiAlertCircle, FiBriefcase, FiBarChart2, FiUsers, FiFileText, FiSettings, FiGrid } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getSidebarMenu } from '../../utils/permissions';
import './Sidebar.css';

const ICON_MAP = {
  DashboardIcon: FiHome,
  TransactionIcon: FiDollarSign,
  AlertIcon: FiAlertCircle,
  CaseIcon: FiBriefcase,
  AnalyticsIcon: FiBarChart2,
  ProviderIcon: FiUsers,
  ReportIcon: FiFileText,
  SettingsIcon: FiSettings,
};

export default function Sidebar({ isOpen, onClose }) {
  const { role } = useAuth();
  const menuItems = getSidebarMenu(role);

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <nav className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-logo">
          <FiGrid size={24} className="sidebar-logo-icon" />
          <span className="sidebar-logo-text">finSOC</span>
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = ICON_MAP[item.icon] || FiHome;
            return (
              <li key={item.path} className="sidebar-menu-item">
                <NavLink
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
                  }
                  onClick={onClose}
                >
                  <Icon size={18} className="sidebar-link-icon" />
                  <span className="sidebar-link-label">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>

        <div className="sidebar-footer">
          <span className="sidebar-version">v1.0.0</span>
        </div>
      </nav>
    </>
  );
}
