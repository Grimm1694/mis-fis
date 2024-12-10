import { spawn } from 'child_process';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const scannerScript = path.join(process.cwd(), 'app', 'scanner.js');
  
  const scanProcess = spawn('node', [scannerScript]);
  console.log('test',scanProcess)

  scanProcess.on('close', (code) => {
    if (code === 0) {
      res.status(200).json({ filePath: '/scanned_image.png' });
    } else {
      res.status(500).json({ message: 'Scanning failed' });
    }
  });
}