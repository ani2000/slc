import React, { useState } from 'react';
import InfoModal from '../components/InfoModal';

const shahjalalBrief = (
  <>
    <h3 className="text-lg font-semibold mb-2 text-green-700">The Blessed Journey</h3>
    <p>
      Hazrat Shahjalal (R.A.) was born in Yemen, trained in spirituality, and led a historic mission to Sylhet, Bangladesh. His journey included miracles, battles, and the spread of Islam, leaving a lasting legacy in the region. His shrine in Sylhet is a major spiritual center.
    </p>
  </>
);

const auliyasBrief = (
  <>
    <h3 className="text-lg font-semibold mb-2 text-blue-700">The Noble Companions</h3>
    <p>
      Hazrat Shahjalal's 360 companions were scholars, saints, and leaders who helped spread Islam and establish spiritual centers across Bengal. Their shrines and legacies remain vital to the region's culture and faith.
    </p>
  </>
);

export default function HazratPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  const handleCardClick = (type) => {
    if (type === 'shahjalal') {
      setModalTitle('Life of Hazrat Shahjalal (Rah.)');
      setModalContent(shahjalalBrief);
    } else if (type === 'auliyas') {
      setModalTitle('360 Auliyas');
      setModalContent(auliyasBrief);
    }
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
      {/* Section 1: Shahjalal */}
      <section className="max-w-4xl mx-auto mb-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-green-900 mb-2 drop-shadow">Life of Hazrat Shahjalal (Rah.)</h1>
          <p className="text-lg text-gray-700">
            Discover the inspiring journey and legacy of Hazrat Shahjalal (R.A.), a spiritual icon of Sylhet.
          </p>
        </div>
        <div className="flex justify-center">
          <div
            className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md cursor-pointer border-2 border-green-200 hover:border-green-400 hover:shadow-2xl transition-all duration-200"
            onClick={() => handleCardClick('shahjalal')}
          >
            <h2 className="text-2xl font-bold text-green-800 mb-2">Life of Hazrat Shahjalal (Rah.)</h2>
            <p className="text-gray-600">Click to read a brief description of his journey and legacy.</p>
          </div>
        </div>
      </section>

      {/* Section 2: Top 5 Auliyas (Companions) */}
      <section className="max-w-7xl mx-auto mb-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2 drop-shadow">Top 5 Auliyas (Companions)</h1>
          <p className="text-lg text-gray-700">
            The most prominent companions of Hazrat Shahjalal (Rah.) played vital roles in the spiritual and social transformation of Bengal. Here are five of the most renowned auliyas. Click on any card to read the detailed description.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Shah Paran */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 min-h-[180px] flex flex-col justify-between hover:shadow-lg transition cursor-pointer">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Hazrat Shah Paran (R.A.)</h2>
            <p className="font-semibold text-gray-700 mb-1">The Beloved Nephew and Spiritual Successor</p>
            <p className="text-base text-gray-800 mb-1"><span className="font-bold">Origin:</span> Hadhramaut, Yemen</p>
            <p className="text-base text-gray-800"><span className="font-bold">Brief:</span> Guided Sylhet after Shah Jalal, built mosques and teaching centers. His shrine is a major pilgrimage site in Khadim Nagar, Sylhet.</p>
          </div>
          {/* Shah Kamal */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 min-h-[180px] flex flex-col justify-between hover:shadow-lg transition cursor-pointer">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Hazrat Shah Kamal al-Yemeni (R.A.)</h2>
            <p className="font-semibold text-gray-700 mb-1">Founder of Shaharpara</p>
            <p className="text-base text-gray-800 mb-1"><span className="font-bold">Origin:</span> Yemen or Mecca (Qurayshi lineage)</p>
            <p className="text-base text-gray-800"><span className="font-bold">Brief:</span> Established the spiritual village of Shaharpara, Sunamganj. His lineage became highly influential in the region.</p>
          </div>
          {/* Syed Nasiruddin */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 min-h-[180px] flex flex-col justify-between hover:shadow-lg transition cursor-pointer">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Syed Nasiruddin (Sipah Salar)</h2>
            <p className="font-semibold text-gray-700 mb-1">Commander-in-Chief of the Army</p>
            <p className="text-base text-gray-800 mb-1"><span className="font-bold">Origin:</span> Baghdad, Iraq</p>
            <p className="text-base text-gray-800"><span className="font-bold">Brief:</span> Key figure in the conquest of Sylhet, established a khanqah in Fenchuganj. Revered for his wisdom and leadership.</p>
          </div>
          {/* Haydar Ghazi */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 min-h-[180px] flex flex-col justify-between hover:shadow-lg transition cursor-pointer">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Haydar Ghazi (Nūr al-Hudā)</h2>
            <p className="font-semibold text-gray-700 mb-1">Second Wazir (Governor) of Sylhet</p>
            <p className="text-base text-gray-800 mb-1"><span className="font-bold">Origin:</span> Arab Descent, likely from Yemen</p>
            <p className="text-base text-gray-800"><span className="font-bold">Brief:</span> Known for piety and wise rule, later governed Sonargaon, a major city of Bengal Sultanate.</p>
          </div>
          {/* Shah Tajuddin */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 min-h-[180px] flex flex-col justify-between hover:shadow-lg transition cursor-pointer">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Hazrat Shah Tajuddin al-Qureshi (R.A.)</h2>
            <p className="font-semibold text-gray-700 mb-1">The Chief Jurist and Qadi</p>
            <p className="text-base text-gray-800 mb-1"><span className="font-bold">Origin:</span> Quraysh Tribe, Arabian Peninsula</p>
            <p className="text-base text-gray-800"><span className="font-bold">Brief:</span> Established Islamic law and justice in Sylhet, issued fatwas and guided the new community.</p>
          </div>
        </div>
      </section>

      <InfoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        content={modalContent}
      />
    </div>
  );
}