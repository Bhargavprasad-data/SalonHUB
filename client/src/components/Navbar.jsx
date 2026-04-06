import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <i className="fa-solid fa-scissors"></i> Salon<span>Hub</span>
      </Link>
      <ul className="nav-links">
        <li><Link to="/" className={isActive('/')}></Link></li>
        {/* <li><Link to="/buy" className={isActive('/buy')}>Buy</Link></li>
        <li><Link to="/sell" className={isActive('/sell')}>Sell</Link></li>
        <li><Link to="/help" className={isActive('/help')}>Help</Link></li> */}

        {user ? (
          <>
            <li><span style={{ color: 'white', marginRight: '1rem' }}>Hi, {user.name}</span></li>
            <li><button onClick={logout} className="btn nav-btn btn-danger" style={{ padding: '0.4rem 1rem' }}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/login" className="btn nav-btn">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
