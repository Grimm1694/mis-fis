import { useState } from 'react';
import Link from 'next/link';

  interface IndianStateSelectProps {
    selectedState: string;
    handleChange: (state: string) => void; // A callback to pass the selected state back to the page
  }
  
  const IndianStateSelect: React.FC<IndianStateSelectProps> = ({ selectedState, handleChange }) => {
    const indianStates = [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal",
      "Andaman and Nicobar Islands",
      "Chandigarh",
      "Dadra and Nagar Haveli and Daman and Diu",
      "Delhi",
      "Lakshadweep",
      "Puducherry"
    ];

  return (
    <div>
      <select
          id="state"
          name="state"
          value={selectedState}
          onChange={(e) => handleChange(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md required"
          required
        >
        <option value="" disabled>Select a state</option>
        {indianStates.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
         
        ))}
      </select>
    </div>  
  );
  }
  export default IndianStateSelect
