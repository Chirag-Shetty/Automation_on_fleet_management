import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';


const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Static admin credentials
  const staticAdmins = [
    { email: 'admin@example.com', password: 'admin123', name: 'Admin User' },
    { email: 'superadmin@example.com', password: 'super123', name: 'Super Admin' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const admin = staticAdmins.find(a => 
      a.email === formData.email && a.password === formData.password
    );

    if (admin) {
      // Store admin info in localStorage (in real app, you'd use proper auth)
      localStorage.setItem('adminInfo', JSON.stringify(admin));
      navigate('/admin');
    } else {
      setError('Invalid email or password. Try: admin@example.com / admin123');
    }
  };

  return (
      
    
      
      <div className="admin-login-page">
        <div className="login-container">
          <div className="login-header">
            <h1>🧑‍💼 Admin Portal</h1>
            <p>Access restricted to authorized administrators only</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Admin Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter admin email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Admin Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter admin password"
              />
            </div>

            <button type="submit" className="submit-btn">
              Login as Admin
            </button>

            <div className="demo-credentials">
              <h4>Demo Admin Credentials:</h4>
              <p><strong>Email:</strong> admin@example.com</p>
              <p><strong>Password:</strong> admin123</p>
              <p><strong>Super Admin:</strong> superadmin@example.com / super123</p>
            </div>
          </form>

          <div className="back-link">
            <button onClick={() => navigate('/')} className="back-btn">
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    
  );
};

export default AdminLogin;