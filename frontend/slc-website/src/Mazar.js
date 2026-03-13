import React from 'react';
// Import Mazar images from assets
import annualUrs from './assets/Mazar/Annual Urs.jpg';
import bgImage from './assets/Mazar/bg image.jpg';
import feedingPigeons from './assets/Mazar/Feeding the Pigeons.webp';
import jalaliKobutor from './assets/Mazar/Jalali Kobutor.webp';
import kobutor from './assets/Mazar/Kobutor.jpg';
import mazarJpeg from './assets/Mazar/Mazar.jpeg';
import sPng from './assets/Mazar/S.png';
import sword from "./assets/Mazar/Shah Jalal's Sword.jpg";
import shahjalalMazar from "./assets/Mazar/Shahjalal-Mazar-Dargah-Shahjalal-Sylhet.jpg";

const mazarImages = [
  annualUrs,
  bgImage,
  feedingPigeons,
  jalaliKobutor,
  kobutor,
  mazarJpeg,
  sPng,
  sword,
  shahjalalMazar
];

const webImages = [
  "https://upload.wikimedia.org/wikipedia/commons/3/3e/Shahjalal_Mazar_Sylhet.jpg",
  "https://images.unsplash.com/photo-1464983953574-0892a716854b"
];

export default function Mazar() {
  return (
    <div style={{ padding: 24, background: 'linear-gradient(180deg, #f8f5ea 0%, #ffffff 100%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto 32px' }}>
        <div style={{ background: 'linear-gradient(135deg, #235B3F 0%, #153726 100%)', color: '#fff', borderRadius: 24, padding: '32px 28px', boxShadow: '0 18px 40px rgba(35, 91, 63, 0.18)' }}>
          <p style={{ margin: 0, color: '#d4af37', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 13 }}>Hazrat Shahjalal Mazar</p>
          <h2 style={{ margin: '10px 0 14px', fontSize: 38, lineHeight: 1.15 }}>হযরত শাহজালাল (রহ.) মাজার গ্যালারি</h2>
          <p style={{ margin: 0, maxWidth: 760, lineHeight: 1.7, color: 'rgba(255,255,255,0.9)' }}>
            শাহজালাল লাইব্রেরি কর্নারের আধ্যাত্মিক পরিচয়ের অন্যতম কেন্দ্র হলো হযরত শাহজালাল (রহ.) এর মাজার।
            এখানে মাজার প্রাঙ্গণ, জালালী কবুতর, উরস এবং দর্শনার্থীদের ঐতিহাসিক উপস্থিতির দৃশ্যগুলো একসাথে তুলে ধরা হয়েছে।
          </p>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
        {mazarImages.map((img, idx) => (
          <div key={idx} style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(212, 175, 55, 0.25)', boxShadow: '0 10px 26px rgba(0,0,0,0.08)' }}>
            <img src={img} alt={`Mazar ${idx}`} style={{ width: '100%', height: 260, objectFit: 'cover' }} />
            <div style={{ padding: 14 }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 18, color: '#235B3F' }}>মাজারের আলোকচিত্র {idx + 1}</h3>
              <p style={{ margin: 0, color: '#5b5b5b', lineHeight: 1.6 }}>হযরত শাহজালাল (রহ.) এর স্মৃতি, পরিবেশ ও দর্শনার্থীদের উপস্থিতির একটি অংশ।</p>
            </div>
          </div>
        ))}
        {webImages.map((img, idx) => (
          <div key={"web-"+idx} style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(35, 91, 63, 0.2)', boxShadow: '0 10px 26px rgba(0,0,0,0.08)' }}>
            <img src={img} alt={`Web Mazar ${idx}`} style={{ width: '100%', height: 260, objectFit: 'cover' }} />
            <div style={{ padding: 14 }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 18, color: '#235B3F' }}>ঐতিহাসিক দৃশ্য {idx + 1}</h3>
              <p style={{ margin: 0, color: '#5b5b5b', lineHeight: 1.6 }}>মাজার কেন্দ্রিক ঐতিহ্য, স্থাপত্য ও আধ্যাত্মিক আবহের অতিরিক্ত ভিজ্যুয়াল রেফারেন্স।</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 