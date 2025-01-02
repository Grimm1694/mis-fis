'use client';

import { useEffect, useState } from 'react';
import Select from 'react-select';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
// Helper function to format dates
const formatDate = (dateString: any) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-'; // Handle invalid dates
  return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getFullYear()}`;
};

// Helper function to sanitize values
const sanitizeValue = (val: any) => {
  if (!val || val === 'N/A' || val === 'nil' || val === '0') return '-';
  return val;
};

const TableDisplay = () => {
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Search by faculty name

  const tableDisplayNames: { [key: string]: string } = {
    fac_outreach: 'Outreach Activity',
    fac_awards: 'Awards and Recognition',
    fac_respon: 'Additional Responsibilities',
    fac_industry: 'Industrial Experience',
    fac_teach: 'Teaching Experience',
  };

  const tableHeaders: { [key: string]: { label: string; key: string; isDate?: boolean }[] } = {
    fac_outreach: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Faculty Name', key: 'faculty_name' },
      { label: 'Activity', key: 'activity' },
      { label: 'Role', key: 'role' },
      { label: 'From Date', key: 'fromDate', isDate: true },
      { label: 'To Date', key: 'toDate', isDate: true },
      { label: 'Place', key: 'place' },
    ],
    fac_awards: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Faculty Name', key: 'faculty_name' },
      { label: 'Recognition or Award Received', key: 'recognitionorawardReceived' },
      { label: 'Recognition or Award From', key: 'recognitionorawardFrom' },
      { label: 'Award Date', key: 'recognitionorawardDate', isDate: true },
    ],
    fac_respon: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Faculty Name', key: 'faculty_name' },
      { label: 'Level', key: 'level' },
      { label: 'From Date', key: 'fromDate', isDate: true },
      { label: 'To Date', key: 'toDate', isDate: true },
      { label: 'Responsibility', key: 'responsibility' },
    ],
    fac_industry: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Faculty Name', key: 'faculty_name' },
      { label: 'Organization', key: 'organization' },
      { label: 'Designation', key: 'designation' },
      { label: 'From Date', key: 'fromDate', isDate: true },
      { label: 'To Date', key: 'toDate', isDate: true },
    ],
    fac_teach: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Faculty Name', key: 'faculty_name' },
      { label: 'Institute Name', key: 'instituteName' },
      { label: 'From Date', key: 'fromDate', isDate: true },
      { label: 'To Date', key: 'toDate', isDate: true },
      { label: 'Designation', key: 'Designation' },
      { label: 'Department Name', key: 'departmentName' },
    ],
  };

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch('/api/hod/branches');
        if (!response.ok) {
          throw new Error(`Error fetching branches: ${response.statusText}`);
        }
        const result = await response.json();
        // Add "All Branches" option
        const allBranchOption = { value: 'ALL', label: 'All Branches' };
        const branchOptions = [allBranchOption, ...result.data.map((b: any) => ({ value: b.brcode, label: b.brcode_title }))];
        setBranches(branchOptions);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchBranches();
  }, []);

  // Fetch table data
  const fetchTableData = async (tableName: string) => {
    const isAllBranches = selectedBranches.some((branch: any) => branch.value === 'ALL');
    const branchFilter = isAllBranches
      ? ''
      : selectedBranches.map((branch: any) => branch.value).join(',');

    const apiPrefix = isAllBranches ? '/api/principal' : '/api/hod';
    const endpoint = `${apiPrefix}/${tableName}${branchFilter ? `?branches=${encodeURIComponent(branchFilter)}` : ''}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Error fetching ${tableName} data: ${response.statusText}`);
      }
      const result = await response.json();

      setTableData(result.data);
      setFilteredData(result.data); // Initialize filtered data
      setError('');
    } catch (err: any) {
      setError(err.message);
      setTableData([]);
      setFilteredData([]);
    }
  };

  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable);
    }
  }, [selectedTable, selectedBranches]);

  // Re-filter data whenever date or searchTerm changes
  useEffect(() => {
    let tempData = [...tableData];

    // Filter by date if both start and end are selected
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const dateField = selectedTable
        ? tableHeaders[selectedTable].find((header) => header.isDate)?.key
        : null;

      if (dateField) {
        tempData = tempData.filter((row: any) => {
          if (!row[dateField]) return false;
          const rowDate = new Date(row[dateField]);
          return rowDate >= start && rowDate <= end;
        });
      }
    }

    // Filter by search term (faculty_name)
    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      tempData = tempData.filter((row: any) =>
        row.faculty_name && row.faculty_name.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredData(tempData);
  }, [startDate, endDate, searchTerm, tableData, selectedTable]);

  const exportToCSV = () => {
    try {
      if (filteredData.length === 0) {
        alert('No data available to export.');
        return;
      }

      const headers = tableHeaders[selectedTable].map((header) => header.label);
      const rows = filteredData.map((row, idx) => {
        const rowObj: any = { 'Sl. No': (idx + 1).toString() };
        tableHeaders[selectedTable].forEach((header) => {
          let val = header.isDate && row[header.key]
            ? formatDate(row[header.key])
            : sanitizeValue(row[header.key]);
          rowObj[header.label] = val;
        });
        return rowObj;
      });

      const csvContent = [
        headers.join(','),
        ...rows.map((row) =>
          Object.values(row)
            .map((value) => `"${value}"`)
            .join(',')
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `faculty_data_${selectedTable}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting CSV:', err);
    }
  };

  const renderTable = () => {
    if (!selectedTable || filteredData.length === 0) {
      return <p className="text-center mt-6">No data available for the selected table.</p>;
    }

    const headers = tableHeaders[selectedTable];

    return (
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto border border-gray-300 rounded-lg shadow-lg">
        <table className="table-auto w-full border-collapse">
          <thead className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-sm font-semibold border border-gray-300"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <tr
                key={idx}
                className={`${
                  idx % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                } hover:bg-blue-100`}
              >
                {headers.map((header, index) => (
                  <td key={index} className="px-6 py-3 text-sm border border-gray-300">
                    {header.key === 'slno'
                      ? idx + 1
                      : header.isDate
                      ? formatDate(row[header.key])
                      : sanitizeValue(row[header.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">Faculty Data</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">Select Branches:</label>
        <Select
          options={branches}
          isMulti
          placeholder="Select branches"
          value={selectedBranches}
          onChange={setSelectedBranches}
          className="shadow-lg"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: '#f8f9fa',
              borderColor: '#ced4da',
              ':hover': { borderColor: '#a1a1a1' },
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: '#ffffff',
              zIndex: 9999,
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected ? '#cce5ff' : state.isFocused ? '#e2e6ea' : '#ffffff',
              ':active': { backgroundColor: '#cce5ff' },
            }),
          }}
        />
      </div>

      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {Object.keys(tableHeaders).map(table => (
          <button
            key={table}
            onClick={() => setSelectedTable(table)}
            className={`px-4 py-2 rounded-md ${
              selectedTable === table
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
            }`}
          >
            {tableDisplayNames[table]}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
        
        <input
          type="text"
          placeholder="Search by Faculty Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      {renderTable()}
    </div>
  );
};

export default dynamic(() => Promise.resolve(TableDisplay), { ssr: false });