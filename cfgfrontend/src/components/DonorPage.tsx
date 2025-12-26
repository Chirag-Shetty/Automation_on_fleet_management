import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DonorPage.css';


interface DonationForm {
  productName: string;
  category: string;
  servingSize: string;
  image: File | null;
  selfVolunteer: boolean;
  name: string;
  contactNumber: string;
  availableTime: string;
  address: string;
}

const DonorPage: React.FC = () => {
  const now = new Date();
  const hour = now.getHours();
  const breakfastDisabled = !(hour >= 6 && hour < 12);
  const lunchDisabled = !(hour >= 12 && hour < 17); // until 5 PM
  const dinnerDisabled = !((hour >= 18 && hour <= 23) || (hour >= 0 && hour < 2));

  const navigate = useNavigate();
  const [formData, setFormData] = useState<DonationForm>({
    productName: '',
    category: '',
    servingSize: '',
    image: null,
    selfVolunteer: false,
    name: '',
    contactNumber: '',
    availableTime: '',
    address: ''
  });
  const [showSelfVolunteerForm, setShowSelfVolunteerForm] = useState(false);
  const [showLargeDonationForm, setShowLargeDonationForm] = useState(false);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  const handleServingSizeSelect = (size: string) => {
    setFormData(prev => ({
      ...prev,
      servingSize: size
    }));

    if (size === '< 50') {
      setShowLargeDonationForm(false);
    } else {
      if (size === '< 50') {
        setShowLargeDonationForm(false);
      } else {
        setFormData(prev => ({ ...prev, selfVolunteer: false }));
        setShowLargeDonationForm(true);
        setShowSelfVolunteerForm(false);
      }
    }
  };

  const handleSelfVolunteerChoice = (choice: boolean) => {
    setFormData(prev => ({
      ...prev,
      selfVolunteer: choice
    }));
    setShowSelfVolunteerForm(choice);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productName || !formData.servingSize) {
      alert('Please fill product name and serving size');
      return;
    }

    const numericServings = formData.servingSize === '< 50' ? 25 : parseInt(formData.servingSize);
    const deliveryOption = numericServings >= 50 ? 'volunteer' : (formData.selfVolunteer ? 'self' : 'volunteer');
    try {
      await axios.post(
        '/api/donations',
        {
          productName: formData.productName,
          servings: parseInt(formData.servingSize) || 0,
          location: formData.address,
          deliveryOption,
        },
      );
      if (numericServings >= 50) {
        alert('Thank you! Our NFG team will pick up your donation shortly.');
      } else {
        alert('Donation submitted successfully');
      }
      if (deliveryOption==='self' && formData.servingSize === '< 50') {
          try {
            const { data: centers } = await axios.get('/api/admin/hunger-spots');
            if (centers.length) {
              navigate('/delivery-info', { state: { center: centers[0] } });
            }
          } catch(err){ console.error(err);} }
        
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error submitting donation');
    }
  };

  return (
    <div className="donor-page">
      {/* Navbar */}
      <nav className="donor-navbar">
        <div className="nav-brand">
          <h2>🍽️ Donor Dashboard</h2>
        </div>
        <div className="nav-actions">
          <button className="nav-btn" onClick={() => navigate('/')}>
            Home
          </button>
          <button className="nav-btn primary" onClick={handleSubmit}>
            Submit Donation
          </button>
        </div>
      </nav>

      <div className="donor-container">
        <div className="donation-form">
          <h1>Donate Food</h1>
          <p>Help fight hunger by donating surplus food</p>

          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="form-section">
              <h3>Personal Information</h3>
              
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactNumber">Mobile Number *</label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your mobile number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your complete address"
                  rows={3}
                />
              </div>
            </div>

            {/* Product Information */}
            <div className="form-section">
              <h3>Product Information</h3>
              
              <div className="form-group">
                <label htmlFor="productName">Product Name *</label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Biryani, Pizza, Sandwiches"
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Upload Image *</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                  required
                />
                {formData.image && (
                  <div className="image-preview">
                    <img 
                      src={URL.createObjectURL(formData.image)} 
                      alt="Preview" 
                      className="preview-img"
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="breakfast" disabled={breakfastDisabled}>Breakfast</option>
                  <option value="lunch" disabled={lunchDisabled}>Lunch</option>
                  <option value="dinner" disabled={dinnerDisabled}>Dinner</option>
                </select>
              </div>
            </div>

            {/* Serving Size Selection */}
            <div className="form-section">
              <h3>Serving Size</h3>
              <div className="serving-buttons">
                <button
                  type="button"
                  className={`serving-btn ${formData.servingSize === '< 50' ? 'active' : ''}`}
                  onClick={() => handleServingSizeSelect('< 50')}
                >
                  &lt; 50 servings
                </button>
                <button
                  type="button"
                  className={`serving-btn ${formData.servingSize === '>= 50' ? 'active' : ''}`}
                  onClick={() => handleServingSizeSelect('>= 50')}
                >
                  ≥ 50 servings
                </button>
              </div>
            </div>

            {/* Conditional Forms */}
            {formData.servingSize === '< 50' && (
              <div className="form-section">
                <h3>Delivery Option</h3>
                <p>Will you self-volunteer to deliver?</p>
                <div className="volunteer-choice">
                  <button
                    type="button"
                    className={`choice-btn ${formData.selfVolunteer ? 'active' : ''}`}
                    onClick={() => handleSelfVolunteerChoice(true)}
                  >
                    Yes, I'll deliver
                  </button>
                  <button
                    type="button"
                    className={`choice-btn ${!formData.selfVolunteer && formData.servingSize === '< 50' ? 'active' : ''}`}
                    onClick={() => handleSelfVolunteerChoice(false)}
                  >
                    Need Volunteer
                  </button>
                </div>

                {showSelfVolunteerForm && (
                  <div className="self-volunteer-form">
                    <h4>Self-Volunteering Details</h4>
                    <div className="form-group">
                      <label htmlFor="availableTime">Available Time for Delivery *</label>
                      <input
                        type="datetime-local"
                        id="availableTime"
                        name="availableTime"
                        value={formData.availableTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {showLargeDonationForm && (
              <div className="form-section">
                <h3>Large Donation Details</h3>
                <div className="form-group">
                  <label htmlFor="availableTime">Available Time for Pickup *</label>
                  <input
                    type="datetime-local"
                    id="availableTime"
                    name="availableTime"
                    value={formData.availableTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Submit Donation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonorPage; 
