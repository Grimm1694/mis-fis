
import { useState } from 'react';

interface YearSelectProps {
  selectedYear: string;
  handleChange: (state: string) => void; // A callback to pass the selected state back to the page
}

const YearSelect: React.FC<YearSelectProps> = ({ selectedYear, handleChange }) => {

  const generateYears = (startYear: any) => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= startYear; i--) {
      years.push(i);
    }
    return years;
  };

  const years = generateYears(2020); // Change the start year as needed

  return (
      <select
        id="year"
        name = "year"
        value={selectedYear}
        onChange={(e) => handleChange(e.target.value)}
        className="block w-full p-2 border border-gray-300 rounded-md"
        required
      >
        <option value="" disabled>Select a year</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
  );
}
export default YearSelect




/* import { useState } from 'react';

export default function YearSelect() {
  // Function to generate an array of years (e.g., from 1950 to the current year)
  const generateYears = (startYear: any) => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= startYear; i--) {
      years.push(i);
    }
    return years;
  };

  const years = generateYears(1995); // Change the start year as needed

  //----------------------------------------------------------------------------------
  // Step 1: Set up state to hold the selected Year
  const [selectedYear, setSelectedYear] = useState<string>("");

  // Step 2: Create an onChange handler
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value); // Update the state with the selected value
  };
  
  const handleChange = (e: any) => {
    setSelectedYear(e.target.value);
  };


  return (
    // <form action = "" className="">
      <select
        id="year"
        value={selectedYear}
        onChange={handleYearChange}
        className="block w-full p-2 border border-gray-300 rounded-md"
        required
      >
        <option value="" disabled>Select a year</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    // </form>
  );
} */