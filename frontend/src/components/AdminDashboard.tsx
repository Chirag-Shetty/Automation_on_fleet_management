import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'donor' | 'volunteer';
  status: 'active' | 'inactive';
  joinDate: string;
}

interface HungerSpot {
  id: string;
  location: string;
  description: string;
  status: string;
  reportedBy: string;
  reportedDate: string;
  assignedVolunteer?: string;
}

interface AdminInfo {
  name: string;
  email: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'hunger-spots' | 'users'>('dashboard');
  const [vehicleAvailable, setVehicleAvailable] = useState(true);
  const [metrics, setMetrics] = useState<{totalOrders:number,activeVolunteers:number,activeDonors:number,pendingSpots:number,resolvedSpots:number} | null>(null);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  
  const [users, setUsers] = useState<User[]>([]);

  const [hungerSpots, setHungerSpots] = useState<HungerSpot[]>([]);

  // new spot form state
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    // Check if admin is logged in
    const storedAdmin = localStorage.getItem('adminInfo');
    if (storedAdmin) {
      setAdminInfo(JSON.parse(storedAdmin));
    } else {
      // Redirect to login if not authenticated
      navigate('/admin-login');
    }
  }, [navigate]);

  // fetch users, hunger spots & metrics once admin authenticated
  useEffect(() => {
    if (!adminInfo) return;
    const fetchData = async () => {
      try {
        const [uRes, hRes, mRes] = await Promise.all([
          axios.get('/api/admin/users'),
          axios.get('/api/admin/hunger-spots'),
          axios.get('/api/admin/metrics'),
        ]);
        setUsers(
          uRes.data.map((u: any) => ({
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            status: 'active',
            joinDate: u.createdAt,
          }))
        );
        const mappedSpots = hRes.data.map((d: any) => ({
          id: d._id,
          location: d.locationText || 'N/A',
          description: d.description,
          status: d.status,
          reportedBy: d.reportedBy?.name || 'N/A',
          reportedDate: d.createdAt,
          assignedVolunteer: d.assignedVolunteer?.name,
        }));
        // fallback static spots if API returns empty
        setMetrics({
          totalOrders: mRes.data.totalDonations || 0,
          activeVolunteers: mRes.data.activeVolunteers || 0,
          activeDonors: mRes.data.activeDonors || 0,
          pendingSpots: mRes.data.pendingSpots || 0,
          resolvedSpots: mRes.data.resolvedSpots || 0,
        });
        setHungerSpots(
          mappedSpots.length ? mappedSpots : [
            {
              id: 'demo1',
              location: 'Old Bus Stand',
              description: 'Family needs dinner',
              status: 'pending',
              reportedBy: 'Demo Volunteer',
              reportedDate: new Date().toISOString(),
            }
          ] as any
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [adminInfo]);

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    navigate('/');
  };

  const handleVehicleToggle = () => {
    setVehicleAvailable(!vehicleAvailable);
  };

  const handleAddSpot = async () => {
    if (!newLocation || !newDescription) return alert('Please enter name & address');
    try {
      const { data } = await axios.post('/api/admin/hunger-spots', {
        description: newDescription,
        locationText: newLocation,
      });
      setHungerSpots(prev => [{
        id: data._id,
        location: data.locationText,
        description: data.description,
        status: data.status || 'pending',
        reportedBy: adminInfo?.name || 'Admin',
        reportedDate: data.createdAt,
      }, ...prev]);
      setNewLocation('');
      setNewDescription('');
    } catch (err) {
      console.error(err);
      alert('Failed to add hunger spot');
    }
  };

  const handleHungerSpotAction = (spotId: string, action: 'approve' | 'reject' | 'resolve') => {
    setHungerSpots(prev => prev.map(spot => {
      if (spot.id === spotId) {
        return {
          ...spot,
          status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'resolved'
        };
      }
      return spot;
    }));
  };

  const handleUserStatusToggle = (userId: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'active' ? 'inactive' : 'active'
        };
      }
      return user;
    }));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const getMetrics = () => {
    const totalOrders = hungerSpots.length; // total donation records
    const activeVolunteers = users.filter(u => u.role === 'volunteer' && u.status === 'active').length;
    const activeDonors = users.filter(u => u.role === 'donor' && u.status === 'active').length;
    const pendingSpots = hungerSpots.filter(s => s.status === 'pending').length;
    const resolvedSpots = hungerSpots.filter(s => s.status === 'completed' || s.status==='accepted' || s.status==='resolved').length;

    return { totalOrders, activeVolunteers, activeDonors, pendingSpots, resolvedSpots };
  };

  const computedMetrics = metrics ?? getMetrics();

  if (!adminInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-page">
      {/* Navbar */}
      <nav className="admin-navbar">
        <div className="nav-brand">
          <h2>🧑‍💼 Admin Dashboard</h2>
          <p>Welcome, {adminInfo.name}!</p>
        </div>
        <div className="nav-actions">
          <div className="vehicle-toggle">
            <span>Vehicle Available:</span>
            <button
              className={`toggle-btn ${vehicleAvailable ? 'active' : ''}`}
              onClick={handleVehicleToggle}
            >
              {vehicleAvailable ? '✅ Yes' : '❌ No'}
            </button>
          </div>
          <button className="nav-btn" onClick={() => navigate('/')}>
            Home
          </button>
          <button className="nav-btn logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="admin-container">
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`tab-btn ${activeTab === 'hunger-spots' ? 'active' : ''}`}
            onClick={() => setActiveTab('hunger-spots')}
          >
            📍 Hunger Spots
          </button>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Manage Users
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-section">
            <h2>Overview Metrics</h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">📦</div>
                <div className="metric-content">
                  <h3>{computedMetrics.totalOrders}</h3>
                  <p>Orders Placed</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">🙋‍♂️</div>
                <div className="metric-content">
                  <h3>{computedMetrics.activeVolunteers}</h3>
                  <p>Active Volunteers</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">🍽️</div>
                <div className="metric-content">
                  <h3>{computedMetrics.activeDonors}</h3>
                  <p>Active Donors</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">📍</div>
                <div className="metric-content">
                  <h3>{computedMetrics.pendingSpots}</h3>
                  <p>Pending Deliveries</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">✅</div>
                <div className="metric-content">
                  <h3>{computedMetrics.resolvedSpots}</h3>
                  <p>Completed Deliveries</p>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">🚚</div>
                <div className="metric-content">
                  <h3>{vehicleAvailable ? 'Available' : 'Unavailable'}</h3>
                  <p>Vehicle Status</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hunger Spots Tab */}
        {activeTab === 'hunger-spots' && (
          <div className="hunger-spots-section">
            <h2>Hunger Spots Management</h2>
            <div className="add-spot-form">
              <input
                type="text"
                placeholder="Name / Landmark"
                value={newLocation}
                onChange={e => setNewLocation(e.target.value)}
              />
              <input
                type="text"
                placeholder="Address / Description"
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
              />
              <button className="action-btn" onClick={handleAddSpot}>➕ Add Spot</button>
            </div>
            <div className="spots-grid">
              {hungerSpots.map(spot => (
                <div key={spot.id} className={`spot-card ${spot.status || 'pending'}`}>
                  <div className="spot-header">
                    <h3>{spot.location}</h3>
                    <span className={`status-badge ${spot.status || 'pending'}`}>
                      {(spot.status || 'pending').charAt(0).toUpperCase() + (spot.status || 'pending').slice(1)}
                    </span>
                  </div>
                  <div className="spot-details">
                    <p><strong>Description:</strong> {spot.description}</p>
                    <p><strong>Reported by:</strong> {spot.reportedBy}</p>
                    <p><strong>Date:</strong> {new Date(spot.reportedDate).toLocaleDateString()}</p>
                    {spot.assignedVolunteer && (
                      <p><strong>Assigned to:</strong> {spot.assignedVolunteer}</p>
                    )}
                  </div>
                  <div className="spot-actions">
                    {spot.status === 'pending' && (
                      <>
                        <button
                          className="action-btn approve"
                          onClick={() => handleHungerSpotAction(spot.id, 'approve')}
                        >
                          ✅ Approve
                        </button>
                        <button
                          className="action-btn reject"
                          onClick={() => handleHungerSpotAction(spot.id, 'reject')}
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}
                    {spot.status === 'approved' && (
                      <button
                        className="action-btn resolve"
                        onClick={() => handleHungerSpotAction(spot.id, 'resolve')}
                      >
                        ✅ Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="users-section">
            <h2>Manage Donors & Volunteers</h2>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Join Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.status}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                      <td>
                        <div className="user-actions">
                          <button
                            className={`toggle-btn ${user.status === 'active' ? 'active' : ''}`}
                            onClick={() => handleUserStatusToggle(user.id)}
                          >
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 