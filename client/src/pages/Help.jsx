import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Help = () => {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeContactId, setActiveContactId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { user, token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    userName: user ? user.name : '',
    phone: '',
    email: user ? user.email : '',
    location: '',
    problemDescription: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/help');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert('Please login to post a request');

    const submitData = new FormData();
    submitData.append('userName', formData.userName);
    submitData.append('phone', formData.phone);
    submitData.append('email', formData.email);
    submitData.append('location', formData.location);
    submitData.append('problemDescription', formData.problemDescription);
    if (imageFile) {
      submitData.append('photo', imageFile);
    }

    try {
      let response;
      if (editingId) {
        response = await axios.put(`http://localhost:5000/api/help/${editingId}`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(requests.map(req => req._id === editingId ? response.data : req));
        setSuccessMsg('Help request updated successfully!');
      } else {
        response = await axios.post('http://localhost:5000/api/help', submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests([response.data, ...requests]);
        setSuccessMsg('Help request submitted successfully!');
      }

      setShowForm(false);
      setEditingId(null);
      setTimeout(() => setSuccessMsg(''), 3000);
      setFormData({ userName: user ? user.name : '', phone: '', email: user ? user.email : '', location: '', problemDescription: '' });
      setImageFile(null);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || (editingId ? 'Failed to update request' : 'Failed to post request'));
      setTimeout(() => setErrorMsg(''), 3000);
      console.error(err);
    }
  };

  const handleEdit = (req) => {
    setEditingId(req._id);
    setFormData({
      userName: req.userName,
      phone: req.phone,
      email: req.email,
      location: req.location,
      problemDescription: req.problemDescription
    });
    setImageFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/help/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.filter(req => req._id !== id));
      setSuccessMsg('Request deleted successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg('Failed to delete request');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  return (
    <>
      <div className="page-header" style={{
        background: `linear-gradient(rgba(22, 22, 22, 0.75), rgba(22, 22, 22, 0.85)), url('/salon.png') center/cover`,
        color: '#fff',
        padding: '5rem 2rem',
        textAlign: 'center'
      }}>
        <h1>Community <span>Help</span></h1>
        <p>Connect with other salon owners, share problems, and get solutions.</p>
      </div>

      <section className="section">
        <div className="text-center mb-2">
          <button
            className="btn btn-primary"
            onClick={() => {
              if (!user) {
                setErrorMsg('Please login first to add a request.');
                setTimeout(() => setErrorMsg(''), 3000);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
              }
              if (showForm) {
                setShowForm(false);
                setEditingId(null);
                setFormData({ userName: user.name, phone: '', email: user.email, location: '', problemDescription: '' });
              } else {
                setShowForm(true);
              }
            }}
          >
            {showForm ? 'Cancel' : 'Add a Request'}
          </button>
        </div>

        {successMsg && (
          <div style={{ background: '#d4edda', color: '#155724', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center', border: '1px solid #c3e6cb' }}>
            <i className="fa-solid fa-circle-check"></i> {successMsg}
          </div>
        )}

        {errorMsg && (
          <div style={{ background: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center', border: '1px solid #f5c6cb' }}>
            <i className="fa-solid fa-circle-exclamation"></i> {errorMsg}
          </div>
        )}

        {showForm && (
          <div className="form-container" style={{ marginTop: '0', borderTop: 'none', background: '#f9f9f9', border: '1px solid #ddd' }}>
            <h3 className="mb-1" style={{ color: 'var(--color-black)' }}>{editingId ? 'Edit Request' : 'Post a Request'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name</label>
                <input type="text" className="form-control" value={formData.userName} onChange={(e) => setFormData({ ...formData, userName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Upload Profile Image</label>
                <input type="file" className="form-control" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" className="form-control" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" className="form-control" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Describe your problem</label>
                <textarea className="form-control" rows="4" value={formData.problemDescription} onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })} required></textarea>
              </div>
              <button type="submit" className="btn btn-secondary">{editingId ? 'Update Request' : 'Submit Request'}</button>
            </form>
          </div>
        )}

        <div className="grid-container" style={{ marginTop: '3rem' }}>
          {requests.map((req) => {
            const imageUrl = req.photo ? (req.photo.startsWith('http') ? req.photo : `http://localhost:5000${req.photo}`) : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150';
            return (
              <div key={req._id} className="card help-card" style={{ borderLeft: '5px solid var(--color-orange)', textAlign: 'left', padding: '2rem' }}>
                <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #eee' }}>
                  <img src={imageUrl} alt={req.userName} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-gold)' }} />
                  <div className="user-details">
                    <h4 style={{ fontSize: '1.2rem', color: 'var(--color-black)' }}>{req.userName}</h4>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', color: 'var(--color-black)', marginBottom: '0.8rem', fontSize: '0.95rem' }}>
                  <i className="fa-solid fa-location-dot" style={{ color: 'var(--color-orange)', width: '20px' }}></i> {req.location}
                </div>

                <div style={{ background: '#fff4ea', padding: '1.5rem', borderRadius: '8px', margin: '1.5rem 0', fontStyle: 'italic', borderLeft: '4px solid var(--color-black)', color: '#333' }}>
                  <i className="fa-solid fa-quote-left" style={{ color: '#ff6600', marginRight: '8px' }}></i>
                  {req.problemDescription}
                </div>

                {activeContactId === req._id ? (
                  <div style={{ marginTop: '1rem', background: '#f5f5f5', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--color-black)' }}><i className="fa-solid fa-envelope" style={{ color: 'var(--color-orange)', width: '20px' }}></i> {req.email}</p>
                    <p style={{ margin: '0', fontSize: '0.9rem', color: 'var(--color-black)' }}><i className="fa-solid fa-phone" style={{ color: 'var(--color-orange)', width: '20px' }}></i> {req.phone}</p>
                    <button className="btn btn-outline" style={{ width: '100%', marginTop: '1rem', borderColor: '#ccc', color: '#666', padding: '0.4rem' }} onClick={() => setActiveContactId(null)}>Close Details</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setActiveContactId(req._id)}><i className="fa-solid fa-comment-dots"></i> Contact Customer</button>
                    {user && user.email === req.email && (
                      <>
                        <button className="btn btn-secondary" style={{ padding: '0.6rem 1rem' }} onClick={() => handleEdit(req)} title="Edit Request">
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button className="btn btn-danger" style={{ padding: '0.6rem 1rem' }} onClick={() => handleDelete(req._id)} title="Delete Request">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {requests.length === 0 && <p className="text-center" style={{ gridColumn: '1 / -1' }}>No help requests found. Be the first to ask!</p>}
        </div>
      </section>
    </>
  );
};

export default Help;
