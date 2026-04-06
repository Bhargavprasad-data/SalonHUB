import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Buy');
  const [number, setNumber] = useState('');
  const [photo, setPhoto] = useState(null);
  const [cv, setCv] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', role);

      if (['Buy', 'Help', 'Sell', 'Hateres'].includes(role)) {
          formData.append('number', number);
      }
      if (['Sell', 'Hateres'].includes(role) && photo) {
          formData.append('photo', photo);
      }
      if (role === 'Hateres' && cv) {
          formData.append('cv', cv);
      }

      const res = await axios.post('http://localhost:5000/api/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccess('Successfully registered! Redirecting...');
      setError('');
      
      // Auto login user using token returned from registration
      if (res.data.token) {
        login(res.data.token, res.data.user);
      }
      
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      setSuccess('');
    }
  };

  return (
    <div className="form-container">
      <h2 className="section-title" style={{ marginBottom: '2rem' }}>Join <span>SalonHub</span></h2>
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
        
        <div className="form-group">
          <label>Role</label>
          <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="Buy">Buy</option>
            <option value="Help">Help</option>
            <option value="Sell">Sell</option>
            <option value="Hateres">Hateres</option>
          </select>
        </div>

        {['Buy', 'Help', 'Sell', 'Hateres'].includes(role) && (
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" className="form-control" value={number} onChange={(e) => setNumber(e.target.value)} required />
          </div>
        )}

        {['Sell', 'Hateres'].includes(role) && (
          <div className="form-group">
            <label>Photo {role === 'Sell' ? '(Shop)' : '(Person)'}</label>
            <input type="file" className="form-control" onChange={(e) => setPhoto(e.target.files[0])} required />
          </div>
        )}

        {role === 'Hateres' && (
          <div className="form-group">
            <label>CV</label>
            <input type="file" className="form-control" onChange={(e) => setCv(e.target.files[0])} required />
          </div>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
      </form>
      <p className="text-center" style={{ marginTop: '1.5rem' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--color-orange)' }}>Login</Link>
      </p>
    </div>
  );
};

export default Register;
