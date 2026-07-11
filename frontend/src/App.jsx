import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './router';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import './styles/globals.css';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <DashboardProvider>
            <NotificationProvider>
              <AppRoutes />
              <Toaster position="top-right" />
            </NotificationProvider>
          </DashboardProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
