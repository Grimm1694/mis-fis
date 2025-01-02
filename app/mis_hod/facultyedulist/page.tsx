'use client'; // Ensure the component is rendered client-side

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Select from 'react-select';
import dynamic from 'next/dynamic';
import { Parser } from 'json2csv';

const EducationTable = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [educationTypes, setEducationTypes] = useState<{ label: string; value: string }[]>([]);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [error, setError] = useState('');
  const [branch, setBranch] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // New state for search functionality

  // Fetch branch only on the client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedBranch = sessionStorage.getItem('departmentName');
      if (storedBranch) {
        setBranch(storedBranch);
      } else {
        setError('Branch not found in session');
      }
    }
  }, []);

  // Fetch education data
  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        if (!branch) return; // Wait for branch to load

        const response = await fetch(`/api/hod/fac_edu?branches=${encodeURIComponent(branch)}`);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result.data);
        setFilteredData(result.data);

        // Extract unique education types for the dropdown
        const uniqueEducationTypes = Array.from(
          new Set(result.data.map((item: any) => item.Program))
        ).map((type) => ({ label: type, value: type }));
        setEducationTypes(uniqueEducationTypes);
      } catch (error: any) {
        setError(`Failed to load education data: ${error.message}`);
      }
    };

    fetchEducationData();
  }, [branch]);

  const handleEducationFilter = (selectedOption: any) => {
    setSelectedEducation(selectedOption);
    if (!selectedOption) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item: any) => item.Program === selectedOption.value);
      setFilteredData(filtered);
    }
  };

  const exportToCSV = () => {
    try {
      if (filteredData.length === 0) {
        alert('No data available to export.');
        return;
      }

      const headers = [
        'Sl. No.',
        'Faculty Name',
        'Program',
        'Reg No',
        'School/College',
        'Specialization',
        'Medium',
        'Pass Class',
        'Year of Award'
      ];

      const rows = filteredData.map((row, idx) => ({
        'Sl. No.': idx + 1,
        'Faculty Name': row.faculty_name || 'N/A',
        Program: row.Program,
        'Reg No': row.regNo,
        'School/College': row.schoolCollege,
        Specialization: row.specialization,
        Medium: row.mediumOfInstruction,
        'Pass Class': row.passClass,
        'Year of Award': row.yearOfAward,
      }));

      const parser = new Parser({ fields: headers });
      const csv = parser.parse(rows);

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `education_data_${branch}_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert('An error occurred while exporting the data. Please try again.');
    }
  };

  // Function to handle search filtering
  const filterBySearch = (searchTerm: string, dataToFilter: any[]) => {
    if (!searchTerm) return dataToFilter;
    const lowerSearch = searchTerm.toLowerCase();
    return dataToFilter.filter((row: any) =>
      Object.values(row).some(val => val && val.toString().toLowerCase().includes(lowerSearch))
    );
  };

  // Whenever searchTerm changes, re-filter the data
  useEffect(() => {
    let finalData = [...data];

    // If an education filter is selected, apply it first
    if (selectedEducation) {
      finalData = finalData.filter((item: any) => item.Program === selectedEducation.value);
    }

    // Apply search filter
    finalData = filterBySearch(searchTerm, finalData);

    setFilteredData(finalData);
  }, [searchTerm, selectedEducation, data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Faculty Education Details</h1>
  
      {error && <p className="text-red-500 text-center">{error}</p>}
  
      <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
        <Select
          options={educationTypes}
          isClearable
          placeholder="Filter by Education Program"
          value={selectedEducation}
          onChange={handleEducationFilter}
          className="w-1/3"
          menuPortalTarget={document.body}
          styles={{
            menuPortal: base => ({ ...base, zIndex: 9999 })
          }}
        />

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>
  
      <div className="relative max-h-[400px] overflow-y-auto border border-gray-300 rounded-lg shadow-lg">
        <motion.table
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="table-auto w-full border-collapse"
        >
<thead className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
<tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Sl. No.</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Faculty Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Program</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Reg No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">School/College</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Specialization</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Medium</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Pass Class</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Year of Award</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row: any, idx) => (
                <motion.tr
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="hover:bg-gray-50"
                >
                  <td className="border border-gray-300 px-4 py-2">{idx + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.faculty_name || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.Program}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.regNo}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.schoolCollege}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.specialization}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.mediumOfInstruction}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.passClass}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.yearOfAward}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </motion.table>
      </div>
    </motion.div>
  );
};

export default dynamic(() => Promise.resolve(EducationTable), { ssr: false });
