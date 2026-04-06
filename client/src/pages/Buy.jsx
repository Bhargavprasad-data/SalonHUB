import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Buy = () => {
  const [products, setProducts] = useState([]);
  const [activeContactId, setActiveContactId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const buyRes = await axios.get('http://localhost:5000/api/buy');
      const sellRes = await axios.get('http://localhost:5000/api/sell');

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
      setProducts(combined);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/buy/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p._id !== id));
      setSuccessMsg('Product deleted successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg('Failed to delete product');
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
        <h1>Buy <span>Salon Equipment</span></h1>
        <p>Discover high-quality, pre-owned and new salon equipment from verified sellers across India.</p>
      </div>

      <section className="section">
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

        <div className="grid-container" style={{ marginTop: '1rem' }}>
          {products.map((item) => {
            const imageUrl = item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`) : 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500';
            return (
              <div key={item._id} className="card" style={{ padding: '0', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                <div style={{ overflow: 'hidden' }}>
                  <img src={imageUrl} alt={item.productName} style={{ width: '100%', height: '200px', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                </div>
                <div style={{ padding: '1.5rem', flex: '1', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>{item.displayName}</h3>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', background: item.itemType === 'sell' ? 'var(--color-gold)' : '#eee', color: item.itemType === 'sell' ? '#fff' : '#666', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
                      {item.itemType === 'sell' ? 'Shop' : 'Product'}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.4rem', color: 'var(--color-black)', fontWeight: '700', marginBottom: '1rem', background: '#fdfaf2', padding: '0.3rem 0.8rem', borderRadius: '6px', display: 'inline-block', borderLeft: '3px solid var(--color-gold)' }}>
                    ₹{item.price.toLocaleString()}
                  </div>
                  {item.description && <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>{item.description}</p>}

                  <div style={{ marginTop: 'auto', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                    <p style={{ marginBottom: '0.4rem', fontSize: '0.85rem' }}><strong>Seller:</strong> {item.displayOwner}</p>
                    <p style={{ marginBottom: '0.4rem', fontSize: '0.85rem' }}><i className="fa-solid fa-location-dot" style={{ color: 'var(--color-orange)' }}></i> {item.location}</p>

                    {activeContactId === item._id ? (
                      <div style={{ marginTop: '1rem', background: '#f5f5f5', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--color-black)' }}><i className="fa-solid fa-envelope" style={{ color: 'var(--color-orange)', width: '20px' }}></i> {item.email}</p>
                        <p style={{ margin: '0', fontSize: '0.9rem', color: 'var(--color-black)' }}><i className="fa-solid fa-phone" style={{ color: 'var(--color-orange)', width: '20px' }}></i> {item.phone}</p>
                        <button className="btn btn-outline" style={{ width: '100%', marginTop: '1rem', borderColor: '#ccc', color: '#666', padding: '0.4rem' }} onClick={() => setActiveContactId(null)}>Close Details</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <button className="btn btn-primary" style={{ flex: 1, padding: '0.6rem' }} onClick={() => setActiveContactId(item._id)}>Buy Now</button>
                        {user && user.email === item.email && item.itemType === 'buy' && (
                          <>
                            <div style={{ fontSize: '0.75rem', color: '#888', fontStyle: 'italic', padding: '0.6rem 0', alignSelf: 'center' }}>Manage in legacy Buy API</div>
                            <button className="btn btn-danger" style={{ padding: '0.6rem 1rem' }} onClick={() => handleDelete(item._id)} title="Delete Product">
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </>
                        )}
                        {user && user.email === item.email && item.itemType === 'sell' && (
                          <div style={{ fontSize: '0.75rem', color: '#888', fontStyle: 'italic', padding: '0.6rem 0', alignSelf: 'center' }}></div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {products.length === 0 && <p className="text-center" style={{ gridColumn: '1 / -1' }}>No products found.</p>}
        </div>
      </section>
    </>
  );
};

export default Buy;
