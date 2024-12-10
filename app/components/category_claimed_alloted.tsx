import { useState } from 'react';
import Link from 'next/link';

interface CategoryClaimAllotSelectProps {
  SelectedCategoryClaim: string;
  handleChange: (state: string) => void; // A callback to pass the selected state back to the page
}

const CategorySelect: React.FC<CategoryClaimAllotSelectProps> = ({ SelectedCategoryClaim, handleChange }) => {
  
  const category_claimed_alloted = [
    "1G",
    "1K",
    "1R",
    "1GH",
    "1HK",
    "1HR",
    "2AG",
    "2AK",
    "2AR",
    "2AH",
    "2AHK",
    "2AHR",
    "2BG",
    "2BR",
    "2BGH",
    "2BGHK",
    "3AG",
    "3AK",
    "3AR",
    "3AGH",
    "3AGHK",
    "3AGHR",
    "3BK",
    "3BR",
    "3BGH",
    "3BGHK",
    "3BGHR",
    "GM",
    "GMK",
    "GMR",
    "GMH",
    "GMHK",
    "GMHR",
    "SCG",
    "SCK",
    "SCR",
    "SCH",
    "SCHK",
    "SCRH",
    "STG",
    "STK",
    "STR",
    "STH",
    "STHK",
    "STRH",
    "D",
    "XD",
    "NCC",
    "NSS",
    "PH",    
    "SPORTS",
    "A-G",
    "S-G",
    "SNQ",
    "JK"
  ];
 
  return (
    // <form action = "" className="">
    <div>
      <select
          id="state"
          value={SelectedCategoryClaim}
          onChange={(e) => handleChange(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md required"
          required
        >
        <option value="" disabled>Select category</option>
        {category_claimed_alloted.map((state) => (
          <option key={state} value={state}>
            {state}
        </option>
        ))}
      </select>
      
    </div>  
      
    // </form>
  );
}

export default CategorySelect