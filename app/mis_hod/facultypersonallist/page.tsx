'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Select from 'react-select';
import dynamic from 'next/dynamic';
import { Parser } from 'json2csv';

const FacultyTable = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [branch, setBranch] = useState('');
  const [columns, setColumns] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['faculty_name']);
  const [searchTerm, setSearchTerm] = useState(''); // For search functionality

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

  const defaultVisibleColumns = [
    'faculty_name',
    'emailId',
    'contactNo',
    'qualification',
    'firstAddressLine',
    'designation',
    'aided'
  ];

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

  useEffect(() => {
    if (!branch) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/hod/fac_personal?branches=${encodeURIComponent(branch)}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();

        if (result.data.length > 0) {
          const columnNames = Object.keys(result.data[0]).filter(
            (key) => key !== 'id' && key !== 'isRegistered' && key !== 'faculty_name'
          );
          setColumns(columnNames);
          setVisibleColumns(['faculty_name', ...defaultVisibleColumns.filter((col) => col !== 'faculty_name')]);
        }

        setData(result.data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchData();
  }, [branch]);

  // Filter data by search term
  const filteredData = data.filter(row =>
    !searchTerm.trim() ||
    (row.faculty_name && row.faculty_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleColumnChange = (selectedOptions: any) => {
    const selectedKeys = selectedOptions.map((option: any) => option.value);
    if (!selectedKeys.includes('faculty_name')) {
      selectedKeys.unshift('faculty_name');
    }
    setVisibleColumns(selectedKeys);
  };

  const columnOptions = allColumns.map((col) => ({
    value: col.key,
    label: col.label
  }));

  const selectAllColumns = () => {
    setVisibleColumns(['faculty_name', ...columns]);
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
            let val = row[col] || '-';

            // Replace N/A, nil, or 0 with '-'
            if (!val || val === 'N/A' || val === 'nil' || val === '0') {
              val = '-';
            }

            acc[columnLabel] = val;
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
      link.setAttribute('download', `faculty_data_${branch}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting CSV:', err);
    }
  };

  // Create a headers array from visibleColumns
  const headers = [
    { label: 'Sl. No.', key: 'slno' },
    ...visibleColumns.map((col) => {
      const colObj = allColumns.find((c) => c.key === col);
      return {
        label: colObj?.label || col,
        key: col,
      };
    }),
  ];

  const renderTable = () => {
    if (filteredData.length === 0) {
      return (
        <p className="text-center mt-6">No data available.</p>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6 shadow-lg rounded-lg bg-white"
      >
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto border border-gray-300 rounded-lg shadow-lg">
        <table className="table-auto w-full border-collapse">
          <thead className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
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
                  {headers.map((header, index) => {
                    let val = header.key === 'slno' ? idx + 1 : row[header.key] || '-';

                    // Replace N/A, nil, or 0 with '-'
                    if (!val || val === 'N/A' || val === 'nil' || val === '0') {
                      val = '-';
                    }

                    // Handle aided column as YES/NO
                    if (header.key === 'aided') {
                      val = row['aided'] === 1 ? 'YES' : 'NO';
                    }

                    return (
                      <td
                        key={index}
                        className="px-6 py-4 text-sm text-gray-700 border border-gray-300"
                      >
                        {val}
                      </td>
                    );
                  })}
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

      <div className="mb-4 relative z-20 flex flex-col gap-2">
        <label className="block font-medium">Select Columns:</label>
        <Select
          options={columnOptions}
          isMulti
          value={columnOptions.filter((col) => visibleColumns.includes(col.value))}
          onChange={handleColumnChange}
          menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
        />
        <div className="flex gap-2 mt-2">
          <button
            className="border px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={selectAllColumns}
          >
            Select All Columns
          </button>
          <button
            className="border px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={exportToCSV}
          >
            Export CSV
          </button>
        </div>
      </div>

      {renderTable()}
    </div>
  );
};

export default dynamic(() => Promise.resolve(FacultyTable), { ssr: false });
