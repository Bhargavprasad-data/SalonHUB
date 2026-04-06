import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-col">
          <Link to="/" className="logo" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>
            <i className="fa-solid fa-scissors"></i> Salon<span>Hub</span>
          </Link>
          <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>
            Bringing the Indian salon industry together. Your trusted platform for managing, growing, and scaling your beauty business.
          </p>
        </div>
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li className="mb-1"><Link to="/">Home</Link></li>
            {/* <li className="mb-1"><Link to="/buy">Buy Equipment</Link></li>
            <li className="mb-1"><Link to="/sell">Sell Equipment</Link></li>
            <li className="mb-1"><Link to="/help">Community Help</Link></li> */}
          </ul>
        </div>
        <div className="footer-col">
          <h3>Contact Us</h3>
          <ul>
            <li className="mb-1" style={{ color: '#fff' }}><i className="fa-solid fa-location-dot" style={{ color: 'var(--color-orange)', marginRight: '8px' }}></i> Hyderabad, TS, India</li>
            <li className="mb-1" style={{ color: '#fff' }}><i className="fa-solid fa-envelope" style={{ color: 'var(--color-orange)', marginRight: '8px' }}></i> contact@salonhub.in</li>
            <li className="mb-1" style={{ color: '#fff' }}><i className="fa-solid fa-phone" style={{ color: 'var(--color-orange)', marginRight: '8px' }}></i> +91 98765 43210</li>
          </ul>
        </div>
      </div>
      <div className="text-center" style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#777', fontSize: '0.95rem' }}>
        <p>&copy; 2026 SalonHub – India's Salon Business Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
