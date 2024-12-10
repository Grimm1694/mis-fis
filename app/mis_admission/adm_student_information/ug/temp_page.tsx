"use client";

import React, { useRef } from 'react';
import Layout from '../../components/ui/Layout';

import { useState } from "react";
import IndianStateSelect from '../../components/indian_states';  
import YearSelect from '../../components/year';  
import CategoryClaimedAlloted from '../../components/category_claimed_alloted';  
import BranchSelect from '../../components/branch';
import mpk from "../../assets/mpk.jpg";
import Image from 'next/image';
import ImageWithAltCenter from '../../components/image_with_center';


const Student_information = () => {
  const [sameAsAbove, setSameAsAbove] = useState(false);
  const [address, setAddress] = useState({line1: "",line2: "",pin: "",});
  
  const [DOB, setDOB] = useState(new Date().toISOString().split("T")[0]);
  const [Sname, setSname] = useState("");
  const [Fname, setFname] = useState("");
  const [Mname, setMname] = useState("");
  const [Mailid, setMailid] = useState("");
  const [PUCPercent, setPUCPercent] = useState("");
  const [Admyear, setAdmYear] = useState("");
  const [AIncome, setAIncome] = useState("");
  const [LocalAdd1, setLocalAdd1] = useState("");
  const [LocalAdd2, setLocalAdd2] = useState("");
  const [LocalPin, setLocalPin] = useState("");
  const [SSLCPercent, setSSLCPercent] = useState("");
  const [PHYMarks, setPHYMarks] = useState("");
  const [CHEMarks, setCHEMarks] = useState("");
  const [MathsMarks, setMathsMarks] = useState("");
  const [PCMMarks, setPCMMarks] = useState("");
  const [PCMPercent, setPCMPercent] = useState("");
  const [PUCReg, setPUCReg] = useState("");
  const [CETReg, setCETReg] = useState("");
  const [CETRank, setCETRank] = useState("");
  const [AMTClg, setAMTClg] = useState("");
  const [CLGRct, setCLGRct] = useState("");
  const [CETNo, setCETNo] = useState("");
  const [AMTKea, setAMTKea] = useState("");
  const [Adhaar, setAdhaar] = useState("");
  const [seat_allotment_date, setSeatDate] = useState("");
  const [adm_date, setAdmDate] = useState("");
  const [clg_fee_date, setClgFeeDate] = useState("");
 //----------------------------------phone no validate--------------------------------
  
  const [stPhone, setPhoneNumber] = useState("");
  const [parentPhone, setPhoneNumber_pt] = useState("");
  const [gardianPhone, setPhoneNumber_gd] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  

  // Regex for validating phone numbers (allows spaces, dashes, and parentheses)
  const phoneNumberPattern = /^[+\d]?(?:[\d-.\s()]*)$/;

  
  const handleChange_st = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    if ( stPhone !== "") {

      // Validate phone number based on the regex pattern
      if (!phoneNumberPattern.test(value)) {
        setErrorMessage("Invalid phone number format.");
      } else {
        setErrorMessage("");
      }
      e.preventDefault();
      if (errorMessage || stPhone === "") {
        alert("Please enter a valid phone number.");
      } 
    }
  };
  const handleChange_pt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber_pt(value);
    if ( parentPhone !== "") {

      // Validate phone number based on the regex pattern
      if (!phoneNumberPattern.test(value)) {
        setErrorMessage("Invalid phone number format.");
      } else {
        setErrorMessage("");
      }
      e.preventDefault();
      if (errorMessage || stPhone === "") {
        alert("Please enter a valid phone number.");
      } 
    }
  };
  const handleChange_gd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber_gd(value);
    if ( parentPhone !== "") {

      // Validate phone number based on the regex pattern
      if (!phoneNumberPattern.test(value)) {
        setErrorMessage("Invalid phone number format.");
      } else {
        setErrorMessage("");
      }
      e.preventDefault();
      if (errorMessage || stPhone === "") {
        alert("Please enter a valid phone number.");
      } 
    }
  };
  //-----------------------------------------------------------------------------------
  const handleCheckboxChange = () => {
    setSameAsAbove(!sameAsAbove);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };
  //----------------------------------------------------------------------------------

  // Step 1: Set up state to hold the selected college code
  const [selectedCollegeCode, setSelectedCollegeCode] = useState<string>("");

  // Step 2: Create an onChange handler
  const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCollegeCode(e.target.value); // Update the state with the selected value
  };
  //----------------------------------------------------------------------------------
  // Step 1: Set up state to hold the selected gender
  const [selectedGender, setSelectedGender] = useState<string>("");

  // Step 2: Create an onChange handler
  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGender(e.target.value); // Update the state with the selected value
  };
  //----------------------------------------------------------------------------------
  // Step 1: Set up state to hold the selected Blood group
  const [selectedBlood, setSelectedBlood] = useState<string>("");

  // Step 2: Create an onChange handler
  const handleBloodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBlood(e.target.value); // Update the state with the selected value
  };
  //----------------------------------------------------------------------------------
  // Step 1: Set up state to hold the selected Nationality
  const [selectedNationality, setSelectedNationality] = useState<string>("");

  // Step 2: Create an onChange handler
  const handleNationalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNationality(e.target.value); // Update the state with the selected value
  };
  //----------------------------------------------------------------------------------
  // Step 1: Set up state to hold the selected Relegion
  const [selectedRelegion, setSelectedRelegion] = useState<string>("");

  // Step 2: Create an onChange handler
  const handleRelegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRelegion(e.target.value); // Update the state with the selected value
  };
  //----------------------------------------------------------------------------------
  // Step 1: Set up state to hold the selected Category
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Step 2: Create an onChange handler
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value); // Update the state with the selected value
  };
   //----------------------------------------------------------------------------------
  // Step 1: Set up state to hold the selected Qualify exam
  const [selectedQualifyExam, setSelectedQualifyExam] = useState<string>("");

  // Step 2: Create an onChange handler
  const handleQualifyExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedQualifyExam(e.target.value); // Update the state with the selected value
  };
   //----------------------------------------------------------------------------------
  // Step 1: Set up state to hold the selected Board
  const [selectedBoard, setSelectedBoard] = useState<string>("");

  // Step 2: Create an onChange handler
  const handleBoardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBoard(e.target.value); // Update the state with the selected value
  };
   //----------------------------------------------------------------------------------
  // Step 1: Set up state to hold the selected Rank from
  const [selectedRankFrom, setSelectedRankFrom] = useState<string>("");

  // Step 2: Create an onChange handler
  const handleRankFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRankFrom(e.target.value); // Update the state with the selected value
  };
    //----------------------------------------------------------------------------------
  // Step 1: Set up state to hold the selected Semester
  const [selectedSemester, setSelectedSemester] = useState<string>("");

  // Step 2: Create an onChange handler
  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemester(e.target.value); // Update the state with the selected value
  };
  //------------------------------------------------------------------------------------
    return(
        <Layout>
            <div className="">
                <form >
                    <div className="p-30 max-w-4xl bg-red-50 shadow-md rounded-md my-2 ml-4 mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <div>
                                    {/* Student image, will show alt text */}
                                    <ImageWithAltCenter src={mpk} alt="Image Not Available" />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="Student-name"
                                >
                                    Student Name
                                </label>
                                <input
                                    type="text"
                                    id="student-name"
                                    className="uppercase block w-full p-2 border border-gray-300 rounded-md required"
                                    placeholder="Student Name"
                                    value={Sname}
                                    onChange={(e) => setSname(e.target.value)}
                                    
                                />
                            </div>
                            <div className="col-span-2">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="Father-name"
                                >
                                    Father Name
                                </label>
                                <input
                                    type="text"
                                    id="father-name"
                                    className="uppercase block w-full p-2 border border-gray-300 rounded-md required"
                                    placeholder="Father Name"
                                    value={Fname}
                                    onChange={(e) => setFname(e.target.value)}
                                />
                            </div>
                            <div className="col-span-2">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="Mother-name"
                                >
                                    Mother Name
                                </label>
                                <input
                                    type="text"
                                    id="mother-name"
                                    className="uppercase block w-full p-2 border border-gray-300 rounded-md required"
                                    placeholder="Mother Name"
                                    value={Mname}
                                    onChange={(e) => setMname(e.target.value)}
                                />
                            </div>

                            {/* DOB */}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="dob"
                                >
                                    Date of Birth (DOB)
                                </label>
                                <input
                                    type="date"
                                    id="dob"
                                    value={DOB}
                                    onChange={(e) => setDOB(e.target.value)}
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                />
                            </div>

                            {/* Gender */}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="gender"
                                >
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    onChange={handleGenderChange} // Attach the onChange handler
                                    value={selectedGender} // Controlled component
                                >
                                    <option value="Select your gender">Select your gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female.">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Email */}
                            <div className="col-span-2">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="email"
                                >
                                    Mail ID
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    placeholder="Email"
                                    value={Mailid}
                                    onChange={(e) => setMailid(e.target.value)}
                                />
                            </div>
                            {/* Student Phone */}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="st_phone"
                                >
                                    Student Pnone No.
                                </label>
                                <input
                                    type="tel"
                                    id="st_phone"
                                    name="st_phone"
                                    placeholder="Enter your phone number"
                                    value={stPhone}
                                    onChange={handleChange_st}
                                    className={`border p-2 rounded w-full ${errorMessage ? 'border-red-500' : 'border-gray-300'} required}`}
                                />
                            </div>

                            {/* Parent Phone */}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="parent_phone"
                                >
                                    Parent Pnone No.
                                </label>
                                <input
                                    type="tel"
                                    id="parent_phone"
                                    name="parent_phone"
                                    placeholder="Enter your phone number"
                                    value={parentPhone}
                                    onChange={handleChange_pt}
                                    className={`border p-2 rounded w-full ${errorMessage ? 'border-red-500' : 'border-gray-300'} required}`}
                                />
                            </div>
                            {/* Gardian Phone */}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="parent_phone"
                                >
                                    Gardian Pnone No.
                                </label>
                                <input
                                    type="tel"
                                    id="gardian_phone"
                                    name="gardian_phone"
                                    placeholder="Enter gardian phone number"
                                    value={gardianPhone}
                                    onChange={handleChange_gd}
                                    className={`border p-2 rounded w-full ${errorMessage ? 'border-red-500' : 'border-gray-300'} required}`}
                                />
                            </div>
                            {/* Blood group */}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="blood group"
                                >
                                    Blood Group
                                </label>
                                <select
                                    name="blood group"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    onChange={handleBloodChange} // Attach the onChange handler
                                    value={selectedBlood} // Controlled component
                                >
                                    <option value="">Select your blood group</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                            {/* Aadhar Number */}
                            <div className="col-span-2">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="aadhar no"
                                >
                                    Aadhar Number
                                </label>
                                <input
                                    type="number"
                                    id="aadhar"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    placeholder="Aadhar Number"
                                    value={Adhaar}
                                    onChange={(e) => setAdhaar(e.target.value)}
                                />
                            </div>
                            {/* Father Occupation */}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="f_occupaton"
                                >
                                    Occupation of Father
                                </label>
                                <input
                                    type="text"
                                    id="f_occupation"
                                    placeholder="Occupation of Father"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    value={Sname}
                                    onChange={(e) => setSname(e.target.value)}
                                />
                            </div>
                            {/* Annual Income */}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="Annual Income"
                                >
                                    Annual Income
                                </label>
                                <input
                                    type="number"
                                    id="annual_income"
                                    placeholder="Annual Income"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    value={AIncome}
                                    onChange={(e) => setAIncome(e.target.value)}
                                />
                            </div>
                            {/* Nationality */}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="nationality"
                                >
                                    Nationality
                                </label>
                                <select
                                    name="nationality"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    onChange={handleNationalityChange} // Attach the onChange handler
                                    value={selectedNationality} // Controlled component
                                    >
                                    <option value="">Select your Nationality</option>
                                    <option value="Indian">Indian</option>
                                    <option value="Nepal">Nepal</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                            {/* Religion*/}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="religion"
                                >
                                    Religion
                                </label>
                                <select
                                    name="relegion"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    onChange={handleRelegionChange} // Attach the onChange handler
                                    value={selectedRelegion} // Controlled component
                                    >
                                    <option value="">Select your Reigion</option>
                                    <option value="Buddhist">Buddhist</option>
                                    <option value="Christian">Chirstian</option>
                                    <option value="Hindu">Hindu</option>
                                    <option value="Islam">Islam</option>
                                    <option value="Jain">Jain</option>
                                    <option value="Muslim">Muslim</option>
                                    <option value="Sikh">Muslim</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                            {/* Category*/}
                            <div className="col-span-2">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="category"
                            >
                                Category
                            </label>
                                <select
                                    name="category"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    onChange={handleCategoryChange} // Attach the onChange handler
                                    value={selectedCategory} // Controlled component
                                    >
                                    <option value="">Select your Category</option>
                                    <option value="1G">1G</option>
                                    <option value="2A">2A</option>
                                    <option value="2B">2B</option>
                                    <option value="3A">3A</option>
                                    <option value="3B">3B</option>
                                    <option value="GM">GM</option>
                                    <option value="SC">SC</option>
                                    <option value="ST">ST</option>
                                    <option value="NRI">NRI</option>
                                    <option value="OTHERS">Others</option>
                                </select>
                            </div>
                            {/* Permanent Address Line 1 */}
                            <div className="col-span-2">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2 "
                                    htmlFor="address-line1"
                                >
                                    Permanent Address Line 1
                                </label>
                                <input
                                    type="text"
                                    id="address-line1"
                                    name="line1"
                                    value={address.line1}
                                    onChange={handleAddressChange}
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    placeholder="Address Line 1"
                                />
                            </div>

                            {/* Permanent Address Line 2 */}
                            <div className="col-span-2">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="address-line2"
                                >
                                    Permanent Address Line 2
                                </label>
                                <input
                                    type="text"
                                    id="address-line2"
                                    name="line2"
                                    value={address.line2}
                                    onChange={handleAddressChange}
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    placeholder="Address Line 2"
                                />
                            </div>

                            {/* PIN */}
                            <div className="col-span-2">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="pin"
                                >
                                    PIN
                                </label>
                                <input
                                    type="text"
                                    id="pin"
                                    name="pin"
                                    value={address.pin}
                                    onChange={handleAddressChange}
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    placeholder="PIN"
                                />
                            </div>

                            {/* Same as Above Checkbox */}
                                <div className="col-span-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    <input
                                    type="checkbox"
                                    checked={sameAsAbove}
                                    onChange={handleCheckboxChange}
                                    className="mr-2"
                                    defaultValue=""
                                    />
                                    Local Address: Same as Above?
                                </label>
                            </div>

                            {/* Local Address */}
                            <div className="col-span-2">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="corr-line1"
                                >
                                    Local Address Line 1
                                </label>
                                <input
                                    type="text"
                                    id="local-line1"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    //value={sameAsAbove ? address.line1 : ""}
                                    disabled={sameAsAbove}
                                    placeholder="Local Address Line 1"
                                    value={LocalAdd1}
                                    onChange={(e) => setLocalAdd1(e.target.value)}
                                    
                                />
                            </div>

                            <div className="col-span-2">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="local-line2"
                                >
                                    Local Address Line 2
                                </label>
                                <input
                                    type="text"
                                    id="corr-line2"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    //value={sameAsAbove ? address.line2 : ""}
                                    disabled={sameAsAbove}
                                    placeholder="Local Address Line 2"
                                    value={LocalAdd2}
                                    onChange={(e) => setLocalAdd2(e.target.value)}
                                />
                            </div> 

                            <div className="col-span-2">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="local-pin"
                                >
                                    PIN(Local Address)
                                </label>
                                <input
                                    type="text"
                                    id="local-pin"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    //value={sameAsAbove ? address.pin : ""}
                                    disabled={sameAsAbove}
                                    placeholder="PIN(Local Address)"
                                    value={LocalPin}
                                    onChange={(e) => setLocalPin(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                        
                    <div className="p-5 max-w-4xl  bg-red-100 shadow-md rounded-md ml-4 my-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* SSLC percentage */}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="SSLC Percentage"
                                >
                                    SSLC Percentage
                                </label>
                                <input
                                    type="number"
                                    id="sslc_percent"
                                    step="0.01" 
                                    placeholder="0.00"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    value={SSLCPercent}
                                    onChange={(e) => setSSLCPercent(e.target.value)}
                                />
                            </div>
                            {/* PUC percentage */}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="PUC Percentage"
                                >
                                    PUC Percentage
                                </label>
                                <input
                                    type="number"
                                    id="puc_percent"
                                    step="0.01" 
                                    placeholder="0.00"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    value={PUCPercent}
                                    onChange={(e) => setPUCPercent(e.target.value)}
                                />
                            </div>
                            {/* Physics Marks */}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="Ph marks"
                                >
                                    Physics Marks
                                </label>
                                <input
                                    type="number"
                                    id="ph_marks"
                                    placeholder="Marks obtained in Physics"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    value={PHYMarks}
                                    onChange={(e) => setPHYMarks(e.target.value)}
                                />
                            </div>
                            {/* Chemistry/Biolog/Electronics/Computer*/}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="cbec_marks"
                                >
                                    Chemistry/Biolog/Electronics/Computer Marks
                                </label>
                                <input
                                    type="number"
                                    id="cbec_marks"
                                    placeholder="Marks obtained in che/bio/ec/cs"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    value={CHEMarks}
                                    onChange={(e) => setCHEMarks(e.target.value)}
                                />
                            </div>
                            {/* maths*/}
                            <div className="col-span-2">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="maths_marks"
                                >
                                    Mathematics Marks
                                </label>
                                <input
                                    type="number"
                                    id="maths_marks"
                                    placeholder="Marks obtained in maths"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    value={MathsMarks}
                                    onChange={(e) => setMathsMarks(e.target.value)}
                                />
                            </div>
                            {/* Totol PCM*/}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="pcm_total"
                                >
                                    Total PCM Marks
                                </label>
                                <input
                                    type="number"
                                    id="pcm_marks"
                                    placeholder="Total Marks obtained in PCM"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    value={PCMMarks}
                                    onChange={(e) => setPCMMarks(e.target.value)}
                                />
                            </div>
                            {/* Percent PCM*/}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="pcm_percent"
                                >
                                    PCM Percentage
                                </label>
                                <input
                                    type="number"
                                    id="pcm_percent"
                                    step="0.01" 
                                    placeholder="0.00"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    value={PCMPercent}
                                    onChange={(e) => setPCMPercent(e.target.value)}
                                />
                            </div>
                            {/* Qualifying exam*/}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="qualify_exam"
                                >
                                    Qualifying Exam
                                </label>
                                <select
                                    name="qualify_exam"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    onChange={handleQualifyExamChange} // Attach the onChange handler
                                    value={selectedQualifyExam} // Controlled component
                                    >
                                    <option value="">Select qualifying exam</option>
                                    <option value="10+2">10+2</option>
                                    <option value="12th">12th</option>
                                </select>
                            </div>
                            {/* Board*/}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="board"
                                >
                                    Board
                                </label>
                                <select
                                    name="board"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    onChange={handleBoardChange} // Attach the onChange handler
                                    value={selectedBoard} // Controlled component
                                    >
                                    <option value="">Select Board</option>
                                    <option value="PUC">PUC</option>
                                    <option value="CBSC">CBSC</option>
                                    <option value="ICSE">ICSE</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            {/* State puc*/}
                            <div className="col-span-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="board"
                                    >
                                    Select State From which PUC is passed
                                </label>
                                <IndianStateSelect />
                            </div>
                            {/* PUC Register no*/}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="puc usno"
                                >
                                    PUC Register Number
                                </label>
                                <input
                                    type="text"
                                    id="puc_reg"
                                    placeholder="PUC Register number"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    value={PUCReg}
                                    onChange={(e) => setPUCReg(e.target.value)}
                                />
                            </div>
                            {/* Year*/}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="yearpass"
                                >
                                    Year of Pass(PUC)
                                </label>
                                <YearSelect />
                            </div>
                            {/* state student is from */}
                            <div className="col-span-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="state from"
                                >
                                    Select State Student is from
                                </label>
                                <IndianStateSelect />
                            </div>
                        </div>
                    </div>

                    <div className="p-5 max-w-4xl  bg-red-50 shadow-md rounded-md ml-4 my-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Rank from*/}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="board"
                                >
                                Rank from
                                </label>
                                <select
                                    name="rank from"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    onChange={handleRankFromChange} // Attach the onChange handler
                                    value={selectedRankFrom} // Controlled component
                                    >
                                    <option value="">Select Rank from</option>
                                    <option value="CET">CET</option>
                                    <option value="COMED-K">COMED-K</option>
                                    <option value="AIEEE">AIEEE</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            {/* CET/COMED-K Admission number*/}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="cet_adm_no"
                                >
                                    CET/COMED-K Admission Number
                                </label>
                                <input
                                    type="text"
                                    id="cet_adm_no"
                                    placeholder="CET/COMED-K Admission no"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    value={CETReg}
                                    onChange={(e) => setCETReg(e.target.value)}
                                />
                            </div>
                            {/* CET Rank*/}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="cet_rank"
                                >
                                    CET/COMED-K Rank
                                </label>
                                <input
                                    type="text"
                                    id="cet_rank"
                                    placeholder="CET/COMED-K Rank"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    value={CETRank}
                                    onChange={(e) => setCETRank(e.target.value)}
                                />
                            </div>
                            {/* Seat Allotment date*/}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="seat allotment date"
                                >
                                    Seat Allotment Date
                                </label>
                                <input
                                    type="date"
                                    id="seat_allotment_date"
                                    value={seat_allotment_date}
                                    onChange={(e) => setSeatDate(e.target.value)}
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                />
                            </div>
                            {/* Category clamed*/}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="category claimed"
                                >
                                    Category claimed
                                </label>
                                <CategoryClaimedAlloted />
                            </div>
                            {/* Category aalloted under*/}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="category attoted"
                                >
                                    Category alloted under
                                </label>
                                <CategoryClaimedAlloted />
                            </div>
                            {/* Course*/}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="cource"
                                >
                                    Course
                                </label>
                                <BranchSelect />
                            </div>
                            {/* Admission date*/}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="admission date"
                                >
                                    Admission Date
                                </label>
                                <input
                                    type="date"
                                    id="adm_date"
                                    value={adm_date}
                                    onChange={(e) => setAdmDate(e.target.value)}
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                />
                            </div>
                            {/* Amount paid at college*/}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="amt_college"
                                >
                                    Amout paid at College
                                </label>
                                <input
                                    type="number"
                                    id="amt_clg"
                                    placeholder="Amount paid at college"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    value={AMTClg}
                                    onChange={(e) => setAMTClg(e.target.value)}
                                />
                            </div>
                            {/* College fee receipt*/}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="college fee recpt"
                                >
                                    College fee receipt number
                                </label>
                                <input
                                    type="number"
                                    id="clg_fee_receipt"
                                    placeholder="College fee receipt number"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    value={CLGRct}
                                    onChange={(e) => setCLGRct(e.target.value)}
                                />
                            </div>
                            {/* College fee paid date*/}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="college fee date"
                                >
                                    College fee paid Date
                                </label>
                                <input
                                    type="date"
                                    id="clg_fee_date"
                                    value={clg_fee_date}
                                    onChange={(e) => setClgFeeDate(e.target.value)}
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                />
                            </div>
                            {/* Fee paid at KEA*/}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="cet fee"
                                >
                                    Fee paid at KEA
                                </label>
                                <input
                                    type="number"
                                    id="cet_fee"
                                    placeholder="Fee paid at KEA"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    value={AMTKea}
                                    onChange={(e) => setAMTKea(e.target.value)}
                                />
                            </div>
                            {/* Semester*/}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="semester"
                                >
                                    Semester
                                </label>
                                <select
                                    name="semester"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    onChange={handleSemesterChange} // Attach the onChange handler
                                    value={selectedSemester} // Controlled component
                                    >
                                    <option value="">Select Semester</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                </select>
                            </div>
                            {/* Quota */}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="quota"
                                >
                                    Quota
                                </label>
                                <select
                                    name="quota"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    >
                                    <option value="">Select quota</option>
                                    <option value="cet">CET</option>
                                    <option value="govt">Govt</option>
                                    <option value="management">Management</option>                
                                </select>
                            </div>
                            {/* College code */}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="clg_code"
                                >
                                    Quota
                                </label>
                                <select
                                    name="clg_code"
                                    id="clg_code" // Use id for accessibility
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    onChange={handleCollegeChange} // Attach the onChange handler
                                    value={selectedCollegeCode} // Controlled component
                                    >
                                    <option value="">Select College Code</option>
                                    <option value="E004">E004</option>
                                    <option value="E060">E060</option>                                
                                </select>
                            </div>
                            {/* CET Number */}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="cet_num"
                                >
                                    CET Number
                                </label>
                                <input
                                    type="text"
                                    id="cet_num"
                                    placeholder="Enter CET Number"
                                    className="block w-full p-2 border border-gray-300 rounded-md required"
                                    value={CETNo}
                                    onChange={(e) => setCETNo(e.target.value)}
                                />
                            </div>
                            {/* Admission year */}
                            <div>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="adm_year"
                                >
                                    Admission Year
                                </label>
                                <input
                                    type="text"
                                    id="adm_year"
                                    disabled={true}
                                    // placeholder="Enter CET Number"
                                    className="block w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-200 disabled:cursor-not-allowed required"
                                    value={Admyear}
                                    onChange={(e) => setAdmYear(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row my-10 justify-center gap-2">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Cancel
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Submit
                        </button>
                    </div>
                </form>
            </div> 
        </Layout>
    );
};
export default Student_information;