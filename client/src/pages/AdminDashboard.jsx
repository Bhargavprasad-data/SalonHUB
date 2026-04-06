import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const { user, token, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!token || user?.role !== 'Admin') {
         navigate('/admin/login');
         return;
      }
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        setError('Failed to fetch users');
      }
    };
    
    if (!loading && token && user?.role === 'Admin') {
        fetchUsers();
    }
  }, [token, user, navigate, loading]);

  const getUsersByRole = (role) => users.filter(u => u.role === role);

  const renderUserTable = (roleUsers, roleTitle) => {
    return (
      <div style={{ marginBottom: '3rem' }}>
        <h3>{roleTitle} ({roleUsers.length})</h3>
        {roleUsers.length === 0 ? <p>No users found in this category.</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-light)', textAlign: 'left' }}>
                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Name</th>
                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Email</th>
                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Phone Number</th>
                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Photo</th>
                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>CV</th>
              </tr>
            </thead>
            <tbody>
              {roleUsers.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{u.name}</td>
                  <td style={{ padding: '10px' }}>{u.email}</td>
                  <td style={{ padding: '10px' }}>{u.number || '-'}</td>
                  <td style={{ padding: '10px' }}>
                    {u.photo ? <a href={`http://localhost:5000${u.photo}`} target="_blank" rel="noreferrer" style={{color: 'var(--color-orange)'}}>View {u.role === 'Sell' ? 'Shop' : 'Person'}</a> : '-'}
                  </td>
                  <td style={{ padding: '10px' }}>
                    {u.cv ? <a href={`http://localhost:5000${u.cv}`} target="_blank" rel="noreferrer" style={{color: 'var(--color-orange)'}}>View CV</a> : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <div className="section" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '2rem 1rem' }}>
      <h2 className="section-title" style={{ marginBottom: '2rem' }}>Admin <span>Dashboard</span></h2>
      {loading && <p>Loading...</p>}
      {error && <div className="text-danger text-center">{error}</div>}
      
      {renderUserTable(getUsersByRole('Sell'), 'Sell Users (Shop Owners)')}
      {renderUserTable(getUsersByRole('Buy'), 'Buy Users')}
      {renderUserTable(getUsersByRole('Help'), 'Help Users')}
      {renderUserTable(getUsersByRole('Hateres'), 'Hateres Users (Job Seekers)')}
    </div>
  );
};

export default AdminDashboard;
