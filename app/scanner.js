// scanner.js
const ffi = require('ffi-napi');
const path = require('path');

// Load the EZTwain DLL
const ezTwain = ffi.Library(path.join(__dirname, 'public', 'Eztwain4.dll'), {
  'TWAIN_AcquireToFilename': ['int', ['string']],
  'TWAIN_SelectImageSource': ['int', []]
});

console.log('eztwain', ezTwain)
// Example function to scan a document
function scanDocument(outputFile) {
  const selectSourceResult = ezTwain.TWAIN_SelectImageSource();
  if (selectSourceResult === 0) {
    console.error('Failed to select scanner');
    return;
  }
  const acquireResult = ezTwain.TWAIN_AcquireToFilename(outputFile);
  if (acquireResult !== 0) {
    console.error('Scanning failed');
  } else {
    console.log('Scan completed. File saved to', outputFile);
  }
}

// Call the function
scanDocument(path.join(__dirname, 'scanned_image.png'));
