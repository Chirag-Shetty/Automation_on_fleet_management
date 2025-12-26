import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VolunteerPage.css';

interface Order {
  id: string;
  donorName: string;
  productName: string;
  servings: number;
  time: string;
  location: string;
  status: 'pending' | 'accepted' | 'ignored';
}

interface HungerSpot {
  location: string;
  description: string;
  photo: File | null;
}

interface VolunteerInfo {
  name: string;
  email: string;
}

const VolunteerPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'my-orders' | 'hunger-spots'>('orders');
  const [volunteerInfo, setVolunteerInfo] = useState<VolunteerInfo | null>(null);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);




  const [hungerSpot, setHungerSpot] = useState<HungerSpot>({
    location: '',
    description: '',
    photo: null
  });

  useEffect(() => {
    // validate role and redirect if necessary
    const storedUser = localStorage.getItem('userInfo');
    if (!storedUser) {
      navigate('/volunteer-login');
      return;
    }
    const parsed = JSON.parse(storedUser);
    if (parsed.role !== 'volunteer') {
      navigate('/volunteer-login');
      return;
    }
    setVolunteerInfo({ name: parsed.name, email: parsed.email });
  }, [navigate]);

  // fetch pending donations once logged in
  useEffect(() => {
    if (!volunteerInfo) return;
    const fetchDonations = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
        const res = await axios.get('/api/donations/pending', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // map to Order interface
        const mapped: Order[] = res.data.map((d: any) => ({
          id: d._id,
          donorName: d.donor?.name || 'Anonymous',
          productName: d.productName,
          servings: d.servings,
          time: d.createdAt,
          location: d.location,
          status: d.status,
        }));
        setOrders(mapped);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDonations();
  }, [volunteerInfo]);

  // fetch orders accepted by this volunteer
  useEffect(() => {
    if (!volunteerInfo) return;
    const fetchMy = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
        const res = await axios.get('/api/donations/accepted', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const mapped: Order[] = res.data.map((d: any) => ({
          id: d._id,
          donorName: d.donor?.name || 'Anonymous',
          productName: d.productName,
          servings: d.servings,
          time: d.createdAt,
          location: d.location,
          status: d.status,
        }));
        setMyOrders(mapped);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMy();
  }, [volunteerInfo]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const handleOrderAction = async (orderId: string, action: 'accept' | 'ignore') => {
    if (action === 'accept') {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
        await axios.patch(`/api/donations/${orderId}/accept`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(prev => prev.filter(o => o.id !== orderId));
        const accepted = orders.find(o => o.id === orderId);
        if (accepted) setMyOrders(prev => [...prev, { ...accepted, status: 'accepted' }]);
      } catch (err) {
        console.error(err);
        alert('Failed to accept order');
      }
    } else {
      setOrders(prev => prev.filter(o => o.id !== orderId));
    }
  };

  const handleHungerSpotInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHungerSpot(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHungerSpot(prev => ({
        ...prev,
        photo: e.target.files![0]
      }));
    }
  };

  const handleHungerSpotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
      await axios.post('/api/hunger-spots', {
        description: hungerSpot.description,
        locationText: hungerSpot.location,
        lat: 0,
        lng: 0,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Hunger spot reported!');
    } catch (err) {
      console.error(err);
      alert('Failed to report hunger spot');
    }
    setHungerSpot({
      location: '',
      description: '',
      photo: null
    });
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  if (!volunteerInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="volunteer-page">
      {/* Navbar */}
      <nav className="volunteer-navbar">
        <div className="nav-brand">
          <h2>🙋‍♂️ Volunteer Dashboard</h2>
          <p>Welcome, {volunteerInfo.name}!</p>
        </div>
        <div className="nav-actions">
          <button className="nav-btn" onClick={() => navigate('/')}>
            Home
          </button>
          <button className="nav-btn logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="volunteer-container">
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📋 Order List
          </button>
          <button
            className={`tab-btn ${activeTab === 'my-orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-orders')}
          >
            ✅ My Orders
          </button>
          <button
            className={`tab-btn ${activeTab === 'hunger-spots' ? 'active' : ''}`}
            onClick={() => setActiveTab('hunger-spots')}
          >
            📍 Report Hunger Spot
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Available Orders</h2>
            <div className="orders-grid">
              {orders.filter(order => order.status === 'pending').map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <h3>{order.productName}</h3>
                    <span className="servings-badge">{order.servings} servings</span>
                  </div>
                  <div className="order-details">
                    <p><strong>Donor:</strong> {order.donorName}</p>
                    <p><strong>Time:</strong> {formatDateTime(order.time)}</p>
                    <p><strong>Location:</strong> {order.location}</p>
                  </div>
                  <div className="order-actions">
                    <button
                      className="action-btn accept"
                      onClick={() => handleOrderAction(order.id, 'accept')}
                    >
                      ✅ Accept
                    </button>
                    <button
                      className="action-btn ignore"
                      onClick={() => handleOrderAction(order.id, 'ignore')}
                    >
                      ❌ Ignore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Orders Tab */}
        {activeTab === 'my-orders' && (
          <div className="orders-section">
            <h2>My Accepted Orders</h2>
            <div className="orders-grid">
              {myOrders.map(order => (
                <div key={order.id} className="order-card accepted">
                  <div className="order-header">
                    <h3>{order.productName}</h3>
                    <span className="status-badge accepted">Accepted</span>
                  </div>
                  <div className="order-details">
                    <p><strong>Donor:</strong> {order.donorName}</p>
                    <p><strong>Time:</strong> {formatDateTime(order.time)}</p>
                    <p><strong>Location:</strong> {order.location}</p>
                  </div>
                </div>
              ))}
              {myOrders.length === 0 && <p>No accepted orders yet.</p>}
            </div>
          </div>
        )}

        {/* Hunger Spots Tab */}
        {activeTab === 'hunger-spots' && (
          <div className="hunger-spots-section">
            <h2>Report a Hunger Spot</h2>
            <form onSubmit={handleHungerSpotSubmit} className="hunger-spot-form">
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={hungerSpot.location}
                  onChange={handleHungerSpotInput}
                  required
                  placeholder="Enter the location or address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={hungerSpot.description}
                  onChange={handleHungerSpotInput}
                  required
                  placeholder="Describe the hunger situation and any specific details..."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="photo">Photo (Optional)</label>
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="file-input"
                />
                {hungerSpot.photo && (
                  <div className="photo-preview">
                    <img 
                      src={URL.createObjectURL(hungerSpot.photo)} 
                      alt="Preview" 
                      className="preview-img"
                    />
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Report Hunger Spot
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerPage; 