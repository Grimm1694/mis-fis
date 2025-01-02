'use client';

import { useEffect, useState } from 'react';
import Select from 'react-select';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
// Helper function to format dates
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-'; 
  return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getFullYear()}`;
};

// Check and replace values
const sanitizeValue = (val: any) => {
  if (!val || val === 'N/A' || val === 'nil' || val === '0') return '-';
  return val;
};

const ResearchTableDisplay = () => {
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<any[]>([]);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState(''); // For name-based search

  // For date filtering (other tables)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // For year filtering (patent, book publication, conference & journal)
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');

  // Tables that use year filtering instead of date filtering
  const yearFilterTables = ['fac_patent', 'fac_bookPublication', 'fac_conferenceAndJournal'];

  const tableHeaders: { [key: string]: { label: string; key: string; isDate?: boolean }[] } = {
    fac_research: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Faculty name', key: 'faculty_name' },
      { label: 'ORCID ID', key: 'orcidId' },
      { label: 'Google Scholar ID', key: 'googleScholarId' },
      { label: 'Scopus ID', key: 'scopusId' },
      { label: 'Publons ID', key: 'publonsId' },
      { label: 'Researcher ID', key: 'researchId' },
    ],
    fac_bookPublication: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Faculty name', key: 'faculty_name' },
      { label: 'Title', key: 'title' },
      { label: 'Publication Type', key: 'publicationType' },
      { label: 'ISSN', key: 'issn' },
      { label: 'Publisher', key: 'publisher' },
      { label: 'Impact Factor', key: 'impactFactor' },
      { label: 'Year of Publish', key: 'yearOfPublish' },
      { label: 'Authors', key: 'authors' },
    ],
    fac_conferenceAndJournal: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Faculty name', key: 'faculty_name' },
      { label: 'Title', key: 'title' },
      { label: 'Type of Publication', key: 'typeOfPublication' },
      { label: 'DOI', key: 'doi' },
      { label: 'ISSN', key: 'issn' },
      { label: 'Year of Publication', key: 'yearOfPublication' },
      { label: 'Impact Factor', key: 'impactFactor' },
      { label: 'Volume', key: 'volume' },
      { label: 'Pages', key: 'pages' },
    ],
    fac_patent: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Faculty name', key: 'faculty_name' },
      { label: 'Granted Year', key: 'grantedYear' },
      { label: 'Patent Number', key: 'patentNo' },
      { label: 'Patent Status', key: 'patentStatus' },
    ],
    fac_researchProject: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Faculty name', key: 'faculty_name' },
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
      { label: 'Faculty name', key: 'faculty_name' },
      { label: 'Event Name', key: 'eventName' },
      { label: 'Type of Event', key: 'typeOfEvent' },
      { label: 'Organizer', key: 'organizer' },
      { label: 'Venue', key: 'venue' },
      { label: 'From Date', key: 'fromDate', isDate: true },
      { label: 'To Date', key: 'toDate', isDate: true },
    ],
    fac_eventOrganized: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Faculty name', key: 'faculty_name' },
      { label: 'Event Name', key: 'eventName' },
      { label: 'Type of Event', key: 'typeofevent' },
      { label: 'Organizer', key: 'organizer' },
      { label: 'Venue', key: 'venue' },
      { label: 'From Date', key: 'fromDate', isDate: true },
      { label: 'To Date', key: 'toDate', isDate: true },
    ],
    fac_consultancy: [
      { label: 'Sl. No.', key: 'slno' },
      { label: 'Faculty name', key: 'faculty_name' },
      { label: 'Project Title', key: 'projectTitle' },
      { label: 'Principal Investigator', key: 'principalInvestigator' },
      { label: 'Co-PI', key: 'coPrincipalInvestigator' },
      { label: 'Sanctioned Date', key: 'sanctionedDate', isDate: true },
      { label: 'Amount', key: 'amount' },
      { label: 'Status', key: 'status' },
    ],
  };

  // Determine the field used for name search
  const getNameField = (tableName: string): string => {
    const headers = tableHeaders[tableName];
    // Priority: authors -> faculty_name -> faculty_name
    if (headers.some(h => h.key === 'authors')) return 'authors';
    if (headers.some(h => h.key === 'faculty_name')) return 'faculty_name';
    return 'faculty_name'; // fallback if no authors/faculty_name
  };

  // Determine the year field for year filtering tables
  const getYearField = (tableName: string): string | null => {
    if (tableName === 'fac_patent') return 'grantedYear';
    if (tableName === 'fac_bookPublication') return 'yearOfPublish';
    if (tableName === 'fac_conferenceAndJournal') return 'yearOfPublication';
    return null;
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
    try {
      const isAllBranches = selectedBranches.some((branch: any) => branch.value === 'ALL');
      const branchFilter = isAllBranches
        ? ''
        : selectedBranches.map((branch: any) => branch.value).join(',');

      const apiPrefix = isAllBranches ? '/api/principal' : '/api/hod';
      const endpoint = `${apiPrefix}/${tableName}${branchFilter ? `?branches=${encodeURIComponent(branchFilter)}` : ''}`;

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Error fetching ${tableName} data: ${response.statusText}`);
      }

      const result = await response.json();
      setTableData(result.data);
      setFilteredData(result.data);
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

  // Filter logic
  useEffect(() => {
    let tempData = [...tableData];

    // Apply year or date filters
    if (yearFilterTables.includes(selectedTable)) {
      // Year filter tables
      const yearField = getYearField(selectedTable);
      if (yearField && startYear && endYear) {
        const startY = parseInt(startYear, 10);
        const endY = parseInt(endYear, 10);
        tempData = tempData.filter(row => {
          const val = parseInt(row[yearField], 10);
          return !isNaN(val) && val >= startY && val <= endY;
        });
      }
    } else {
      // Date filter for other tables
      const headers = tableHeaders[selectedTable] || [];
      const dateFields = headers.filter(h => h.isDate).map(h => h.key);
      if (startDate && endDate && dateFields.length > 0) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        tempData = tempData.filter(row => {
          // If any of the date fields fall within the range
          return dateFields.some(field => {
            if (!row[field]) return false;
            const rowDate = new Date(row[field]);
            return rowDate >= start && rowDate <= end;
          });
        });
      }
    }

    // Apply name search filter
    if (searchTerm.trim() !== '' && selectedTable) {
      const nameField = getNameField(selectedTable);
      const lowerSearch = searchTerm.toLowerCase();
      tempData = tempData.filter(row =>
        row[nameField] && row[nameField].toString().toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredData(tempData);
  }, [tableData, startDate, endDate, startYear, endYear, searchTerm, selectedTable]);

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
        ['Sl. No', ...headers].join(','),
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

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setStartYear('');
    setEndYear('');
    setSearchTerm('');
    setFilteredData(tableData);
  };

  const renderCellContent = (headerKey: string, val: any): JSX.Element | string => {
    const value = sanitizeValue(val);
    if (selectedTable === 'fac_conferenceAndJournal' && headerKey === 'doi' && value !== '-') {
      return (
        <a href={`https://doi.org/${value}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          {value}
        </a>
      );
    }

    return value;
  };

  const renderTable = () => {
    if (!selectedTable || filteredData.length === 0) return null;

    const headers = tableHeaders[selectedTable];
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6 shadow-lg rounded-lg bg-white overflow-hidden"
      >
        <div className="max-h-[400px] overflow-y-auto">
          <table className="table-auto w-full border-collapse">
            <thead className="bg-blue-600 text-white sticky top-0 z-10">
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
                      {header.key === 'slno'
                        ? idx + 1
                        : header.isDate
                        ? formatDate(row[header.key])
                        : renderCellContent(header.key, row[header.key])}
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

  const branchOptions = branches;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Faculty Research Details</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Branch Filter */}
      <div className="mb-6 relative z-20">
        <label className="block mb-2 font-medium">Select Branches:</label>
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

      {/* Table Selection Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {[
          { key: 'fac_research', label: 'Research Details' },
          { key: 'fac_bookPublication', label: 'Book Publications' },
          { key: 'fac_conferenceAndJournal', label: 'Conference and Journals' },
          { key: 'fac_patent', label: 'Patents' },
          { key: 'fac_researchProject', label: 'Research Projects' },
          { key: 'fac_eventAttended', label: 'Events Attended' },
          { key: 'fac_eventOrganized', label: 'Events Organized' },
          { key: 'fac_consultancy', label: 'Consultancies' },
        ].map((table) => (
          <button
            key={table.key}
            onClick={() => { setSelectedTable(table.key); resetFilters(); }}
            className={`px-6 py-2 rounded-md font-semibold ${
              selectedTable === table.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-blue-100'
            }`}
          >
            {table.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 items-center mb-6">
        {yearFilterTables.includes(selectedTable) ? (
          <>
            {/* Year Filter */}
            <input
              type="number"
              placeholder="Start Year"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              className="border border-gray-300 p-2 rounded-md"
            />
            <input
              type="number"
              placeholder="End Year"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              className="border border-gray-300 p-2 rounded-md"
            />
          </>
        ) : (
          <>
            {/* Date Filter for other tables */}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 p-2 rounded-md"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 p-2 rounded-md"
            />
          </>
        )}

        {/* Search by Name */}
        <input
          type="text"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded-md"
        />

        <button
          onClick={exportToCSV}
          className="px-6 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700"
        >
          Export CSV
        </button>

        <button
          onClick={resetFilters}
          className="px-6 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700"
        >
          Reset Filters
        </button>
      </div>

      {/* Render Table */}
      {renderTable()}
    </div>
  );
};
export default dynamic(() => Promise.resolve(ResearchTableDisplay), { ssr: false });

