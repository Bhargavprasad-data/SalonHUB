import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/register', { name, email, password });
      
      setSuccess('Successfully registered as Admin! Please login.');
      setError('');
      setTimeout(() => navigate('/admin/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      setSuccess('');
    }
  };

  return (
    <div className="form-container">
      <h2 className="section-title" style={{ marginBottom: '2rem' }}><span>Admin</span> Signup</h2>
      {error && <div className="text-danger text-center mb-1">{error}</div>}
      {success && <div className="text-success text-center mb-1" style={{ color: 'var(--color-green, #28a745)' }}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register Admin</button>
      </form>
      <p className="text-center" style={{ marginTop: '1.5rem' }}>
        Already an admin? <Link to="/admin/login" style={{ color: 'var(--color-orange)' }}>Login</Link>
      </p>
    </div>
  );
};

export default AdminSignup;
