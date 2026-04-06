import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { Search, Trash2, Eye } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const AdminUserList = () => {
  const { role } = useParams();
  const [users, setUsers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'
  const { token, user } = useContext(AuthContext);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const fetchUsers = async () => {
    setLoadingData(true);
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.filter(u => u.role === role));
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === 'Admin') {
      fetchUsers();
      setCurrentPage(1); // reset to page 1 on role change
      setSearchTerm('');
    }
  }, [token, user, role]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(users.filter(u => u._id !== id));
      } catch (err) {
        alert('Failed to delete user.');
      }
    }
  };

  // Filter & Sort Logic
  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.number && u.number.includes(term))
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const getRoleTitle = () => {
    if(role === 'Buy') return 'Buy Users';
    if(role === 'Sell') return 'Sell Users (Shop Owners)';
    if(role === 'Help') return 'Help Users';
    if(role === 'Hateres') return 'Hateres Users (Job Seekers)';
    return 'Users';
  };

  return (
    <div className="admin-user-list">
      <div className="list-header">
        <div>
          <h2>{getRoleTitle()}</h2>
          <p>Manage and monitor {role} accounts.</p>
        </div>
        <div className="list-controls">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search name, email, phone..." 
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
            />
          </div>
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        {loadingData ? <div className="p-4">Loading users...</div> : currentUsers.length === 0 ? (
          <div className="empty-state">No users found matching your criteria.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                {role === 'Sell' && <th>Shop Photo</th>}
                {role === 'Hateres' && <th>Photo</th>}
                {role === 'Hateres' && <th>CV</th>}
                <th>Registered Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((u) => (
                <tr key={u._id}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>{u.number || '-'}</td>
                  
                  {role === 'Sell' && (
                    <td>
                      {u.photo ? <a href={`http://localhost:5000${u.photo}`} target="_blank" rel="noreferrer" className="table-link"><Eye size={16}/> View Shop</a> : '-'}
                    </td>
                  )}
                  {role === 'Hateres' && (
                    <td>
                      {u.photo ? <a href={`http://localhost:5000${u.photo}`} target="_blank" rel="noreferrer" className="table-link"><Eye size={16}/> View Photo</a> : '-'}
                    </td>
                  )}
                  {role === 'Hateres' && (
                    <td>
                      {u.cv ? <a href={`http://localhost:5000${u.cv}`} target="_blank" rel="noreferrer" className="table-link"><Eye size={16}/> Download CV</a> : '-'}
                    </td>
                  )}
                  
                  <td>{u.createdAt ? format(parseISO(u.createdAt), 'MMM dd, yyyy') : '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleDelete(u._id)} className="btn-icon btn-danger" title="Delete User">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUserList;
