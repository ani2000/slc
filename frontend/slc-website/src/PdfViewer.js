import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function PdfViewer() {
  const query = useQuery();
  const file = query.get('file');
  if (!file) {
    return <div style={{padding: 40, textAlign: 'center'}}>No PDF file specified.<br/><Link to="/teachings">Back to Teachings</Link></div>;
  }
  return (
    <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
      <div style={{background: '#235B3F', color: '#fff', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt="SUST Logo" style={{height: 36, marginRight: 12}} />
          <span style={{fontWeight: 700, fontSize: 20}}>Books Online PDF Viewer</span>
        </div>
        <Link to="/teachings" style={{color: '#fff', textDecoration: 'underline'}}>Back to Teachings</Link>
      </div>
      <iframe
        src={file}
        title="PDF Viewer"
        width="100%"
        height="100%"
        style={{border: 'none', flex: 1}}
      />
    </div>
  );
} 