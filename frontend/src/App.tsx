import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import DonorPage from './components/DonorPage';
import VolunteerLogin from './components/VolunteerLogin';
import VolunteerPage from './components/VolunteerPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import FundraiserPage from './components/FundraiserPage';
import DeliveryInfo from './components/DeliveryInfo';


function App() {
  return (
    <Router>
      <div className="App">
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/donor" element={<DonorPage />} />
          <Route path="/volunteer-login" element={<VolunteerLogin />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/fundraiser" element={<FundraiserPage />} />
          <Route path="/delivery-info" element={<DeliveryInfo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
