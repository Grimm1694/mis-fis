import React, { useState, useEffect } from 'react';

interface AdmissionYearDropdownProps {
    initialYear: string;
    onYearChange: (selectedYear: string) => void;
}

const AdmissionYearDropdown: React.FC<AdmissionYearDropdownProps> = ({ initialYear, onYearChange }) => {
    const [yearsRange, setYearsRange] = useState<string[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>('');

    useEffect(() => {
        if (initialYear) {
            setYearsRange(generateYearsRange(initialYear));
        }
    }, [initialYear]);

    const generateYearsRange = (admissionDateStr: string): string[] => {
        const admissionDate = new Date(admissionDateStr);
        const admissionYear = admissionDate.getFullYear();
        const month = String(admissionDate.getMonth() + 1).padStart(2, '0');
        const day = String(admissionDate.getDate()).padStart(2, '0');

        const yearsRange = [];
        for (let i = -5; i <= 20; i++) {
            const year = admissionYear + i;
            yearsRange.push(`${year}-${month}-${day}`);
        }

        return yearsRange;
    };

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedYear(selectedValue);
        onYearChange(selectedValue);
    };

    return (
        <div>
            <label
                htmlFor="adm_year_dropdown"
                className="block text-gray-700 text-sm font-bold mb-2 ml-4"
            >
            </label>
            <select
                id="adm_year_dropdown"
                className="ml-4 block w-64 p-2 border border-gray-300 rounded-md"
                value={selectedYear}
                onChange={handleChange}
            >
                <option value="" disabled>Select Admission Year</option>
                {yearsRange.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default AdmissionYearDropdown;
