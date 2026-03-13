import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5010/api';

export const quotes = [
  "Read! In the name of your Lord who created. (Qur'an, Al-Alaq, 96:1)",
  "My Lord, increase me in knowledge. (Qur'an, Ta-Ha, 20:114)",
  "Whoever travels a path in search of knowledge, Allah will make easy for him a path to Paradise. (Sahih Muslim, Hadith 2699)",
];

export default function QuotesSection() {
  const [quote, setQuote] = useState('');
  useEffect(() => {
    fetch(`${API_URL}/content/all`)
      .then(res => res.json())
      .then(data => {
        if (data.quotes && data.quotes.length > 0) {
          setQuote(data.quotes[Math.floor(Math.random() * data.quotes.length)].text);
        }
      })
      .catch(err => console.error('Failed to fetch quotes:', err));
  }, []);
  return (
    <div style={{ background: '#f9f9f9', padding: 16, margin: '16px 0', borderRadius: 8, textAlign: 'center', fontStyle: 'italic' }}>
      <span>{quote}</span>
    </div>
  );
} 