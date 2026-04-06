import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Eye, FileText, Image as ImageIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const AdminFiles = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    if (token && user?.role === 'Admin') {
      const fetchFiles = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Only keep users with uploads
          const usersWithFiles = res.data.filter(u => u.photo || u.cv);
          setUsers(usersWithFiles);
        } catch (err) {
          setError('Failed to fetch files');
        } finally {
          setLoading(false);
        }
      };
      fetchFiles();
    }
  }, [token, user]);

  if (loading) return <div className="admin-loading">Loading Files...</div>;
  if (error) return <div className="text-danger p-2">{error}</div>;

  return (
    <div className="admin-files">
      <div className="dashboard-header mb-4">
        <h2>File Management</h2>
        <p>Review uploaded shop photos, profile photos, and submitted CVs.</p>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">No files uploaded by users yet.</div>
      ) : (
        <div className="file-grid">
          {users.map((u) => (
            <div key={u._id} className="file-card">
              <div className="file-owner-info">
                <h3>{u.name}</h3>
                <small>{u.role} User &bull; Uploaded {u.createdAt ? format(parseISO(u.createdAt), 'MMM dd, yyyy') : 'N/A'}</small>
              </div>
              
              <div className="file-links">
                {u.photo && (
                  <a href={`http://localhost:5000${u.photo}`} target="_blank" rel="noreferrer" className="file-action-btn">
                    <ImageIcon size={18} />
                    <span>View {u.role === 'Sell' ? 'Shop' : 'Profile'} Photo</span>
                  </a>
                )}
                {u.cv && (
                  <a href={`http://localhost:5000${u.cv}`} target="_blank" rel="noreferrer" className="file-action-btn variant-alt">
                    <FileText size={18} />
                    <span>Download CV</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFiles;
