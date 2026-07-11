import { Routes, Route, Navigate } from 'react-router-dom';
import RoleLayout from './components/layout/RoleLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { useAuth } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Alerts from './pages/Alerts';
import AlertDetails from './pages/AlertDetails';
import Cases from './pages/Cases';
import CaseDetails from './pages/CaseDetails';
import Analytics from './pages/Analytics';
import Providers from './pages/Providers';
import Profile from './pages/Profile';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route path="/404" element={<NotFound />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/alerts/:id" element={<AlertDetails />} />
          <Route
            element={<ProtectedRoute allowedRoles={['OPERATOR', 'MANAGEMENT']} />}
          >
            <Route path="/cases" element={<Cases />} />
            <Route path="/cases/:id" element={<CaseDetails />} />
          </Route>
          <Route
            element={<ProtectedRoute allowedRoles={['MANAGEMENT', 'OPERATOR']} />}
          >
            <Route path="/analytics" element={<Analytics />} />
          </Route>
          <Route path="/providers" element={<Providers />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
