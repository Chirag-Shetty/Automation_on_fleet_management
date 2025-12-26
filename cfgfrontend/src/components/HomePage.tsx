import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (role: string) => {
    setIsDropdownOpen(false);
    
    // Redirect based on role
    switch (role) {
      case 'donor':
        navigate('/donor');
        break;
      case 'volunteer':
        navigate('/volunteer-login');
        break;
      case 'admin':
        navigate('/admin-login');
        break;
      case 'fundraiser':
        navigate('/fundraiser');
        break;
      default:
        navigate('/');
    }
  };




  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          <h1>🍽️ Food Hunger Relief</h1>
        </div>
        <div className="nav-menu">
          <div className="dropdown">
            <button 
              className="dropdown-toggle"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Choose Your Role ▼
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={() => handleRoleSelect('donor')}>Donor</button>
                <button onClick={() => handleRoleSelect('volunteer')}>Volunteer</button>
                <button onClick={() => handleRoleSelect('admin')}>Admin</button>
                <button onClick={() => handleRoleSelect('fundraiser')}>Fundraiser</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Fighting Hunger Together</h1>
          <p>Connect donors, volunteers, and communities to eliminate food waste and feed those in need.</p>
          <div className="hero-stats">
            <div className="stat">
              <h3>1,000+</h3>
              <p>Meals Donated</p>
            </div>
            <div className="stat">
              <h3>500+</h3>
              <p>Volunteers</p>
            </div>
            <div className="stat">
              <h3>50+</h3>
              <p>Hunger Spots Resolved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🍱</div>
            <h3>Donate Food</h3>
            <p>Share surplus food from events, restaurants, or homes with those who need it most.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Volunteer Delivery</h3>
            <p>Help transport food donations to hunger spots and communities in need.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Report Hunger Spots</h3>
            <p>Identify and report areas where people are struggling with food insecurity.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Fundraise</h3>
            <p>Support our mission through donations to help scale our operations.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>Success Stories</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"Thanks to this platform, we were able to donate 200 meals from our wedding reception to local shelters."</p>
            <h4>- Sarah & Mike, Donors</h4>
          </div>
          <div className="testimonial-card">
            <p>"Volunteering here has given me a sense of purpose. I've delivered over 50 meals to families in need."</p>
            <h4>- John, Volunteer</h4>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Food Hunger Relief. Making a difference, one meal at a time.</p>
        <div className="chatbot-wrapper" style={{marginTop:'1rem'}}>
          <iframe
            src="https://sneha1717.github.io/chatbot/"
            title="Support Chatbot"
            width="100%"
            height="400"
            style={{ border: 'none' }}
            loading="lazy"
            allow="microphone"
          />
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 