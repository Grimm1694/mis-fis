"use client";

import { useState, useEffect } from 'react';

// Define the type for imported data
type StudentData = {
  AdmissionYear: string;
  USNO: string;
  SName: string;
  FName: string;
  MName: string;
  
  DOB: string;
  Gender: string;
  PhysicallyChallenged: number
  EmailStudent: string;
  PhoneStudent: string;
  
  PhoneParent: string;
  PhoneGardian: string;
  BloodGroup: string;
  AdhaarNum: string;
  FOccupation: string; 
  
  AnnualIncome: number;
  Nationality: string;
  Relegion: string;
  Caste: string;
  Category: number; 
  
  State: string;
  District: string;
  PermanentAddr: string;
  LocalAddr: string;
  SSLCPer: number;
  
  PUCPer: number;
  PhyMarks: number;
  CheMarks: number;
  MathsMarks: number;
  PCMTotal: number;
  
  PCMPer: number;
  QualExam: string;
  Board: string;
  StatePUC: string;
  PUCUsn: string;
  
  YearPass: number;
  RankFrom: string;
  CETReg: string;
  CETRank: string;
  SeatAllotDate: string;
  
  CategoryClaimed: string;
  CategoryAlloted: string;
  Course: string;
  AdmDate: string;
  AmtClg: number;
 
  ClgRectNo: string;
  ClgRectDate: string;
  AmtCET: number;
  Semester: number;
  Quota: string;

  ClgCode: string;
  CETNo: string;
  DocumentSubmitted: string;
  Document2Submit: string;
};

const excelDateToJSDateString = (serial:any) => {
  const utcDays = serial - 25569;
  const utcValue = utcDays * 86400 * 1000;
  const dateInfo = new Date(utcValue);

  const year = dateInfo.getFullYear();
  const month = String(dateInfo.getMonth() + 1).padStart(2, '0');
  const day = String(dateInfo.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [rowsImported, setRowsImported] = useState<number | null>(null);
  const [importedData, setImportedData] = useState<StudentData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false); // New state for hiding the form
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

   /*  try {
      const response = await fetch('/api/import_excel', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setRowsImported(data.rowsImported);
        setImportedData(data.importedData);
        setShowModal(true);
        setUploadSuccess(true); // Hide form after successful upload

        // Hide the modal after 3 seconds
        setTimeout(() => {
          setShowModal(false);
          scrollToTop(); // Automatically scroll to the top
        }, 3000);
      } else {
        alert(data.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to upload file.');
    }
  };
 */

  try {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/import_excel_adm', true);

    // Update progress bar
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentCompleted);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        setRowsImported(response.rowsImported);
        setImportedData(response.importedData);
        setShowModal(true);
        setUploadSuccess(true);

        // Hide the modal after 3 seconds
        setTimeout(() => {
          setShowModal(false);
          scrollToTop(); // Automatically scroll to the top
        }, 3000);
      } else {
        const response = JSON.parse(xhr.responseText);
        alert(response.error || 'Something went wrong.');
      }
    };

    xhr.onerror = () => {
      alert('Failed to upload file.');
    };

    xhr.send(formData);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to upload file.');
  }
};
  // Scroll to top function to bring the table into view
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen pt-0 bg-gray-100 p-4">
    
      {/* Hide the form when upload is successful */}
      {!uploadSuccess && (
        <div className="bg-white p-6 rounded-lg shadow-lg w-screen max-w-md">
          <h1 className="text-2xl font-bold mb-4">Upload Excel File</h1>

          <form onSubmit={handleSubmit}>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="w-full border p-2 mb-4"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded w-full"
            >
              Upload
            </button>
          </form>
          {/* Progress Bar */}
          
          {uploadProgress > 0 && (
            <div className="w-full bg-gray-300 rounded mt-4">
              <div
                className="bg-blue-500 text-xs font-medium text-white text-center p-0.5 leading-none rounded"
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress}%
              </div>
            </div>
          )}
        </div>
      )}
      
      
      {/* Modal for showing success message */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-2">Import Successful</h2>
            <p>{rowsImported} rows have been imported.</p>
          </div>
        </div>
      )}
      
      
        {/* Data table displayed directly on the page after modal disappears */}
        {uploadSuccess && rowsImported !== null && (
          <div className="mt-2 bg-white p-6 rounded-lg shadow-lg w-full ">
            <h2 className="text-lg font-semibold mb-4">Data Imported</h2>
            <table className="table-auto w-full mt-4">
              <thead>
                <tr className="bg-gray-200">
                <th className="px-4 py-2">AdmissionYear</th>
                  <th className="px-4 py-2">USNO</th>
                  <th className="px-4 py-2">SName</th>
                  <th className="px-4 py-2">FName</th>
                  <th className="px-4 py-2">MName</th>

                  <th className="px-4 py-2">DOB</th>
                  <th className="px-4 py-2">Gender</th>
                  <th className="px-4 py-2">PhysicallyChallenged</th>
                  <th className="px-4 py-2">EmailStudent</th>
                  <th className="px-4 py-2">PhoneStudent</th>

                  <th className="px-4 py-2">PhoneParent</th>
                  <th className="px-4 py-2">PhoneGardian</th>
                  <th className="px-4 py-2">BloodGroup</th>
                  <th className="px-4 py-2">AdhaarNum</th>
                  <th className="px-4 py-2">FOccupation</th>

                  <th className="px-4 py-2">AnnualIncome</th>
                  <th className="px-4 py-2">Nationality</th>
                  <th className="px-4 py-2">Relegion</th>
                  <th className="px-4 py-2">Caste</th>
                  <th className="px-4 py-2">Category</th>

                  <th className="px-4 py-2">State</th>
                  <th className="px-4 py-2">District</th>
                  <th className="px-4 py-2">PermanentAddr</th>
                  <th className="px-4 py-2">LocalAddr</th>
                  <th className="px-4 py-2">SSLCPer</th>

                  <th className="px-4 py-2">PUCPer</th>
                  <th className="px-4 py-2">PhyMarks</th>
                  <th className="px-4 py-2">CheMarks</th>
                  <th className="px-4 py-2">MathsMarks</th>
                  <th className="px-4 py-2">PCMTotal</th>

                  <th className="px-4 py-2">PCMPer</th>
                  <th className="px-4 py-2">QualExam</th>
                  <th className="px-4 py-2">Board</th>
                  <th className="px-4 py-2">StatePUC</th>
                  <th className="px-4 py-2">PUCUsn</th>

                  <th className="px-4 py-2">YearPass</th>
                  <th className="px-4 py-2">RankFrom</th>
                  <th className="px-4 py-2">CETReg</th>
                  <th className="px-4 py-2">CETRank</th>
                  <th className="px-4 py-2">SeatAllotDate</th>

                  <th className="px-4 py-2">CategoryClaimed</th>
                  <th className="px-4 py-2">CategoryAlloted</th>
                  <th className="px-4 py-2">Course</th>
                  <th className="px-4 py-2">AdmDate</th>
                  <th className="px-4 py-2">AmtClg</th>

                  <th className="px-4 py-2">ClgRectNo</th>
                  <th className="px-4 py-2">ClgRectDate</th>
                  <th className="px-4 py-2">AmtCET</th>
                  <th className="px-4 py-2">Semester</th>
                  <th className="px-4 py-2">Quota</th>

                  <th className="px-4 py-2">ClgCode</th>
                  <th className="px-4 py-2">CETNo</th>
                  <th className="px-4 py-2">DocumentSubmitted</th>
                  <th className="px-4 py-2">Document2Submit</th>
                </tr>
              </thead>
              <tbody>
                {importedData.map((row, index) => (
                  <tr key={index} className="bg-white">
                    <td className="border px-4 py-2">
                    {typeof row.AdmissionYear === 'number' ? excelDateToJSDateString(row.AdmissionYear) : row.AdmissionYear}</td>
                    {/* <td className="border px-4 py-2">{row.AdmissionYear}</td> */}
                    <td className="border px-4 py-2">{row.USNO}</td>
                    <td className="border px-4 py-2">{row.SName}</td>
                    <td className="border px-4 py-2">{row.FName}</td>
                    <td className="border px-4 py-2">{row.MName}</td>

                    <td className="border px-4 py-2">
                    {typeof row.DOB === 'number' ? excelDateToJSDateString(row.DOB) : row.DOB}</td>
                    {/* <td className="border px-4 py-2">{row.DOB}</td> */}
                    <td className="border px-4 py-2">{row.Gender}</td>
                    <td className="border px-4 py-2">{row.PhysicallyChallenged}</td>
                    <td className="border px-4 py-2">{row.EmailStudent}</td>
                    <td className="border px-4 py-2">{row.PhoneStudent}</td>

                    <td className="border px-4 py-2">{row.PhoneParent}</td>
                    <td className="border px-4 py-2">{row.PhoneGardian}</td>
                    <td className="border px-4 py-2">{row.BloodGroup}</td>
                    <td className="border px-4 py-2">{row.AdhaarNum}</td>
                    <td className="border px-4 py-2">{row.FOccupation}</td>

                    <td className="border px-4 py-2">{row.AnnualIncome}</td>
                    <td className="border px-4 py-2">{row.Nationality}</td>
                    <td className="border px-4 py-2">{row.Relegion}</td>
                    <td className="border px-4 py-2">{row.Caste}</td>
                    <td className="border px-4 py-2">{row.Category}</td>

                    <td className="border px-4 py-2">{row.State}</td>
                    <td className="border px-4 py-2">{row.District}</td>
                    <td className="border px-4 py-2">{row.PermanentAddr}</td>
                    <td className="border px-4 py-2">{row.LocalAddr}</td>
                    <td className="border px-4 py-2">{row.SSLCPer}</td>

                    <td className="border px-4 py-2">{row.PUCPer}</td>
                    <td className="border px-4 py-2">{row.PhyMarks}</td>
                    <td className="border px-4 py-2">{row.CheMarks}</td>
                    <td className="border px-4 py-2">{row.MathsMarks}</td>
                    <td className="border px-4 py-2">{row.PCMTotal}</td>
                    
                    <td className="border px-4 py-2">{row.PCMPer}</td>                    
                    <td className="border px-4 py-2">{row.QualExam}</td>
                    <td className="border px-4 py-2">{row.Board}</td>
                    <td className="border px-4 py-2">{row.StatePUC}</td>
                    <td className="border px-4 py-2">{row.PUCUsn}</td>

                    <td className="border px-4 py-2">{row.YearPass}</td>
                    <td className="border px-4 py-2">{row.RankFrom}</td>
                    <td className="border px-4 py-2">{row.CETReg}</td>
                    <td className="border px-4 py-2">{row.CETRank}</td>
                    <td className="border px-4 py-2">
                    {typeof row.SeatAllotDate === 'number' ? excelDateToJSDateString(row.SeatAllotDate) : row.SeatAllotDate}</td>
                    {/* <td className="border px-4 py-2">{row.SeatAllotDate}</td> */}

                    <td className="border px-4 py-2">{row.CategoryClaimed}</td>
                    <td className="border px-4 py-2">{row.CategoryAlloted}</td>
                    <td className="border px-4 py-2">{row.Course}</td>
                    <td className="border px-4 py-2">
                    {typeof row.AdmDate === 'number' ? excelDateToJSDateString(row.AdmDate) : row.AdmDate}</td>
                    {/* <td className="border px-4 py-2">{row.AdmDate}</td> */}
                    <td className="border px-4 py-2">{row.AmtClg}</td>

                    <td className="border px-4 py-2">{row.ClgRectNo}</td>
                    <td className="border px-4 py-2">
                    {typeof row.ClgRectDate === 'number' ? excelDateToJSDateString(row.ClgRectDate) : row.ClgRectDate}</td>
                    {/* <td className="border px-4 py-2">{row.ClgRectDate}</td> */}
                    <td className="border px-4 py-2">{row.AmtCET}</td>
                    <td className="border px-4 py-2">{row.Semester}</td>
                    <td className="border px-4 py-2">{row.Quota}</td>
                    
                    <td className="border px-4 py-2">{row.ClgCode}</td>
                    <td className="border px-4 py-2">{row.CETNo}</td>
                    <td className="border px-4 py-2">{row.DocumentSubmitted}</td>
                    <td className="border px-4 py-2">{row.Document2Submit}</td>
                  </tr>
                ))}
              </tbody>
            </table >
          </div>
        
      )}
    </div>
  );
}
