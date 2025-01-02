'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Parser } from 'json2csv'; // Ensure this library is installed
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

// Define your table headers here
const tableHeaders: Record<string, { label: string; key: string; isDate?: boolean }[]> = {
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

const defaultDate = "15/02/2022";

// Function to fix fromDate and toDate fields
const fixDateFields = (data: any[], tableName: string) => {
  const headers = tableHeaders[tableName];
  const fromDateHeader = headers.find(h => h.key === 'fromDate');
  const toDateHeader = headers.find(h => h.key === 'toDate');

  // If the table does not have fromDate and toDate fields, return data as is
  if (!fromDateHeader || !toDateHeader) return data;

  return data.map(item => {
    let fromVal = item[fromDateHeader.key];
    let toVal = item[toDateHeader.key];

    if (!fromVal && !toVal) {
      // Both are null or empty
      fromVal = defaultDate;
      toVal = defaultDate;
    } else if (!fromVal && toVal) {
      // fromDate is null, toDate is not
      fromVal = toVal;
    } else if (fromVal && !toVal) {
      // toDate is null, fromDate is not
      toVal = fromVal;
    }

    return { ...item, [fromDateHeader.key]: fromVal, [toDateHeader.key]: toVal };
  });
};

const TableDisplay = () => {
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [branch, setBranch] = useState('');
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // search term state

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

  const fetchTableData = async (tableName: string) => {
    if (!branch) {
      setError('Branch is not set. Cannot fetch data.');
      return;
    }

    try {
      const response = await fetch(`/api/hod/${tableName}?branches=${encodeURIComponent(branch)}`);
      if (!response.ok) {
        throw new Error(`Error fetching ${tableName} data: ${response.statusText}`);
      }

      const result = await response.json();
      const hasDateFields = tableHeaders[tableName].some((header) => header.isDate);
      setIsDateFilterActive(hasDateFields);

      // Fix date fields before setting the state
      const fixedData = fixDateFields(result.data, tableName);

      setTableData(fixedData);
      setFilteredData(fixedData);
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
  }, [selectedTable]);

  const filterByDate = () => {
    let filtered = [...tableData];
    if (startDate && endDate && isDateFilterActive) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      filtered = filtered.filter((row) => {
        const dateField = tableHeaders[selectedTable].find((header) => header.isDate)?.key;
        if (!dateField || !row[dateField]) return false;
        const rowDate = new Date(row[dateField]);
        return rowDate >= start && rowDate <= end;
      });
    }
    setFilteredData(filterBySearch(filtered));
  };

  // Filter by search term (case-insensitive)
  const filterBySearch = (dataToFilter: any[]) => {
    if (!searchTerm) return dataToFilter;
    const lowerSearch = searchTerm.toLowerCase();
    const headers = tableHeaders[selectedTable].map(h => h.key);
    return dataToFilter.filter(row =>
      headers.some(key => {
        const val = row[key];
        return val && val.toString().toLowerCase().includes(lowerSearch);
      })
    );
  };

  // Whenever searchTerm changes, re-apply filters
  useEffect(() => {
    let finalData = [...tableData];

    // Re-apply date filter if active
    if (startDate && endDate && isDateFilterActive) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const dateField = tableHeaders[selectedTable].find((header) => header.isDate)?.key;
      if (dateField) {
        finalData = finalData.filter((row) => {
          if (!row[dateField]) return false;
          const rowDate = new Date(row[dateField]);
          return rowDate >= start && rowDate <= end;
        });
      }
    }

    // Apply search filter
    finalData = filterBySearch(finalData);
    setFilteredData(finalData);
  }, [searchTerm, startDate, endDate, isDateFilterActive, selectedTable, tableData]);

  const exportToCSV = () => {
    try {
      if (filteredData.length === 0) {
        alert('No data available to export.');
        return;
      }

      const headers = tableHeaders[selectedTable].map((header) => header.label);
      const rows = filteredData.map((row, idx) => {
        const rowObj: Record<string, string> = { 'Sl. No': (idx + 1).toString() };
        tableHeaders[selectedTable].forEach((header) => {
          rowObj[header.label] = header.isDate && row[header.key]
            ? formatDate(row[header.key])
            : (row[header.key] || '-').toString();
        });
        return rowObj;
      });

      const parser = new Parser({ fields: ['Sl. No', ...headers] });
      const csv = parser.parse(rows);

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${selectedTable}_data_${branch}_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert('An error occurred while exporting the data. Please try again.');
    }
  };

  const renderTable = () => {
    if (!selectedTable || filteredData.length === 0) return null;

    const headers = tableHeaders[selectedTable];
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6 shadow-lg rounded-lg bg-white"
      >
        <div className="relative max-h-[400px] overflow-y-auto overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead className="sticky top-0 bg-blue-600 text-white z-10">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider border border-gray-300"
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
                    idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-blue-50`}
                >
                  {headers.map((header, index) => (
                    <td
                      key={index}
                      className="px-6 py-4 text-sm text-gray-700 border border-gray-300"
                    >
                      {header.key === 'slno'
                        ? idx + 1
                        : header.isDate
                        ? formatDate(row[header.key])
                        : row[header.key] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Faculty Information Management</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Search field always visible */}
      <div className="flex justify-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {isDateFilterActive && (
        <div className="flex justify-center mb-6 gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={filterByDate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Filter
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Export CSV
          </button>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={() => setSelectedTable('fac_outreach')}
          className={`px-4 py-2 rounded-md ${
            selectedTable === 'fac_outreach'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-blue-100'
          }`}
        >
          Outreach Activities
        </button>
        <button
          onClick={() => setSelectedTable('fac_awards')}
          className={`px-4 py-2 rounded-md ${
            selectedTable === 'fac_awards'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-blue-100'
          }`}
        >
          Awards & Recognition
        </button>
        <button
          onClick={() => setSelectedTable('fac_respon')}
          className={`px-4 py-2 rounded-md ${
            selectedTable === 'fac_respon'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-blue-100'
          }`}
        >
          Additional Responsibility
        </button>
        <button
          onClick={() => setSelectedTable('fac_industry')}
          className={`px-4 py-2 rounded-md ${
            selectedTable === 'fac_industry'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-blue-100'
          }`}
        >
          Industry Experience
        </button>
        <button
          onClick={() => setSelectedTable('fac_teach')}
          className={`px-4 py-2 rounded-md ${
            selectedTable === 'fac_teach'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-blue-100'
          }`}
        >
          Teaching Experience
        </button>
      </div>

      {renderTable()}
    </div>
  );
};

export default dynamic(() => Promise.resolve(TableDisplay), { ssr: false });