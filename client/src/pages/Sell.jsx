import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Sell = () => {
  const [listings, setListings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeContactId, setActiveContactId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { user, token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    itemType: 'sell',
    displayName: '',
    displayOwner: user ? user.name : '',
    phone: '',
    email: user ? user.email : '',
    location: '',
    description: '',
    price: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const [buyRes, sellRes] = await Promise.all([
        axios.get('http://localhost:5000/api/buy'),
        axios.get('http://localhost:5000/api/sell')
      ]);

      const buyItems = buyRes.data.map(item => ({
        ...item,
        itemType: 'buy',
        displayName: item.productName,
        displayOwner: item.sellerName
      }));

      const sellItems = sellRes.data.map(item => ({
        ...item,
        itemType: 'sell',
        displayName: item.shopName,
        displayOwner: item.ownerName
      }));

      const combined = [...buyItems, ...sellItems].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setListings(combined);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert('Please login to post a listing');

    const isBuy = formData.itemType === 'buy';
    const submitData = new FormData();
    submitData.append(isBuy ? 'productName' : 'shopName', formData.displayName);
    submitData.append(isBuy ? 'sellerName' : 'ownerName', formData.displayOwner);
    submitData.append('phone', formData.phone);
    submitData.append('email', formData.email);
    submitData.append('location', formData.location);
    submitData.append('price', formData.price);
    if (!isBuy) {
      submitData.append('description', formData.description);
    }
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      let response;
      const endpointURL = `http://localhost:5000/api/${formData.itemType}`;
      
      if (editingId) {
        response = await axios.put(`${endpointURL}/${editingId}`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const updatedItem = {
          ...response.data,
          itemType: formData.itemType,
          displayName: isBuy ? response.data.productName : response.data.shopName,
          displayOwner: isBuy ? response.data.sellerName : response.data.ownerName
        };
        setListings(listings.map(item => item._id === editingId ? updatedItem : item));
        setSuccessMsg('Listing updated successfully!');
      } else {
        response = await axios.post(endpointURL, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const newItem = {
          ...response.data,
          itemType: formData.itemType,
          displayName: isBuy ? response.data.productName : response.data.shopName,
          displayOwner: isBuy ? response.data.sellerName : response.data.ownerName
        };
        setListings([newItem, ...listings]);
        setSuccessMsg(`${isBuy ? 'Product' : 'Shop'} listed successfully!`);
      }

      setShowForm(false);
      setEditingId(null);
      setTimeout(() => setSuccessMsg(''), 3000);
      setFormData({ itemType: 'sell', displayName: '', displayOwner: user ? user.name : '', phone: '', email: user ? user.email : '', location: '', description: '', price: '' });
      setImageFile(null);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || (editingId ? 'Failed to update listing' : 'Failed to post listing'));
      setTimeout(() => setErrorMsg(''), 3000);
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      itemType: item.itemType,
      displayName: item.displayName,
      displayOwner: item.displayOwner,
      phone: item.phone,
      email: item.email,
      location: item.location,
      description: item.description || '',
      price: item.price
    });
    setImageFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/${item.itemType}/${item._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setListings(listings.filter(l => l._id !== item._id));
      setSuccessMsg('Listing deleted successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg('Failed to delete listing');
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
        <h1>Sell <span>Equipment & Shops</span></h1>
        <p>List your salon equipment, products, or complete shop setup for sale to potential buyers.</p>
      </div>

      <section className="section">
        <div className="text-center mb-2">
          <button 
            className="btn btn-primary" 
            onClick={() => {
              if (!user) {
                setErrorMsg('Please login first to post a listing.');
                setTimeout(() => setErrorMsg(''), 3000);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
              }
              if (showForm) {
                setShowForm(false);
                setEditingId(null);
                setFormData({ itemType: 'sell', displayName: '', displayOwner: user.name, phone: '', email: user.email, location: '', description: '', price: '' });
              } else {
                setShowForm(true);
              }
            }}
          >
            {showForm ? 'Cancel' : 'Post a Listing'}
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
          <div className="form-container" style={{ marginTop: '0', borderTop: 'none', background: '#f9f9f9', border: '1px solid #ddd', maxWidth: '800px' }}>
            <h3 className="mb-1" style={{color: 'var(--color-black)'}}>{editingId ? 'Edit Listing' : 'Create Listing'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              
              <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: '0' }}>
                <label>Listing Type</label>
                <select className="form-control" value={formData.itemType} onChange={(e) => setFormData({...formData, itemType: e.target.value})} disabled={!!editingId}>
                  <option value="sell">Salon Shop setup / Equipment Bundle</option>
                  <option value="buy">Individual Product</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>{formData.itemType === 'buy' ? 'Product Name' : 'Shop Name'}</label>
                <input type="text" className="form-control" value={formData.displayName} onChange={(e) => setFormData({...formData, displayName: e.target.value})} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>{formData.itemType === 'buy' ? 'Seller Name' : 'Owner Name'}</label>
                <input type="text" className="form-control" value={formData.displayOwner} onChange={(e) => setFormData({...formData, displayOwner: e.target.value})} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Price (₹)</label>
                <input type="number" className="form-control" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Upload Image</label>
                <input type="file" className="form-control" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Email Address</label>
                <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Location</label>
                <input type="text" className="form-control" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label>Phone Number</label>
                <input type="text" className="form-control" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
              </div>
              
              {formData.itemType === 'sell' && (
                <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: '0' }}>
                  <label>Description</label>
                  <textarea className="form-control" rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required></textarea>
                </div>
              )}

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <button type="submit" className="btn btn-secondary">{editingId ? 'Update Listing' : 'Submit Listing'}</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid-container" style={{ marginTop: '3rem' }}>
          {listings.map((item) => {
            const imageUrl = item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`) : 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500';
            return (
            <div key={`${item.itemType}-${item._id}`} className="card" style={{ padding: '0', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <div style={{ overflow: 'hidden' }}>
                <img src={imageUrl} alt={item.displayName} style={{ width: '100%', height: '240px', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
              </div>
              <div style={{ padding: '2rem', flex: '1', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem' }}>{item.displayName}</h3>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', background: item.itemType === 'sell' ? 'var(--color-gold)' : '#eee', color: item.itemType === 'sell' ? '#fff' : '#666', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
                    {item.itemType === 'sell' ? 'Shop' : 'Product'}
                  </span>
                </div>
                
                {item.itemType === 'sell' && <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>{item.description}</p>}
                
                <div style={{ fontSize: '1.6rem', color: 'var(--color-black)', fontWeight: '700', marginBottom: '1.5rem', marginTop: item.itemType === 'buy' ? '1rem' : '0', background: '#fdfaf2', padding: '0.5rem 1rem', borderRadius: '8px', display: 'inline-block', borderLeft: '4px solid var(--color-gold)' }}>
                  ₹{item.price.toLocaleString()}
                </div>
                
                <div style={{ marginTop: 'auto', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                  <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}><strong>Owner:</strong> {item.displayOwner}</p>
                  <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}><i className="fa-solid fa-location-dot" style={{ color: 'var(--color-orange)' }}></i> {item.location}</p>
                  
                  {activeContactId === item._id ? (
                    <div style={{ marginTop: '1rem', background: '#f5f5f5', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--color-black)' }}><i className="fa-solid fa-envelope" style={{ color: 'var(--color-orange)', width: '20px' }}></i> {item.email}</p>
                      <p style={{ margin: '0', fontSize: '0.9rem', color: 'var(--color-black)' }}><i className="fa-solid fa-phone" style={{ color: 'var(--color-orange)', width: '20px' }}></i> {item.phone}</p>
                      <button className="btn btn-outline" style={{ width: '100%', marginTop: '1rem', borderColor: '#ccc', color: '#666', padding: '0.4rem' }} onClick={() => setActiveContactId(null)}>Close Details</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setActiveContactId(item._id)}><i className="fa-solid fa-phone"></i> Contact Seller</button>
                      {user && user.email === item.email && (
                        <>
                          <button className="btn btn-secondary" style={{ padding: '0.6rem 1rem' }} onClick={() => handleEdit(item)} title="Edit Listing">
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button className="btn btn-danger" style={{ padding: '0.6rem 1rem' }} onClick={() => handleDelete(item)} title="Delete Listing">
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            );
          })}
          {listings.length === 0 && <p className="text-center" style={{gridColumn: '1 / -1'}}>No listings found. Be the first to sell!</p>}
        </div>
      </section>
    </>
  );
};

export default Sell;
