import { useState } from 'react';
import Link from 'next/link';

interface BranchSelectProps {
  selectedBranch: string;
  handleChange: (state: string) => void; // A callback to pass the selected state back to the page
}

const BranchSelect: React.FC<BranchSelectProps> = ({ selectedBranch, handleChange }) => {
  const branch = [
    "AE",
    "AI",
    "CB",
    "CS",
    "CV",
    "EC",
    "EE",
    "EI",
    "ET",
    "IM",
    "IS",
    "ME",
    "MD",
    "CSE",
    "EPE",
    "LDN",
    "LVS",
    "SCS",
    "MBA",
    "MCA"
  ];
  
  return (
    // <form action = "" className="">
    <div>
      <select
          id="state"
          value={selectedBranch}
          onChange={(e) => handleChange(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md required"
          required
        >
        <option value="" disabled>Select a Course</option>
        {branch.map((state) => (
          <option key={state} value={state}>
            {state}
        </option>
        ))}
      </select>
    </div> 
      
    // </form>
  );
}

export default BranchSelect