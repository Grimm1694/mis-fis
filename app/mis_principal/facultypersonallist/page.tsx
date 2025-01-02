'use client';

import { useEffect, useState } from 'react';
import Select from 'react-select';
import dynamic from 'next/dynamic';
import { Parser } from 'json2csv';

const FacultyTable = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [selectedBranches, setSelectedBranches] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'faculty_name', 'emailId', 'contactNo', 'qualification', 'firstAddressLine', 'designation', 'aided'
  ]);
  const [searchTerm, setSearchTerm] = useState(''); // Search by name

  const allColumns = [
    { key: 'employee_id', label: 'Employee ID' },
    { key: 'qualification', label: 'Qualification' },
    { key: 'department', label: 'Department' },
    { key: 'photo', label: 'Photo' },
    { key: 'title', label: 'Title' },
    { key: 'faculty_name', label: 'Faculty Name' },
    { key: 'emailId', label: 'Email ID' },
    { key: 'contactNo', label: 'Contact No' },
    { key: 'alternateContactNo', label: 'Alternate Contact No' },
    { key: 'emergencyContactNo', label: 'Emergency Contact No' },
    { key: 'adharNo', label: 'Adhar No' },
    { key: 'panNo', label: 'PAN No' },
    { key: 'dob', label: 'Date of Birth' },
    { key: 'gender', label: 'Gender' },
    { key: 'nationality', label: 'Nationality' },
    { key: 'firstAddressLine', label: 'First Address Line' },
    { key: 'correspondenceAddressLine', label: 'Correspondence Address Line' },
    { key: 'religion', label: 'Religion' },
    { key: 'caste', label: 'Caste' },
    { key: 'category', label: 'Category' },
    { key: 'motherTongue', label: 'Mother Tongue' },
    { key: 'speciallyChallenged', label: 'Specially Challenged' },
    { key: 'remarks', label: 'Remarks' },
    { key: 'languages', label: 'Languages' },
    { key: 'bankName', label: 'Bank Name' },
    { key: 'accountNo', label: 'Account No' },
    { key: 'accountName', label: 'Account Name' },
    { key: 'accountType', label: 'Account Type' },
    { key: 'branch', label: 'Branch' },
    { key: 'ifsc', label: 'IFSC' },
    { key: 'pfNumber', label: 'PF Number' },
    { key: 'uanNumber', label: 'UAN Number' },
    { key: 'pensionNumber', label: 'Pension Number' },
    { key: 'motherName', label: 'Mother Name' },
    { key: 'fatherName', label: 'Father Name' },
    { key: 'spouseName', label: 'Spouse Name' },
    { key: 'children', label: 'Children' },
    { key: 'dateOfJoiningDrait', label: 'Date of Joining' },
    { key: 'designation', label: 'Designation' },
    { key: 'aided', label: 'Aided' }
  ];

  const columnOptions = allColumns.map((col) => ({
    value: col.key,
    label: col.label
  }));

  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/hod/branches');
      if (!response.ok) {
        throw new Error(`Error fetching branches: ${response.statusText}`);
      }
      const result = await response.json();
      setBranches(result.data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchData = async () => {
    try {
      const branchFilter = selectedBranches.some((branch) => branch.value === 'all')
        ? ''
        : selectedBranches.map((branch) => branch.value).join(',');

      const url = branchFilter
        ? `/api/hod/fac_personal?branches=${encodeURIComponent(branchFilter)}`
        : '/api/principal/fac_personal'; // Default fetch for all branches

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.data.length > 0) {
        const columnNames = Object.keys(result.data[0]).filter(
          (key) => key !== 'id' && key !== 'isRegistered' && key !== 'faculty_name'
        );
        setColumns(columnNames);
      }

      setData(result.data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedBranches]);

  // Filter data by search term (faculty_name)
  useEffect(() => {
    let tempData = [...data];
    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      tempData = tempData.filter((row: any) =>
        row.faculty_name && row.faculty_name.toLowerCase().includes(lowerSearch)
      );
    }
    setFilteredData(tempData);
  }, [data, searchTerm]);

  const selectAllColumns = () => {
    // Include all columns, ensuring faculty_name is included
    const allKeys = allColumns.map((col) => col.key);
    if (!allKeys.includes('faculty_name')) {
      allKeys.unshift('faculty_name');
    }
    setVisibleColumns(allKeys);
  };

  const exportToCSV = () => {
    try {
      if (filteredData.length === 0) {
        alert('No data available to export.');
        return;
      }

      const fields = visibleColumns.map(
        (col) => allColumns.find((column) => column.key === col)?.label
      );

      const validFields = fields.filter((field): field is string => field !== undefined);

      const rows = filteredData.map((row, idx) =>
        visibleColumns.reduce(
          (acc, col) => {
            const columnLabel = allColumns.find((column) => column.key === col)?.label || col;
            acc[columnLabel] = row[col] || '-';
            return acc;
          },
          { 'Sl. No': (idx + 1).toString() }
        )
      );

      const json2csvParser = new Parser({ fields: ['Sl. No', ...validFields] });
      const csv = json2csvParser.parse(rows);

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `faculty_data_${selectedBranches.map((b) => b.label).join('_') || 'all'}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting CSV:', err);
    }
  };

  const branchOptions = [
    { value: 'all', label: 'All Branches' },
    ...branches.map((branch: any) => ({
      value: branch.brcode,
      label: branch.brcode_title
    }))
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Faculty Details</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <label className="block mb-2 font-medium">Filter by Branch:</label>
        <Select
          options={branchOptions}
          value={selectedBranches}
          onChange={(selected) => setSelectedBranches(selected || [])}
          isMulti
          placeholder="Select branches"
          menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
        />
      </div>

      <div className="mb-4 flex flex-col gap-4">
  <div>
    <label className="block mb-2 font-medium">Select Columns:</label>
    <Select
      options={columnOptions}
      isMulti
      value={columnOptions.filter((col) => visibleColumns.includes(col.value))}
      onChange={(selectedOptions) => {
        const selectedKeys = selectedOptions.map((option: any) => option.value);
        // Ensure faculty_name is always included
        if (!selectedKeys.includes('faculty_name')) selectedKeys.unshift('faculty_name');
        setVisibleColumns(selectedKeys);
      }}
      menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      }}
      className="w-full"
    />
  </div>

  <div className="flex items-center gap-4 flex-wrap">
    <button
      onClick={selectAllColumns}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Select All Columns
    </button>

    <div className="flex-1">
      <input
        type="text"
        placeholder="Enter faculty name..."
        className="border p-2 rounded w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    <button
      onClick={exportToCSV}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Export CSV
    </button>
  </div>
</div>


      <div className="relative max-h-[400px] overflow-y-auto overflow-x-auto border border-gray-300 rounded-lg shadow-lg">
        <table className="table-auto w-full border-collapse">
        <thead className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Sl. No</th>
              {visibleColumns.map((col) => (
                <th key={col} className="border border-gray-300 px-4 py-2 text-left">
                  {columnOptions.find((column) => column.value === col)?.label || col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row: any, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{idx + 1}</td>
                  {visibleColumns.map((col) => (
                    <td key={col} className="border border-gray-300 px-4 py-2">
                      {col === 'aided' ? (row[col] === 1 ? 'YES' : 'NO') : row[col] || '-'}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={visibleColumns.length + 1} className="text-center py-4 text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(FacultyTable), { ssr: false });
