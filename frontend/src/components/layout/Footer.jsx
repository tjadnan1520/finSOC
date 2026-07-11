import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer-text">
        &copy; {year} <strong>finSOC</strong> <span className="footer-separator">|</span> v1.0.0
      </p>
    </footer>
  );
}
