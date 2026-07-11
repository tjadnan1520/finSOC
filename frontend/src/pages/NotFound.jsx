import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';
import './NotFound.css';

export default function NotFound() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="not-found">
      <div className="not-found__content">
        <h1 className="not-found__code">404</h1>
        <p className="not-found__title">Page not found</p>
        <p className="not-found__message">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="not-found__actions">
          <Link to="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard">
              <Button variant="ghost">Go to Dashboard</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
