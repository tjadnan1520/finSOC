import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Loader from '../common/Loader';
import './RoleLayout.css';

export default function RoleLayout() {
  const { loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <Loader type="fullscreen" size="large" text="Loading..." />;
  }

  return (
    <div className="role-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="role-layout-main">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="role-layout-content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
