import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5010/api';
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

function BookCover({ coverImageUrl, pdfUrl, title }) {
  const [showPdfCover, setShowPdfCover] = useState(false);

  useEffect(() => {
    if (!coverImageUrl) setShowPdfCover(true);
  }, [coverImageUrl]);

  if (coverImageUrl) {
    return <img src={coverImageUrl} alt={title} style={{ width: 80, height: 120, objectFit: 'cover' }} />;
  }

  // Fallback: Render first page of PDF as cover
  return (
    <div style={{ width: 80, height: 120, overflow: 'hidden', border: '1px solid #ccc', background: '#f9f9f9' }}>
      {showPdfCover && pdfUrl && (
        <Document file={pdfUrl} loading="" noData="">
          <Page pageNumber={1} width={80} />
        </Document>
      )}
    </div>
  );
}

export default function Books() {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/content/all`)
      .then(res => res.json())
      .then(data => setBooks(data.books || []));
  }, []);
  return (
    <div style={{ padding: 24 }}>
      <h2>Books (from Backend)</h2>
      <ul>
        {books.map((book, idx) => (
          <li key={idx} style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
            <BookCover
              coverImageUrl={book.coverImageUrl ? `${API_ORIGIN}/${book.coverImageUrl}` : null}
              pdfUrl={book.pdfUrl ? `${API_ORIGIN}/${book.pdfUrl}` : book.file}
              title={book.title}
            />
            <div style={{ marginLeft: 16 }}>
              <div style={{ fontWeight: 'bold' }}>{book.title}</div>
              <a href={book.pdfUrl ? `${API_ORIGIN}/${book.pdfUrl}` : book.file} target="_blank" rel="noopener noreferrer">Read PDF</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const books = [
  {
    title: "Contribution of Shah Jalal in the Context of Bengal Islamization",
    file: process.env.PUBLIC_URL + "/Books/Contribution of Shah Jalal in the Context of Bengal Islamization.pdf"
  },
  {
    title: "Prominent Sufi Order among Tasawwuf of Bangladesh",
    file: process.env.PUBLIC_URL + "/Books/Prominent Sufi Order among Tasawwuf of Bangladesh.pdf"
  },
  {
    title: "Short Biography on Shahjalal(R)",
    file: process.env.PUBLIC_URL + "/Books/Short Biography on Shahjalal(R).pdf"
  },
  {
    title: "Socio-Spiritual and Economic Practices of Mazar (Holy Shrine)",
    file: process.env.PUBLIC_URL + "/Books/Socio-Spiritual and Economic Practices of Mazar (Holy Shrine).pdf"
  },
  {
    title: "Spiritual Tourism in Bangladesh",
    file: process.env.PUBLIC_URL + "/Books/Spiritual Tourism in Bangladesh.pdf"
  },
  {
    title: "study on Sufi Saints in Karimganj District of Assam",
    file: process.env.PUBLIC_URL + "/Books/study on Sufi Saints in Karimganj District of Assam.pdf"
  },
  {
    title: "quran-bengali",
    file: process.env.PUBLIC_URL + "/Books/quran-bengali.pdf"
  }
]; 