import { useNavigate } from 'react-router-dom';
import { FiShield, FiActivity, FiPieChart, FiFolder } from 'react-icons/fi';
import Button from '../components/common/Button';
import './Home.css';

const PROVIDERS = ['bKash', 'Nagad', 'Rocket'];

const FEATURES = [
  { icon: <FiActivity size={24} />, title: 'Real-time Monitoring', desc: 'Track financial operations across all providers in real time with live dashboards and instant updates.' },
  { icon: <FiShield size={24} />, title: 'AI Recommendations', desc: 'Intelligent suggestions powered by machine learning to optimize liquidity and detect anomalies.' },
  { icon: <FiPieChart size={24} />, title: 'Risk Analysis', desc: 'Advanced risk scoring and predictive analytics to identify potential issues before they escalate.' },
  { icon: <FiFolder size={24} />, title: 'Case Management', desc: 'End-to-end case lifecycle management with automated workflows and evidence tracking.' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <section className="home__hero">
        <div className="home__hero-bg" />
        <div className="home__hero-content">
          <h1 className="home__app-name">finSOC</h1>
          <p className="home__tagline">AI-Powered Financial Operations Decision Intelligence Platform</p>
          <p className="home__description">
            Empower your financial operations with real-time intelligence, predictive analytics, and automated decision support. Monitor transactions, detect anomalies, and manage cases across bKash, Nagad, and Rocket.
          </p>
          <div className="home__providers">
            <span className="home__providers-label">Supported Providers</span>
            <div className="home__provider-badges">
              {PROVIDERS.map((p) => (
                <span key={p} className="home__provider-badge">{p}</span>
              ))}
            </div>
          </div>
          <div className="home__actions">
            <Button size="lg" onClick={() => navigate('/login')}>
              Sign In to Dashboard
            </Button>
          </div>
        </div>
      </section>

      <section className="home__features">
        <h2 className="home__features-title">Platform Capabilities</h2>
        <div className="home__features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="home__feature-card">
              <div className="home__feature-icon">{f.icon}</div>
              <h3 className="home__feature-title">{f.title}</h3>
              <p className="home__feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="home__footer">
        <p>&copy; {new Date().getFullYear()} finSOC. All rights reserved.</p>
      </footer>
    </div>
  );
}
