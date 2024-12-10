"use client"

import { useState } from 'react';

export default function ScannerComponent() {
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
      });
      const data = await response.json();
      console.log('msg',data)


      if (response.ok) {
        setImagePath(data.filePath);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred while scanning');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImagePath(null);
    setError(null);
  };

  return (
    <div>
      <button onClick={handleScan} disabled={loading}>
        {loading ? 'Scanning...' : 'Scan Document'}
      </button>
      {imagePath && (
        <div>
          <h3>Scanned Image:</h3>
          <img src={imagePath} alt="Scanned Document" />
          <button onClick={handleReset}>Scan Again</button>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

