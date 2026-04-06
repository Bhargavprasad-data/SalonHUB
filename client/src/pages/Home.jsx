import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ backgroundColor: '#161616', minHeight: '100vh', color: 'var(--color-white)' }}>
      {/* Hero Section */}
      <section className="hero" style={{
        minHeight: '85vh',
        background: `linear-gradient(rgba(22, 22, 22, 0.75), rgba(22, 22, 22, 0.85)), url('https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'var(--color-white)',
        padding: '0 5%'
      }}>
        <div className="hero-content" style={{ animation: 'fadeIn 1s ease-in-out', maxWidth: '900px' }}>
          <h1 style={{ fontSize: '4.5rem', color: 'var(--color-white)', marginBottom: '1.5rem', lineHeight: '1.1', fontWeight: '700' }}>
            One Stop Solution<br />for <span style={{ color: 'var(--color-gold)' }}>Your Salon Business</span>
          </h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '3rem', margin: '0 auto 3rem', color: '#e0e0e0', fontWeight: '400', maxWidth: '600px' }}>
            India's premium marketplace for salon owners and professionals.<br />
            Buy equipment, sell shops, explore franchise opportunities, and get community help.
          </p>
          <div className="btn-group" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span className="btn btn-primary" style={{ padding: '0.7rem 2rem', fontSize: '0.95rem', fontWeight: '600', backgroundColor: 'var(--color-gold)', color: 'var(--color-black)', border: 'none', borderRadius: '6px' }}>Buy Equipment</span>
            <span className="btn btn-secondary" style={{ padding: '0.7rem 2rem', fontSize: '0.95rem', fontWeight: '600', backgroundColor: 'var(--color-orange)', color: 'var(--color-white)', border: 'none', borderRadius: '6px' }}>Sell Equipment</span>
            <span className="btn btn-outline" style={{ padding: '0.7rem 2rem', fontSize: '0.95rem', fontWeight: '600', borderColor: 'var(--color-white)', color: 'var(--color-white)', borderRadius: '6px' }}>Get Help</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" style={{ backgroundColor: '#161616', padding: '5rem 5% 7rem' }}>
        <h2 className="section-title" style={{ color: 'var(--color-white)', marginBottom: '4rem', fontSize: '2.5rem', fontWeight: '700' }}>
          Why Choose <span style={{ color: 'var(--color-gold)' }}>SalonHub</span>?
        </h2>

        <style>
          {`
            .section-title::after { display: none; }
            .feature-card { transition: all 0.3s ease; }
            .feature-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.5); border-color: #444 !important; }
          `}
        </style>

        <div className="grid-container" style={{ gap: '1.5rem', maxWidth: '1200px', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>

          <div className="feature-card" style={{ backgroundColor: '#202020', borderRadius: '8px', padding: '2rem 1.5rem', display: 'flex', gap: '1.2rem', alignItems: 'flex-start', border: '1px solid #2a2a2a' }}>
            <div style={{ flexShrink: 0, width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
              <i className="fa-solid fa-chart-column" style={{ fontSize: '2rem', color: '#ccc' }}></i>
            </div>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-white)', fontWeight: '600', marginBottom: '0.6rem', letterSpacing: '0.5px' }}>Salon Setup</h3>
              <div style={{ width: '40px', height: '2px', backgroundColor: '#e0e0e0', marginBottom: '1rem' }}></div>
              <p style={{ color: '#999', fontSize: '0.85rem', lineHeight: '1.5' }}>Get the best resources guidance launch or upgrade your salon with ease.</p>
            </div>
          </div>

          <div className="feature-card" style={{ backgroundColor: '#202020', borderRadius: '8px', padding: '2rem 1.5rem', display: 'flex', gap: '1.2rem', alignItems: 'flex-start', border: '1px solid #2a2a2a' }}>
            <div style={{ flexShrink: 0, width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
              <i className="fa-solid fa-handshake" style={{ fontSize: '2rem', color: 'var(--color-gold)' }}></i>
            </div>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-white)', fontWeight: '600', marginBottom: '0.6rem', letterSpacing: '0.5px' }}>Franchise Opportunities</h3>
              <div style={{ width: '40px', height: '2px', backgroundColor: '#e0e0e0', marginBottom: '1rem' }}></div>
              <p style={{ color: '#999', fontSize: '0.85rem', lineHeight: '1.5' }}>Grow your brand or invest in proven salon franchises from trusted sellers.</p>
            </div>
          </div>

          <div className="feature-card" style={{ backgroundColor: '#202020', borderRadius: '8px', padding: '2rem 1.5rem', display: 'flex', gap: '1.2rem', alignItems: 'flex-start', border: '1px solid #2a2a2a' }}>
            <div style={{ flexShrink: 0, width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
              <i className="fa-solid fa-chair" style={{ fontSize: '2rem', color: 'var(--color-orange)' }}></i>
            </div>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-white)', fontWeight: '600', marginBottom: '0.6rem', letterSpacing: '0.5px' }}>Equipment Marketplace</h3>
              <div style={{ width: '40px', height: '2px', backgroundColor: '#e0e0e0', marginBottom: '1rem' }}></div>
              <p style={{ color: '#999', fontSize: '0.85rem', lineHeight: '1.5' }}>Buy your used salon equipment, a safe place for trusted sellers.</p>
            </div>
          </div>

          <div className="feature-card" style={{ backgroundColor: '#202020', borderRadius: '8px', padding: '2rem 1.5rem', display: 'flex', gap: '1.2rem', alignItems: 'flex-start', border: '1px solid #2a2a2a' }}>
            <div style={{ flexShrink: 0, width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
              <i className="fa-solid fa-briefcase" style={{ fontSize: '2rem', color: '#ccc' }}></i>
            </div>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-white)', fontWeight: '600', marginBottom: '0.6rem', letterSpacing: '0.5px' }}>Salon Jobs Portal</h3>
              <div style={{ width: '40px', height: '2px', backgroundColor: '#e0e0e0', marginBottom: '1rem' }}></div>
              <p style={{ color: '#999', fontSize: '0.85rem', lineHeight: '1.5' }}>Find experienced salon professionals to manage your jobs easily.</p>
            </div>
          </div>

          <div className="feature-card" style={{ backgroundColor: '#202020', borderRadius: '8px', padding: '2rem 1.5rem', display: 'flex', gap: '1.2rem', alignItems: 'flex-start', border: '1px solid #2a2a2a' }}>
            <div style={{ flexShrink: 0, width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
              <i className="fa-solid fa-spray-can" style={{ fontSize: '2rem', color: 'var(--color-gold)' }}></i>
            </div>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-white)', fontWeight: '600', marginBottom: '0.6rem', letterSpacing: '0.5px' }}>Products Marketplace</h3>
              <div style={{ width: '40px', height: '2px', backgroundColor: '#e0e0e0', marginBottom: '1rem' }}></div>
              <p style={{ color: '#999', fontSize: '0.85rem', lineHeight: '1.5' }}>Shop and sell high quality products from trusted professionals.</p>
            </div>
          </div>

          <div className="feature-card" style={{ backgroundColor: '#202020', borderRadius: '8px', padding: '2rem 1.5rem', display: 'flex', gap: '1.2rem', alignItems: 'flex-start', border: '1px solid #2a2a2a' }}>
            <div style={{ flexShrink: 0, width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
              <i className="fa-solid fa-headset" style={{ fontSize: '2rem', color: '#e8a97f' }}></i>
            </div>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-white)', fontWeight: '600', marginBottom: '0.6rem', letterSpacing: '0.5px' }}>Community Help</h3>
              <div style={{ width: '40px', height: '2px', backgroundColor: '#e0e0e0', marginBottom: '1rem' }}></div>
              <p style={{ color: '#999', fontSize: '0.85rem', lineHeight: '1.5' }}>Get and provide solutions via our community forum.</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;
