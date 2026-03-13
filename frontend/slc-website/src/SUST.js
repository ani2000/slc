import React from 'react';
// Import SUST images from assets
import ch71 from './assets/SUST/CHETONA 71.jpg';
import shaheedMinar from './assets/SUST/SHAHEED MINAR.jpg';
import shaheedMinar2 from './assets/SUST/SHAHEED MINAR2.jpg';
import sustGate from './assets/SUST/sust gate.jpg';
import hq720 from './assets/SUST/hq720.jpg';
import screenshot from './assets/SUST/Screenshot 2025-06-25 123430.png';
import sylhetBangladesh from './assets/SUST/sylhet-bangladesh-2-january-2024-260nw-2421221059.webp';

const sustImages = [
  ch71,
  shaheedMinar,
  shaheedMinar2,
  sustGate,
  hq720,
  screenshot,
  sylhetBangladesh
];

const webImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://upload.wikimedia.org/wikipedia/commons/6/6e/SUST_campus.jpg"
];

export default function SUST() {
  return (
    <div style={{ padding: 24 }}>
      <h2>SUST Gallery</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {sustImages.map((img, idx) => (
          <img key={idx} src={img} alt={`SUST ${idx}`} style={{ width: 220, borderRadius: 8 }} />
        ))}
        {webImages.map((img, idx) => (
          <img key={"web-"+idx} src={img} alt={`Web SUST ${idx}`} style={{ width: 220, borderRadius: 8, border: '2px solid #ccc' }} />
        ))}
      </div>
    </div>
  );
} 