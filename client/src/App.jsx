import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Buy from './pages/Buy';
import Sell from './pages/Sell';
import Help from './pages/Help';
import Login from './pages/Login';
import Register from './pages/Register';

import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import ProtectedRoute from './components/ProtectedRoute';

import AdminLayout from './components/AdminLayout';
// Using the imported actual files we will map them properly...
import AdminOverview from './pages/AdminOverview';
import AdminUserList from './pages/AdminUserList'; 
import AdminFiles from './pages/AdminFiles';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes - Separate Layout */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminSignup />} />
        
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminOverview />} />
          <Route path="users/:role" element={<AdminUserList />} />
          <Route path="files" element={<AdminFiles />} />
          {/* Mock settings page for visual completion */}
          <Route path="settings" element={<div className="section"><h2 className="section-title">Admin Settings (Coming Soon)</h2></div>} />
        </Route>

        {/* Public/Client Routes - Default Layout */}
        <Route path="/" element={
          <div className="page-container">
            <Navbar />
            <div className="main-content">
              <ProtectedRoute><Home /></ProtectedRoute>
            </div>
            <Footer />
          </div>
        } />
        
        <Route path="/login" element={
          <div className="page-container">
            <Navbar />
            <div className="main-content"><Login /></div>
            <Footer />
          </div>
        } />
        
        <Route path="/register" element={
          <div className="page-container">
            <Navbar />
            <div className="main-content"><Register /></div>
            <Footer />
          </div>
        } />

      </Routes>
    </Router>
  );
}

export default App;
