import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Footer.css';

interface FundDoc {
  _id: string;
  amount: number;
  donorName?: string;
  message?: string;
  createdAt: string;
}

const Footer: React.FC = () => {
  const [funds, setFunds] = useState<FundDoc[]>([]);

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const { data } = await axios.get('/api/funds');
        setFunds(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFunds();
  }, []);

  return (
    <footer className="site-footer">
      <h4>Recent Donations</h4>
      <ul>
        {funds.slice(0, 10).map(f => (
          <li key={f._id}>
            <strong>{f.donorName || 'Anonymous'}</strong> donated ₹{(f.amount/100).toLocaleString()} – {new Date(f.createdAt).toLocaleDateString()}
            {f.message && <em> "{f.message}"</em>}
          </li>
        ))}
      </ul>
    </footer>
  );
};

export default Footer;
