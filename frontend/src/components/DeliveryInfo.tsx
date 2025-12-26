import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './DeliveryInfo.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface LocationState {
  center: {
    locationText?: string;
    description?: string;
    address?: string;
    location?: {
      coordinates: [number, number]; // [lng, lat]
    };
  };
}

const DeliveryInfo: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const center = (state as LocationState)?.center;
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getCoordinates = async () => {
      setIsLoading(true);
      
      // First, check if we have coordinates directly from the hunger spot
      if (center?.location?.coordinates && center.location.coordinates.length === 2) {
        const [lng, lat] = center.location.coordinates;
        setCoordinates([lat, lng]); // Leaflet expects [lat, lng]
        setIsLoading(false);
        return;
      }

      // If we have an address field, geocode it
      if (center?.address) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(center.address)}`
          );
          const data = await response.json();
          if (data.length > 0) {
            setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          }
        } catch (error) {
          console.error('Error geocoding address:', error);
        }
        setIsLoading(false);
        return;
      }

      // If we have locationText, try to geocode it
      if (center?.locationText) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(center.locationText)}`
          );
          const data = await response.json();
          if (data.length > 0) {
            setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          }
        } catch (error) {
          console.error('Error geocoding locationText:', error);
        }
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
    };

    if (center) {
      getCoordinates();
    }
  }, [center]);

  if (!center) {
    return (
      <div className="delivery-info-page">
        <h2>No delivery point selected</h2>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="delivery-info-page">
      <h1>📍 Delivery Point</h1>
      <p>Please deliver your food to the following hunger centre:</p>
      
      <div className="delivery-card">
        <h2>{center.locationText || 'Hunger Centre'}</h2>
        {center.description && <p>{center.description}</p>}
        {center.address && <p><strong>Address:</strong> {center.address}</p>}
        {!center.address && center.locationText && <p><strong>Location:</strong> {center.locationText}</p>}
      </div>

      {isLoading && (
        <div className="map-container">
          <p>Loading map...</p>
        </div>
      )}

      {coordinates && !isLoading && (
        <div className="map-container">
          <h3>📍 Location Map</h3>
          <MapContainer
            center={coordinates}
            zoom={15}
            style={{ height: '400px', width: '100%', marginTop: '20px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={coordinates}>
              <Popup>
                <div>
                  <h4>{center.locationText || 'Hunger Centre'}</h4>
                  <p>{center.address || center.locationText}</p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {!coordinates && !isLoading && (
        <div className="map-container">
          <p>📍 Map not available for this location</p>
          <p>Please use the address information above to navigate to the delivery point.</p>
        </div>
      )}

      <div className="delivery-actions">
        <button className="primary-btn" onClick={() => navigate('/')}>
          Done
        </button>
        {coordinates && (
          <button 
            className="secondary-btn"
            onClick={() => {
              const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates[0]},${coordinates[1]}`;
              window.open(url, '_blank');
            }}
          >
            Open in Google Maps
          </button>
        )}
      </div>
    </div>
  );
};

export default DeliveryInfo;
