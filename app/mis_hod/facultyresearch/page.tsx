'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Parser } from 'json2csv';
import dynamic from 'next/dynamic';
// Helper function to format dates
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getFullYear()}`;
};

const ResearchTableDisplay = () => {
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [branch, setBranch] = useState('');
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);
  const [isYearFilterActive, setIsYearFilterActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search functionality

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

  const tableHeaders: {
    [key: string]: {
      label: string;
      key: string;
      isDate?: boolean;
      isYear?: boolean;
    }[];
  } = {
    fac_research: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Employee Name', key: 'faculty_name' },
      { label: 'ORCID ID', key: 'orcidId' },
      { label: 'Google Scholar ID', key: 'googleScholarId' },
      { label: 'Scopus ID', key: 'scopusId' },
      { label: 'Publons ID', key: 'publonsId' },
      { label: 'Researcher ID', key: 'researchId' },
    ],
    fac_bookPublication: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Employee Name', key: 'faculty_name' },
      { label: 'Title', key: 'title' },
      { label: 'Publication Type', key: 'publicationType' },
      { label: 'ISSN', key: 'issn' },
      { label: 'Publisher', key: 'publisher' },
      { label: 'Impact Factor', key: 'impactFactor' },
      { label: 'Year of Publish', key: 'yearOfPublish', isYear: true },
    ],
    fac_conferenceAndJournal: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Employee Name', key: 'faculty_name' },
      { label: 'Title', key: 'title' },
      { label: 'Type of Publication', key: 'typeOfPublication' },
      { label: 'DOI', key: 'doi' },
      { label: 'ISSN', key: 'issn' },
      { label: 'Year of Publication', key: 'yearOfPublication', isYear: true },
      { label: 'Impact Factor', key: 'impactFactor' },
    ],
    fac_patent: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Employee Name', key: 'faculty_name' },
      { label: 'Area of Research', key: 'areaOfResearch' },
      { label: 'Granted Year', key: 'grantedYear' },
      { label: 'Patent Number', key: 'patentNo' },
      { label: 'Patent Status', key: 'patentStatus' },
      { label: 'Author', key: 'author' },
    ],
    fac_researchProject: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Employee Name', key: 'faculty_name' },
      { label: 'Project Title', key: 'projectTitle' },
      { label: 'Principal Investigator', key: 'pi' },
      { label: 'Co-PI', key: 'coPi' },
      { label: 'Funding Agency', key: 'fundingAgency' },
      { label: 'Duration', key: 'duration' },
      { label: 'Amount', key: 'amount' },
      { label: 'Status', key: 'status' },
    ],
    fac_eventAttended: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Employee Name', key: 'faculty_name' },
      { label: 'Event Name', key: 'nameofevent' },
      { label: 'Type of Event', key: 'typeofevent' },
      { label: 'Organizer', key: 'organizer' },
      { label: 'Venue', key: 'venue' },
      { label: 'From Date', key: 'fromDate', isDate: true },
      { label: 'To Date', key: 'toDate', isDate: true },
    ],
    fac_eventOrganized: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Employee Name', key: 'faculty_name' },
      { label: 'Event Name', key: 'nameofevent' },
      { label: 'Type of Event', key: 'typeofevent' },
      { label: 'Organizer', key: 'organizer' },
      { label: 'Venue', key: 'venue' },
      { label: 'From Date', key: 'fromDate', isDate: true },
      { label: 'To Date', key: 'toDate', isDate: true },
    ],
    fac_consultancy: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Employee Name', key: 'faculty_name' },
      //{ label: 'Project Title', key: 'projectTitle' },
      { label: 'Principal Investigator', key: 'principalInvestigator' },
      { label: 'Co-PI', key: 'coPrincipalInvestigator' },
      { label: 'Sanctioned Date', key: 'sanctionedDate', isDate: true },
      { label: 'Amount', key: 'amount' },
      { label: 'Status', key: 'status' },
    ],
  };

  const fetchTableData = async (tableName: string) => {
    if (!branch) {
      setError('Branch is not set. Cannot fetch data.');
      return;
    }
    try {
      const response = await fetch(`/api/hod/${tableName}?branches=${branch}`);
      if (!response.ok) {
        throw new Error(`Error fetching ${tableName} data: ${response.statusText}`);
      }
      const result = await response.json();
      setTableData(result.data);
      setFilteredData(result.data);

      // Check if the selected table has date or year fields
      const hasDateFields = tableHeaders[tableName].some((header) => header.isDate);
      const hasYearFields = tableHeaders[tableName].some((header) => header.isYear);
      setIsDateFilterActive(hasDateFields);
      setIsYearFilterActive(hasYearFields);
      setError('');
    } catch (err: any) {
      setError(err.message);
      setTableData([]);
      setFilteredData([]);
      setIsDateFilterActive(false);
      setIsYearFilterActive(false);
    }
  };

  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable);
    }
  }, [selectedTable]);

  // Apply filters based on date, year, and search
  const applyFilters = () => {
    let filtered = [...tableData];

    // Filter by date if applicable
    if (isDateFilterActive && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const dateField = tableHeaders[selectedTable].find((header) => header.isDate)?.key;
      if (dateField) {
        filtered = filtered.filter((row: any) => {
          if (!row[dateField]) return false;
          const rowDate = new Date(row[dateField]);
          return rowDate >= start && rowDate <= end;
        });
      }
    }

    // Filter by year if applicable
    if (isYearFilterActive && startYear && endYear) {
      const yearField = tableHeaders[selectedTable].find((header) => header.isYear)?.key;
      if (yearField) {
        filtered = filtered.filter((row: any) => {
          if (!row[yearField]) return false;
          const rowYear = new Date(row[yearField]).getFullYear();
          return rowYear >= parseInt(startYear) && rowYear <= parseInt(endYear);
        });
      }
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      const headers = tableHeaders[selectedTable].map((h) => h.key);
      filtered = filtered.filter((row: any) =>
        headers.some((key) => {
          const val = row[key];
          return val && val.toString().toLowerCase().includes(lowerSearch);
        })
      );
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    if (selectedTable) {
      applyFilters();
    }
  }, [startDate, endDate, startYear, endYear, searchTerm, tableData]);

  const exportToCSV = () => {
    try {
      if (filteredData.length === 0) {
        alert('No data available to export.');
        return;
      }

      const headers = tableHeaders[selectedTable].map((header) => header.label);
      const rows = filteredData.map((row: any, idx: number) => {
        const rowObj: any = { 'Sl. No': idx + 1 };
        tableHeaders[selectedTable].forEach((header) => {
          let value = row[header.key];
          if (!value || value === 'N/A' || value === 'nil' || value === '0') {
            value = '-';
          }

          rowObj[header.label] = header.isDate && row[header.key]
            ? formatDate(row[header.key])
            : header.isYear && row[header.key]
            ? new Date(row[header.key]).getFullYear()
            : value;
        });
        return rowObj;
      });

      const parser = new Parser({ fields: ['Sl. No', ...headers] });
      const csv = parser.parse(rows);

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `faculty_data_${branch}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting CSV:', err);
    }
  };

  const renderTableCell = (row: any, header: any, idx: number) => {
    let value = row[header.key];

    // Replace N/A, nil, or 0 with '-'
    if (!value || value === 'N/A' || value === 'nil' || value === '0') {
      value = '-';
    }

    if (header.key === 'slno') {
      return idx + 1;
    } else if (header.isDate) {
      return formatDate(value === '-' ? '' : value);
    } else if (header.isYear) {
      return value !== '-' && value !== '' && value !== undefined && value !== null
        ? new Date(row[header.key]).getFullYear()
        : '-';
    } else if (selectedTable === 'fac_conferenceAndJournal' && header.key === 'doi') {
      // If it's a DOI field in conference and journal table
      return value !== '-' ? (
        <a
          href={`https://doi.org/${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {value}
        </a>
      ) : (
        '-'
      );
    } else {
      return value;
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
        <div className="overflow-x-auto">
          <div className="table-container max-h-[400px] overflow-y-auto">
            <table className="table-auto w-full border-collapse">
              <thead className="sticky top-0 bg-blue-600 text-white z-10">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-4 py-2 text-left text-sm font-medium border border-gray-300"
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row: any, idx: number) => (
                  <tr
                    key={idx}
                    className={`${
                      idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    } hover:bg-blue-100`}
                  >
                    {headers.map((header, index) => (
                      <td
                        key={index}
                        className="px-4 py-2 text-sm border border-gray-300"
                      >
                        {renderTableCell(row, header, idx)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Faculty Research Details</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {Object.keys(tableHeaders).map((table) => (
          <button
            key={table}
            onClick={() => setSelectedTable(table)}
            className={`px-4 py-2 rounded-md ${
              selectedTable === table
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-blue-100'
            }`}
          >
            {table.replace('fac_', '').replace(/([A-Z])/g, ' $1')}
          </button>
        ))}
      </div>

      {/* Search and Export CSV should always appear */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded"
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

      {/* Only show date/year filters if available */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {isDateFilterActive && (
          <>
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
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Filter by Date
            </button>
          </>
        )}
        {isYearFilterActive && (
          <>
            <input
              type="number"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              className="border p-2 rounded"
              placeholder="From Year"
            />
            <input
              type="number"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              className="border p-2 rounded"
              placeholder="To Year"
            />
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Filter by Year
            </button>
          </>
        )}
      </div>

      {renderTable()}
    </div>
  );
};

export default dynamic(() => Promise.resolve(ResearchTableDisplay), { ssr: false });
