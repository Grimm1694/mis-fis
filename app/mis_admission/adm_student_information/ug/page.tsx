"use client";

import React, { useRef } from 'react';
import ScrollToTop from '../../../components/ui/scroll_to_top';
import Layout from '../../../components/ui/Layout';
import { useEffect, useState } from 'react';
import { useUser } from "../../../context/usercontext";
import { useRouter } from 'next/navigation';


import IndianStateSelect from '../../../components/indian_states';  
import YearSelect from '../../../components/year';  
import CategoryClaimedAlloted from '../../../components/category_claimed_alloted';  
import BranchSelect from '../../../components/branch';
import mpk from "../../../assets/mpk.jpg";
import Image from 'next/image';
import ImageWithAltCenter from '../../../components/image_with_center';


const Student_information = () => {

//------------------------------------------------------------------------------------------
    // Redirect if not logged in; only run this on the client
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
    if (typeof window !== 'undefined' && !user) {
    router.push('/'); // Redirect to login
    }
    }, [user, router]);
//------------------------------------------------------------------------------------------  

    const [Sname, setSname] = useState("");
    const [Fname, setFname] = useState("");
    const [Mname, setMname] = useState(""); 
    const [DOB, setDOB] = useState(new Date().toISOString().split("T")[0]);
    const [Mailid, setMailid] = useState("");
    const [Occupation, setOccupation] = useState("");
    const [sameAsAbove, setSameAsAbove] = useState(false);
    const [address, setAddress] = useState({line1: "",line2: "", pin: "",});
    const [addressLocal, setAddressLocal] = useState({LocalAdd1: "",LocalAdd2: "", LocalPin: "",});
    const [PUCPercent, setPUCPercent] = useState("");
    //const [Admyear, setAdmYear] = useState("");
    const [AIncome, setAIncome] = useState("");
    const [Caste, setCaste] = useState("");
    const [District, setDistrict] = useState("");
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
    const [Quota, setQuota] = useState("");
    const [Semester, setSemester] = useState("");
    const [CLGCode, setCLGCode] = useState("");
    const [Adhaar, setAdhaar] = useState("");
    const [seat_allotment_date, setSeatDate] = useState("");
    const [adm_date, setAdmDate] = useState("");
    const [clg_fee_date, setClgFeeDate] = useState("");
    const [isPhysicallyChallenged, setIsPhysicallyChallenged] = useState(false);
    const [Admyear, setAdmyear] = useState('');
    const [error, setError] = useState<string | null>(null); // Explicitly define error type
    const [loading, setLoading] = useState(true);


//--------------------------------------------------------------------------------------------------
useEffect(() => {
    const fetchAdmyear = async () => {
        try {
            const response = await fetch('/api/settings'); // Replace with your actual API endpoint
            if (!response.ok) {
                throw new Error('Failed to fetch admission year');
            }

            const data = await response.json();
            setAdmyear(data.data[0].adm_year); // Assuming the API returns { adm_year: 'YYYY-MM-DD' }
            console.log('msg',Admyear)
        } catch (error) {
            // Use type assertion to access error message safely
            const errorMessage = (error as Error).message; // Assert that error is of type Error
            setError(errorMessage); // Now you can safely use error.message
        } finally {
            setLoading(false);
        }
    };

    fetchAdmyear();
}, []);
//--------------------------------email validation---------------------------------------------------

const [errorEmail, setErrorEmail] = useState<string>('');

  const validateEmail = (email: string) => {
    // Simple RegEx for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const Mailid = e.target.value;
    setMailid(Mailid);

    if (!validateEmail(Mailid)) {
      setErrorEmail('Please enter a valid email address.');
    } else {
      setErrorEmail('');
    }
  };
//----------------------------Selecting indian states--------------------------------------------
    
    const [selectedState1, setSelectedState1] = useState<string>("");
    const [selectedState2, setSelectedState2] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedCategoryClaim1, setSelectedCategory1] = useState<string>("");
    const [selectedCategoryClaim2, setSelectedCategory2] = useState<string>("");
    const [selectedBranch, setSelectedBranch] = useState<string>("");


    const handleStateChange1 = (state: string) => {
        setSelectedState1(state);
      };
    
    const handleStateChange2 = (state: string) => {
        setSelectedState2(state);
      };

      const handleYearChange = (state: string) => {
        setSelectedYear(state);
      };
      const handleCategoryClaimChange1 = (state: string) => {
        setSelectedCategory1(state);
      };
      const handleCategoryClaimChange2 = (state: string) => {
        setSelectedCategory2(state);
      };
      const handleBranchChange = (state: string) => {
        setSelectedBranch(state);
      };
//------------------------------------------Adhaar validate--------------------------
const handleAdhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    // Remove all non-numeric characters
    input = input.replace(/\D/g, '');

    // Format the input to insert a hyphen every 4 digits
    const formattedAdhaar = input.replace(/(.{4})/g, '$1-').trim();

    // Remove trailing hyphen if present
    if (formattedAdhaar.endsWith("-")) {
      setAdhaar(formattedAdhaar.slice(0, -1));
    } else {
      setAdhaar(formattedAdhaar);
    }
    };
 //----------------------------------phone no validate--------------------------------
    const [stPhone, setPhoneNumber] = useState("");
    const [parentPhone, setPhoneNumber_pt] = useState("");
    const [gardianPhone, setPhoneNumber_gd] = useState("");
    const [errorMessage_st, setErrorMessage_st] = useState("");
    const [errorState_st, setErrorState_st] = useState(false);
    const [errorMessage_pt, setErrorMessage_pt] = useState("");
    const [errorMessage_gd, setErrorMessage_gd] = useState("");
    const inputRef_st = useRef<HTMLInputElement>(null);
    const inputRef_pt = useRef<HTMLInputElement>(null);
    const inputRef_gd = useRef<HTMLInputElement>(null);
  

    const handleChange_st = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value_st = e.target.value;
        const numericValue_st = value_st.replace(/\D/g, "");
        setPhoneNumber(numericValue_st);
        if (numericValue_st.length > 10 ) {
            setErrorMessage_st("Phone number must be exactly 10 digits.");
            setErrorState_st (true)
        } else {
            setErrorMessage_st("");
            setErrorState_st (false)
        }
    };
    const handleBlur_st = () => {
        if (stPhone.length < 10) {
            if (inputRef_st.current) {
                inputRef_st.current.focus(); // Set focus back to the input field
            }
            setErrorMessage_st("Phone number must be exactly 10 digits.");
            setErrorState_st (true)
        } else {
            setErrorMessage_st(""); // Clear error message if valid
            setErrorState_st (false)
        }
    };
    const handleChange_pt = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value_pt = e.target.value;
        const numericValue_pt = value_pt.replace(/\D/g, "");

        setPhoneNumber_pt(numericValue_pt);

        if (numericValue_pt.length > 10 ) {
            setErrorMessage_pt("Phone number must be exactly 10 digits.");
        } else {
            setErrorMessage_pt("");
        }
    };
    const handleBlur_pt = () => {
        if (parentPhone.length < 10) {
            if (inputRef_pt.current) {
                inputRef_pt.current.focus(); // Set focus back to the input field
            }
            setErrorMessage_pt("Phone number must be exactly 10 digits.");
        } else {
            setErrorMessage_pt(""); // Clear error message if valid
        }
    };
    const handleChange_gd = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value_gd = e.target.value;
        const numericValue_gd = value_gd.replace(/\D/g, "");

        setPhoneNumber_gd(numericValue_gd);

        if (numericValue_gd.length > 10 ) {
            setErrorMessage_gd("Phone number must be exactly 10 digits.");
        } else {
            setErrorMessage_gd("");
        }
    };
    const handleBlur_gd = () => {
        if (gardianPhone.length < 10) {
            if (inputRef_gd.current) {
                inputRef_gd.current.focus(); // Set focus back to the input field
            }
            setErrorMessage_gd("Phone number must be exactly 10 digits.");
        } else {
            setErrorMessage_gd(""); // Clear error message if valid
        }
    };

//--------------------------Local and permanent address-------------------------------------
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSameAsAbove(!sameAsAbove);
    setAddressLocal((addressLocal) => ({
        ...addressLocal,
        [name]: value, // Dynamically update field based on input name
      }));
    };

    const handleAddressChangePermanent = (e: any) => {
    const { name, value } = e.target;
    setAddress((address) => ({
        ...address,
        [name]: value, // Dynamically update field based on input name
      }));
    };

    const handleAddressChangeLocal = (e: any) => {
     /*   const { name, value } = e.target;
        setAddressLocal((address) => ({
            ...addressLocal,
            [name]: value, // Dynamically update field based on input name
          })); */
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
  const [selectedGender, setSelectedGender] = useState("");

  // Step 2: Create an onChange handler
  const handleGenderChange = (e: any) => {
    setSelectedGender(e.target.value); // Update the state with the selected value
  };
  //----------------------------------------------------------------------------------
  // Step 1: Set up state to hold the selected Blood group
  const [selectedBlood, setSelectedBlood] = useState("");

  // Step 2: Create an onChange handler
  const handleBloodChange = (e: any) => {
    setSelectedBlood(e.target.value); // Update the state with the selected value
  };
  //----------------------------------------------------------------------------------
  // Step 1: Set up state to hold the selected Nationality
  const [selectedNationality, setSelectedNationality] = useState("");

  // Step 2: Create an onChange handler
  const handleNationalityChange = (e: any) => {
    setSelectedNationality(e.target.value); // Update the state with the selected value
  };
  //----------------------------------------------------------------------------------
  // Step 1: Set up state to hold the selected Relegion
  const [selectedRelegion, setSelectedRelegion] = useState("");

  // Step 2: Create an onChange handler
  const handleRelegionChange = (e: any) => {
    setSelectedRelegion(e.target.value); // Update the state with the selected value
  };
  //----------------------------------------------------------------------------------
  // Step 1: Set up state to hold the selected Category
  const [selectedCategory, setSelectedCategory] = useState("");

  // Step 2: Create an onChange handler
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value); // Update the state with the selected value
  };
   //----------------------------------------------------------------------------------
  // Step 1: Set up state to hold the selected Qualify exam
  const [selectedQualifyExam, setSelectedQualifyExam] = useState<string>("");

  // Step 2: Create an onChange handler
  const handleQualifyExamChange = (e: any) => {
    setSelectedQualifyExam(e.target.value); // Update the state with the selected value
  };
   //----------------------------------------------------------------------------------
  // Step 1: Set up state to hold the selected Board
  const [selectedBoard, setSelectedBoard] = useState<string>("");

  // Step 2: Create an onChange handler
  const handleBoardChange = (e: any) => {
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
  //----------------------------onclick of submit button and connecting to server--------------------------------------------
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullAddress = `${address.line1}, ${address.line2}, ${address.pin}`;
    const fullAddressLocal = `${addressLocal.LocalAdd1}, ${addressLocal.LocalAdd2}, ${addressLocal.LocalPin}`;
    try {
      // Send a POST request to the API route with the form data
      const res = await fetch('/api/insert_data_ug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Sname,Fname,Mname,DOB,selectedGender,Mailid,stPhone,parentPhone,gardianPhone,selectedBlood,
            Adhaar,Occupation,AIncome,selectedNationality,selectedRelegion,Caste,selectedCategory,fullAddress,fullAddressLocal,
            SSLCPercent,PUCPercent,PHYMarks,CHEMarks,MathsMarks,PCMMarks,PCMPercent,selectedQualifyExam,selectedBoard,
            selectedState1,PUCReg,selectedYear,selectedState2,District,selectedRankFrom,CETReg,CETRank,seat_allotment_date,
            selectedCategoryClaim1,selectedCategoryClaim2,selectedBranch,adm_date,AMTClg,CLGRct,clg_fee_date,AMTKea,Semester,
            Quota,CLGCode,CETNo,Admyear,isPhysicallyChallenged
         }),
      });

      if (res.ok) {
        alert('Data inserted successfully');
        /* setFaName('');
        setFaid('');
        setFaPass('');
        setFaRole(''); */
      } else {
        alert('Failed to insert data');
      }
    } catch (error) {
      console.error('Error inserting data', error);
    }
  };

  if (loading) {
    return <div>Loading....{Admyear}</div>; // You can show a loading spinner or similar UI here
}

if (error) {
    return <div>Error: {error}</div>; // Handle any error here
}
//---------------------------------------------------------------------------------------
return(
    
    <Layout moduleType="admission"> <ScrollToTop />
        <div className="ml-44 w-9/12 items-center justify-center" >
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="p-2 bg-red-50 shadow-md rounded-md  my-2 ml-4 mt-2">
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
                                onChange={(e) => setSname(e.target.value.toUpperCase())}
                                required
                                
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
                                onChange={(e) => setFname(e.target.value.toUpperCase())}
                                required
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
                                onChange={(e) => setMname(e.target.value.toUpperCase())}
                                required
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
                                required
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
                                required
                            >
                                <option value="Select your gender">Select your gender</option>
                                <option value="Male">Male</option>
                                <option value="Female.">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                         {/* Physically challenged */}
                         <div>
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="gender"
                            >
                                Physically Challenged? Yes/No
                            </label>
                            <input
                                id="PhysicallyChallenged"
                                type="checkbox"
                                checked={isPhysicallyChallenged}
                                onChange={(e) => setIsPhysicallyChallenged(e.target.checked)}
                                className="mt-1"
                            />
                            <span className="ml-2">{isPhysicallyChallenged ? "Yes" : "No"}</span>
                        </div>                        

                        {/* Email */}
                        <div>
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="email"
                            >
                                Mail ID
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="block w-full p-2 border border-gray-300 rounded-md required"
                                placeholder="Email"
                                value={Mailid}
                                onChange={handleEmailChange}
                                //onChange={(e) => setMailid(e.target.value)} 
                                required
                            />
                            {errorEmail && <p className="text-red-500 mt-1">{errorEmail}</p>}
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
                                onBlur={handleBlur_st}
                                pattern="\d{10}"
                                ref={inputRef_st} // Attach the ref to the input field
                                className={`border p-2 rounded w-full ${errorState_st ? 'border-red-500' : 'border-gray-300'}`}
                                required
                            />
                            {errorMessage_st && <p className="text-red-500">{errorMessage_st}</p>}
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
                                onBlur={handleBlur_pt}
                                pattern="\d{10}"
                                ref={inputRef_pt} // Attach the ref to the input field
                                className={`border p-2 rounded w-full ${errorMessage_pt ? 'border-red-500' : 'border-gray-300'} required}`}
                                required
                            />
                            {errorMessage_pt && <p className="text-red-500">{errorMessage_pt}</p>}
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
                                onBlur={handleBlur_gd}
                                pattern="\d{10}"
                                ref={inputRef_gd} // Attach the ref to the input field
                                className={`border p-2 rounded w-full ${errorMessage_gd ? 'border-red-500' : 'border-gray-300'} required}`}
                                required
                            />
                            {errorMessage_gd && <p className="text-red-500">{errorMessage_gd}</p>}
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
                                required
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
                                type="text"
                                id="aadhar"
                                className="block w-full p-2 border border-gray-300 rounded-md required"
                                placeholder="Aadhar Number"
                                value={Adhaar}
                                onChange={handleAdhaarChange}
                                required
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
                                value={Occupation}
                                onChange={(e) => setOccupation(e.target.value)}
                                required
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
                                required
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
                                required
                                >
                                <option value="">Select your Nationality</option>
                                <option value="INDIAN">INDIAN</option>
                                <option value="NEPAL">NEPAL</option>
                                <option value="OTHER">OTHER</option>
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
                                required
                                >
                                <option value="">Select your Reigion</option>
                                <option value="BUDDHIST">BUDDHIST</option>
                                <option value="CHRISTIAN">CHRISTIAN</option>
                                <option value="HINDU">HINDU</option>
                                <option value="ISLAM">ISLAM</option>
                                <option value="JAIN">JAIN</option>
                                <option value="MUSLIM">MUSLIM</option>
                                <option value="SIKH">SIKH</option>
                                <option value="OTHER">OTHER</option>
                            </select>
                        </div>
                        {/* Caste */}
                        <div>
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="caste"
                            >
                               Caste
                            </label>
                            <input
                                type="text"
                                id="caste"
                                placeholder="Caste"
                                className="block w-full p-2 border border-gray-300 rounded-md required"
                                value={Caste}
                                onChange={(e) => setCaste(e.target.value.toUpperCase())}
                                required
                            />
                        </div>
                        {/* Category*/}
                        <div>
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
                                required
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
                                onChange={handleAddressChangePermanent}
                                className="block w-full p-2 border border-gray-300 rounded-md required"
                                placeholder="Address Line 1"
                                required
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
                                onChange={handleAddressChangePermanent}
                                className="block w-full p-2 border border-gray-300 rounded-md required"
                                placeholder="Address Line 2"
                                required
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
                                onChange={handleAddressChangePermanent}
                                className="block w-full p-2 border border-gray-300 rounded-md required"
                                placeholder="PIN"
                                required
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
                                name = "LocalAdd1"
                                className="block w-full p-2 border border-gray-300 rounded-md required"
                                value={sameAsAbove ? address.line1 : addressLocal.LocalAdd1}
                                disabled={sameAsAbove}
                                placeholder="Local Address Line 1"
                                onChange={handleAddressChangeLocal}
                                //onChange={(e) => setLocalAdd1(e.target.value)}
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
                                name = "LocalAdd2"
                                className="block w-full p-2 border border-gray-300 rounded-md required"
                                value={sameAsAbove ? address.line2 : addressLocal.LocalAdd2}
                                disabled={sameAsAbove}
                                placeholder="Local Address Line 2"
                                onChange={handleAddressChangeLocal}
                                //onChange={(e) => setLocalAdd2(e.target.value)}
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
                                name = "LocalPin"
                                className="block w-full p-2 border border-gray-300 rounded-md required"
                                value={sameAsAbove ? address.pin : addressLocal.LocalPin}
                                disabled={sameAsAbove}
                                placeholder="PIN(Local Address)"
                                onChange={handleAddressChangeLocal}
                                //onChange={(e) => setLocalPin(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
{/* //-------------------------------------------------------------------------------------------------------------*/}
                <div className="p-2 max-w-7xl bg-red-100 shadow-md rounded-md ml-8 my-2">
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
                                >
                                <option value="">Select Board</option>
                                <option value="PUC">PUC</option>
                                <option value="CBSC">CBSC</option>
                                <option value="ICSE">ICSE</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        {/* State student PUC passed */}
                        <div className="col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="board"
                                >
                                Select State From which PUC is passed
                            </label>
                            <IndianStateSelect selectedState={selectedState1} handleChange={handleStateChange1} />
                            <h2>Selected State: {selectedState1}</h2>
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
                                required
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
                            <YearSelect selectedYear={selectedYear} handleChange={handleYearChange} />
                            <h2>Selected State: {selectedYear}</h2>
                        </div>
                        {/* state student is from */}
                        <div className="col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="state from"
                            >
                                Select State Student is from
                            </label>
                            <IndianStateSelect selectedState={selectedState2} handleChange={handleStateChange2} />
                            <h2>Selected State: {selectedState2}</h2>
                        </div>
                        {/* district*/}
                        <div className="col-span-2">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="district"
                            >
                                District
                            </label>
                            <input
                                type="district"
                                id="district"
                                name= "district"
                                placeholder="District"
                                className="block w-full p-2 border border-gray-300 rounded-md required"
                                value={District}
                                onChange={(e) => setDistrict(e.target.value.toUpperCase())}
                                required
                            />
                        </div>
                    </div>
                </div>
{/* //-------------------------------------------------------------------------------------------------------------*/}
                <div className="p-2 max-w-7xl  bg-red-50 shadow-md rounded-md ml-8 my-2">
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
                                required
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
                                required
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
                                required
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
                                required
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
                            <CategoryClaimedAlloted SelectedCategoryClaim={selectedCategoryClaim1} handleChange={handleCategoryClaimChange1}/>
                            <h2>Selected category claim: {selectedCategoryClaim1}</h2>
                        </div>
                        {/* Category aalloted under*/}
                        <div>
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="category attoted"
                            >
                                Category alloted under
                            </label>
                            <CategoryClaimedAlloted SelectedCategoryClaim={selectedCategoryClaim2} handleChange={handleCategoryClaimChange2} />
                            <h2>Selected category alloted: {selectedCategoryClaim2}</h2>
                        </div>
                        {/* Course*/}
                        <div>
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="cource"
                            >
                                Course
                            </label>
                            <BranchSelect selectedBranch={selectedBranch} handleChange={handleBranchChange} />
                            <h2>Selected Branch: {selectedBranch}</h2>
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
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
                                onChange={(e) => setSemester(e.target.value)}
                                value={Semester} // Controlled component
                                required
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
                                onChange={(e) => setQuota(e.target.value)}
                                value={Quota} // Controlled component
                                required
                                >
                                <option value="">Select quota</option>
                                <option value="E004">E004</option>
                                <option value="E060">E060</option>
                                <option value="Comed-K">Comed-K</option>
                                <option value="Management">Management</option>
                                <option value="GOI">GOI</option>  
                                <option value="JK">JK</option>
                                <option value="SNQ">SNQ</option>
                                <option value="SNQH">SNQH</option>              
                            </select>
                        </div>
                        {/* College code */}
                        <div>
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="clg_code"
                            >
                                College Code
                            </label>
                            <select
                                name="clg_code"
                                id="clg_code" // Use id for accessibility
                                className="block w-full p-2 border border-gray-300 rounded-md required"
                                onChange={(e) => setCLGCode(e.target.value)}
                                value={CLGCode} // Controlled component
                                required
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
                                required
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
                                //onChange={(e) => setAdmYear(e.target.value)}
                                required
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