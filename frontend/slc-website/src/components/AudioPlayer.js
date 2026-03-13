import React from 'react';

export default function AudioPlayer({ src, title = 'Audio', className = '' }) {
  if (!src) {
    return null;
  }

  return (
    <div className={className}>
      <span className="sr-only">{title}</span>
      <audio controls preload="metadata" src={src} style={{ width: '100%' }}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}