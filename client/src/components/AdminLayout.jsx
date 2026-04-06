import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, ShoppingCart, Headset, HardHat, FileBox, Settings, LogOut, Bell, Search, User as UserIcon } from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Buy Users', path: '/admin/users/Buy', icon: <ShoppingCart size={20} /> },
    { name: 'Sell Users', path: '/admin/users/Sell', icon: <HardHat size={20} /> },
    { name: 'Help Users', path: '/admin/users/Help', icon: <Headset size={20} /> },
    { name: 'Hateres Users', path: '/admin/users/Hateres', icon: <Users size={20} /> },
    // { name: 'Analytics', path: '/admin/analytics', icon: <PieChart size={20} /> }, // Integrated into Overview
    { name: 'File Management', path: '/admin/files', icon: <FileBox size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>Salon<span>Hub</span> Admin</h2>
        </div>
        <nav className="admin-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="admin-logout">
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-topbar">
          <div className="search-bar">
            <Search size={20} color="#888" />
            <input type="text" placeholder="Search..." />
          </div>
          <div className="topbar-actions">
            <button className="icon-btn"><Bell size={24} /></button>
            <div className="admin-profile">
              <UserIcon size={32} />
              <div className="profile-info">
                <span>{user?.name || 'Admin'}</span>
                <small>Administrator</small>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
