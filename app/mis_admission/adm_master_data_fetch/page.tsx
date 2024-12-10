"use client"

import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import IndianStateSelect from '../../components/indian_states';  
import CategoryClaimedAlloted from '../../components/category_claimed_alloted';  
import BranchSelect from '../../components/branch';
import ScrollToTop from '../../components/ui/scroll_to_top';
import Layout from '../../components/ui/Layout';
import AdmissionYearDropdown from '../../components/admission_year';
import { useUser } from "../../context/usercontext";
import { useRouter } from 'next/navigation';
import xlsx from 'xlsx';

    interface FormErrors {
        [key: string]: string;
    }

    interface Admission {
        adm_year: string;
        usno: string;
        s_name: string;
        f_name: string;
        m_name: string;   
        dob: string;
        gender: string;
        phy_challenged: string;
        st_email: string; 
        st_mobile: string;
        parent_mobile: string;
        gardian_mobile: string;
        blood_group: string;
        adhar_no: string;
        f_occupation: string;
        annual_income: string;
        nationality: string;
        religion: string;
        caste: string;
        category: string;
        state_student: string;
        district: string;
        permanent_adrs: string;
        local_adrs: string;
        sslc_percent: string;
        puc_percent: string;
        phy_marks: string;
        c_b_ec_cs: string;
        maths: string;
        total_pcm: string;
        pcm_percent: string;
        qual_exam: string;
        board: string;
        state_puc: string;
        puc_usno: string;
        year_pass: string;
        rank_from: string;
        cet_reg: string;
        cet_rank: string;
        seat_allot_date: string;
        category_claimed: string;
        category_allot_under: string;
        course: string;
        adm_date: string;
        amt_col: string;
        col_fee_receipt: string;
        col_fee_rec_date: string;
        amt_cet: string;
        semester: string;
        quota: string;
        col_code: string;
        cet_no: string;
        doc_submitted: string;
        doc_to_be_submitted: string;  
        
    }

    const AdmissionData = () => {

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
    
        const [admissions, setAdmissions] = useState<Admission[]>([]);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState<string | null>(null);
        //const [admissionYear, setAdmissionYear] = useState<string>('2023-08-01');
        const [admissionYear, setAdmissionYear] = useState('');
        //const [admissionYear, setAdmissionYear] = useState('');
        const [searchQuery, setSearchQuery] = useState<string>(""); // State to store search input
        //const [years, setYears] = useState(['2020-08-01', '2021-08-01', '2022-08-01', '2023-08-01']); // Example years; you can populate this dynamically as needed.
        const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
        const [showForm, setShowForm] = useState(false);
        const [formErrors, setFormErrors] = useState<FormErrors>({});
        const [Mailid, setMailid] = useState("");
        const [selectedState1, setSelectedState1] = useState<string>("");
        const [selectedState2, setSelectedState2] = useState<string>("");
        const [selectedCategoryClaim1, setSelectedCategory1] = useState<string>("");
        const [selectedCategoryClaim2, setSelectedCategory2] = useState<string>("");
        const [selectedBranch, setSelectedBranch] = useState<string>("");
        const [selectedRowData, setSelectedRowData] = useState<{ usno: string; s_name: string } | null>(null);
        const [Admyear, setAdmyear] = useState('');
//-------------------------------------------------------------------------------------------------------------------
const exportToExcel = () => {
    // Convert data to a worksheet
    const ws = xlsx.utils.json_to_sheet(filteredData); // Use filteredData or tableData here if defined
    
    // Create a new workbook and append the worksheet
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Admissions');

    // Export to Excel file
    xlsx.writeFile(wb, 'AdmissionsMasterData.xlsx');
};        
//-------------------------------------------------------------------------------------------------------------------
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

        
//-----------------------calling fetch data api---------------------------------------------------------
        // Fetch data based on selected admission year
        const fetchAdmissions = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/adm_master_data_fetch?admission_year=${admissionYear}`);
                if (!response.ok) {
                throw new Error('Error fetching data');
                }
                const data = await response.json();
                setAdmissions(data);
                } catch (error) {
                    setError((error as Error).message);
                
                } finally {
                    setLoading(false);
                }
        };

        useEffect(() => {
            if (!admissionYear) return;
            fetchAdmissions();
        }, [admissionYear]);
//---------------------------------------------------------------------------------------------------------------------
        /* const handleYearChange = (event:any) => {
            setAdmissionYear(event.target.value);
            setError(null);
            setAdmissions([]);
            setSearchQuery('');
        }; */

        const handleYearChange = (selectedYear: string) => {
            setAdmissionYear(selectedYear);
            setError(null);
            setAdmissions([]);
            setSearchQuery('');
        }
//---------------------------------------------------------------------------------------------------------------------
        const handleRowClick = (admission: Admission) => {
            console.log("Clicked row data:", admission);
            setSearchQuery(admission.usno || admission.s_name)
            setSelectedState1(admission.state_puc || '');
            setSelectedState2(admission.state_student || '');
            setSelectedCategory1(admission.category_claimed || '');
            setSelectedCategory2(admission.category_allot_under || '');
            setSelectedBranch(admission.course|| '');
            setSelectedRowData({ usno: admission.usno, s_name: admission.s_name }); 
            setSelectedAdmission({
                ...admission,
                phy_challenged: admission.phy_challenged !== null && admission.phy_challenged !== undefined
                ? admission.phy_challenged.toString()
                : '0', // Default to '0' if null or undefined
                blood_group: admission.blood_group,
                nationality: admission.nationality,
                religion: admission.religion,
                caste: admission.caste,
                category: admission.category,
                state_student:admission.state_student,
                qual_exam:admission.qual_exam,
                board: admission.board,
                state_puc:admission.state_puc,
                rank_from:admission.rank_from,
                semester:admission.semester,
                quota:admission.quota,
                col_code:admission.col_code,
            });
            setShowForm(true);
        };
//-------------------------------------------------------------------------------------------------------------------------
        const handleStateChange1 = (state_puc: string) => {
            setSelectedState1(state_puc);
            if (selectedAdmission) {
                setSelectedAdmission((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        state_puc,
                    };
                });
            }
        };

        const handleStateChange2 = (state_student: string) => {
            setSelectedState2(state_student);
            if (selectedAdmission) {
                setSelectedAdmission((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        state_student,
                    };
                });
            }
        };

        const handleCategoryClaimChange1 = (category_allot_under: string) => {
            setSelectedCategory1(category_allot_under);
            if (selectedAdmission) {
                setSelectedAdmission((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        category_allot_under,
                    };
                });
            }
        };
        const handleCategoryClaimChange2 = (state_puc: string) => {
            setSelectedCategory2(state_puc);
            if (selectedAdmission) {
                setSelectedAdmission((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        state_puc,
                    };
                });
            }
        };
        const handleBranchChange = (course: string) => {
            setSelectedBranch(course);
            if (selectedAdmission) {
                setSelectedAdmission((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        course,
                    };
                });
            }
        };
    
//--------------------------------------------------------------------------------------------------------------------   
        const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            //const { name, value, type, checked } = e.target;
            const { name, value } = e.target;
            const isCheckbox = e.target.type === 'checkbox';
            if (selectedAdmission) {
                setSelectedAdmission((prev) => {
                    if (!prev) return null; // Early return if prev is null to match the type
        
                    // If the element is a checkbox, safely access its 'checked' property
                    const updatedValue = isCheckbox && e.target instanceof HTMLInputElement 
                        ? (e.target.checked ? '1' : '0') 
                        : value;
        
                    return {
                        ...prev,
                        [name]: updatedValue,
                    };
                });
            }
            
            //--------------------------------email validation-------------------------------------------------
            if (name === 'st_email') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(value)) {
                    setFormErrors((prev) => ({
                        ...prev,
                        st_email: 'Please enter a valid email address',
                    }));
                } else {
                    setFormErrors((prev) => {
                        const { st_email, ...rest } = prev;
                        return rest; // Remove the email error if valid
                    });
                }
            }
            //---------------------------------Phone number and Adhar validation-------------------------------------
            if (name === 'st_mobile') {
                // Remove any non-numeric characters
                const numericValue = value.replace(/\D/g, '');
        
                // Update the state directly with the numeric value
                setSelectedAdmission((prev) => {
                    if (!prev) return null;
        
                    return {
                        ...prev,
                        st_mobile: numericValue,
                    };
                });
        
                // Validate the phone number length
                if (numericValue.length !== 10) {
                    setFormErrors((prev) => ({
                        ...prev,
                        st_mobile: 'Phone number must be exactly 10 digits.',
                    }));
                } else {
                    setFormErrors((prev) => {
                        const { st_mobile, ...rest } = prev;
                        return rest; // Remove the error if valid
                    });
                }
            }

            if (name === 'parent_mobile') {
                // Remove any non-numeric characters
                const numericValue = value.replace(/\D/g, '');
        
                // Update the state directly with the numeric value
                setSelectedAdmission((prev) => {
                    if (!prev) return null;
        
                    return {
                        ...prev,
                        parent_mobile: numericValue,
                    };
                });
        
                // Validate the phone number length
                if (numericValue.length !== 10) {
                    setFormErrors((prev) => ({
                        ...prev,
                        parent_mobile: 'Phone number must be exactly 10 digits.',
                    }));
                } else {
                    setFormErrors((prev) => {
                        const { parent_mobile, ...rest } = prev;
                        return rest; // Remove the error if valid
                    });
                }
            }
            if (name === 'adhar_no') {
                
                let formattedAdhaar = value.replace(/\D/g, ''); // Only keep numeric values
                
                // Format the input to insert a hyphen every 4 digits
                formattedAdhaar = formattedAdhaar.replace(/(.{4})/g, '$1-').trim();
                console.log('testng',formattedAdhaar)
                // Remove trailing hyphen if present
                if (formattedAdhaar.endsWith('-')) {
                    formattedAdhaar = formattedAdhaar.slice(0, -1);
                }
        
                setSelectedAdmission((prev) => {
                    if (!prev) return prev; // Ensure prev is not null
                    return {
                        ...prev,
                        adhar_no: formattedAdhaar,
                    };
                });
        
                // Validate if Aadhar number is 12 digits without hyphens
                if (formattedAdhaar.replace(/-/g, '').length !== 12) {
                    setFormErrors((prev) => ({
                        ...prev,
                        adhar_no: 'Aadhar number must be exactly 12 digits.',
                    }));
                } else {
                    setFormErrors((prev) => {
                        const { adhar_no, ...rest } = prev;
                        return rest; // Remove error if valid
                    });
                }
            }
           
        }

//------------------------------------Form Submit--------------------------------------------------            
        const handleFormSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (selectedAdmission) {
                try {
                const response = await fetch(`/api/adm_master_data_update`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(selectedAdmission),
                });
                if (!response.ok) {
                    throw new Error('Error updating data');
                }
                alert('Data updated successfully');
                setShowForm(false);
                await fetchAdmissions();
                setSelectedAdmission(null);
                
                } catch (error) {
                alert(`Error: ${(error as Error).message}`);
                }
            }
        };
//---------------------------------Back Button------------------------------------------------------
        const handleBackButton = async () => {
            setShowForm(false);
            setSearchQuery('');
        };
//---------------------------------row Delete------------------------------------------------------
const handleDeleteButton = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this row?");
    if (!confirmDelete) {
        return; // Exit if the user cancels
    }
    if (selectedRowData) {
        try {
            const response = await fetch('/api/adm_master_data_delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usno: selectedRowData.usno, s_name: selectedRowData.s_name }),
            });

            if (!response.ok) {
                throw new Error('Error deleting row');
            }

            alert('Row deleted successfully');
            setSelectedRowData(null); // Clear selected row data
            setShowForm(false);
            setSelectedAdmission(null);
            await fetchAdmissions(); // Refresh data
        } catch (error) {
            alert(`Error: ${(error as Error).message}`);
        }
    }
    else {
        alert('No row selected to delete.');
    }
};
// --------------------------------Filter----------------------------------------------------------------------  
        const filteredData = admissions.filter((admission) => {
            return (
                (admission.usno && admission.usno.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (admission.course && admission.course.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (admission.s_name && admission.s_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (admission.adm_year && admission.adm_year.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (admission.category && admission.category.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        });
//--------------------------------------------------------------------------------------------------------------
    return (
        <Layout moduleType="admission"> <ScrollToTop/> 
           {/* {user && (
            <p>
                Welcome, {user.name}! Your role is: {user.role}.
            </p>
            )} */}
       
            <div className="ml-4 mt-6">
                {/* Dropdown for selecting admission year */}
                <h1 className='ml-4 text-2xl'>Master Admission Data</h1>
                <AdmissionYearDropdown initialYear={Admyear} onYearChange={handleYearChange} />
                
                {/* Conditionally render the search bar only when data is loaded */}
                {!loading && admissions.length > 0 && (
                    <div className="flex my-2">
                        <input
                            type="text"
                            placeholder="Search by USNO, Name, Department"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-96 p-2 mr-4 border border-gray-400 rounded"
                        />
                        <button onClick={exportToExcel} className="px-4 py-2 bg-blue-500 text-white rounded">
                                Export to Excel
                            </button>
                        {searchQuery.length > 0 && (
                            <div className=" ml-4">
                                <button
                                onClick= {handleBackButton}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                Back
                                </button>
                            </div>
                        )}

                        { selectedAdmission && searchQuery.length > 0 && (
                            <div className="flex-1 ml-4">
                                <button
                                    onClick={handleDeleteButton}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Delete Row
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Display loading, error, or admissions data */}
                
                {loading? (
                    <p>Loading...</p>
                    ) : error ? (
                    <p className="text-red-600">Error: {error}</p>
                    ) : (
                    <div>
                        {admissions.length > 0  ? (
                            <table className="min-w-full bg-white border border-gray-300">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-2 border">Sl.No</th>
                                        <th className="px-4 py-2 border">Admission Year</th>  
                                        <th className="px-4 py-2 border">USN</th>
                                        <th className="px-4 py-2 border">Name</th>
                                        <th className="px-4 py-2 border">Father</th>
                                        <th className="px-4 py-2 border">Mother</th>
                                        <th className="px-4 py-2 border">DoB</th>
                                        <th className="px-4 py-2 border">Gender</th>
                                        <th className="px-4 py-2 border">Phy Challenged</th>
                                        <th className="px-4 py-2 border">Email</th>
                                        <th className="px-4 py-2 border">Std Phone</th>
                                        <th className="px-4 py-2 border">Parent Phone</th>
                                        <th className="px-4 py-2 border">Gardian Phone</th>
                                        <th className="px-4 py-2 border">Blood Group</th>
                                        <th className="px-4 py-2 border">Adhaar No</th>
                                        <th className="px-4 py-2 border">Father Occupation</th>
                                        <th className="px-4 py-2 border">Annual Income</th>
                                        <th className="px-4 py-2 border">Nationality</th>
                                        <th className="px-4 py-2 border">Relegion</th>
                                        <th className="px-4 py-2 border">Caste</th>
                                        <th className="px-4 py-2 border">Category</th>
                                        <th className="px-4 py-2 border">Student State</th>
                                        <th className="px-4 py-2 border">District</th>
                                        <th className="px-4 py-2 border">Permanent Addr</th>
                                        <th className="px-4 py-2 border">Local Addr</th>
                                        <th className="px-4 py-2 border">SSLC Percent</th>
                                        <th className="px-4 py-2 border">PUC Percent</th>
                                        <th className="px-4 py-2 border">Phy Marks</th>
                                        <th className="px-4 py-2 border">Che/EC/CS Marks</th>
                                        <th className="px-4 py-2 border">Maths Marks</th>
                                        <th className="px-4 py-2 border">PCM Total</th>
                                        <th className="px-4 py-2 border">PCM Percent</th>
                                        <th className="px-4 py-2 border">Qualifying Exam</th>
                                        <th className="px-4 py-2 border">Board</th>
                                        <th className="px-4 py-2 border">State PUC</th>
                                        <th className="px-4 py-2 border">PUC USNO</th>
                                        <th className="px-4 py-2 border">Year Pass</th>
                                        <th className="px-4 py-2 border">Rank from</th>
                                        <th className="px-4 py-2 border">CET Reg No</th>
                                        <th className="px-4 py-2 border">CET Rank</th>
                                        <th className="px-4 py-2 border">Seat Allotment Date</th>
                                        <th className="px-4 py-2 border">Category Claimed</th>
                                        <th className="px-4 py-2 border">Category Alloted</th>
                                        <th className="px-4 py-2 border">Course</th>
                                        <th className="px-4 py-2 border">Admission Date</th>
                                        <th className="px-4 py-2 border">Amout paid in Clg</th>
                                        <th className="px-4 py-2 border">Clg fee Receipt</th>
                                        <th className="px-4 py-2 border">Clg fee Rect Date</th>
                                        <th className="px-4 py-2 border">Amount CET</th>
                                        <th className="px-4 py-2 border">Semester</th>
                                        <th className="px-4 py-2 border">Quota</th>
                                        <th className="px-4 py-2 border">Clg  Code</th>
                                        <th className="px-4 py-2 border">CET No</th>
                                        <th className="px-4 py-2 border">Document Submitted</th>
                                        <th className="px-4 py-2 border">Document to be Submitted</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((admission, index) => (
                                        //{admissions.map((admission) => (
                                        <tr 
                                            key={admission.usno} 
                                            className="hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleRowClick(admission)} >
                                            <td className="border px-4 py-2">{index + 1}</td>
                                            <td className="border px-4 py-2">{new Date(admission.adm_year).toLocaleDateString()}</td>
                                            <td className="border px-4 py-2">{admission.usno}</td>
                                            <td className="border px-4 py-2">{admission.s_name}</td>
                                            <td className="border px-4 py-2">{admission.f_name}</td>
                                            <td className="border px-4 py-2">{admission.m_name}</td>
                                            <td className="border px-4 py-2">{new Date(admission.dob).toLocaleDateString()}</td>
                                            <td className="border px-4 py-2">{admission.gender}</td>
                                            <td className="border px-4 py-2">{admission.phy_challenged}</td>
                                            <td className="border px-4 py-2">{admission.st_email}</td>
                                            <td className="border px-4 py-2">{admission.st_mobile}</td>
                                            <td className="border px-4 py-2">{admission.parent_mobile}</td>
                                            <td className="border px-4 py-2">{admission.gardian_mobile}</td>
                                            <td className="border px-4 py-2">{admission.blood_group}</td>
                                            <td className="border px-4 py-2">{admission.adhar_no}</td>
                                            <td className="border px-4 py-2">{admission.f_occupation}</td>
                                            <td className="border px-4 py-2">{admission.annual_income}</td>
                                            <td className="border px-4 py-2">{admission.nationality}</td>
                                            <td className="border px-4 py-2">{admission.religion}</td>
                                            <td className="border px-4 py-2">{admission.caste}</td>
                                            <td className="border px-4 py-2">{admission.category}</td>
                                            <td className="border px-4 py-2">{admission.state_student}</td>
                                            <td className="border px-4 py-2">{admission.district}</td>
                                            <td className="border px-4 py-2">{admission.permanent_adrs}</td>
                                            <td className="border px-4 py-2">{admission.local_adrs}</td>
                                            <td className="border px-4 py-2">{admission.sslc_percent}</td>
                                            <td className="border px-4 py-2">{admission.puc_percent}</td>
                                            <td className="border px-4 py-2">{admission.phy_marks}</td>
                                            <td className="border px-4 py-2">{admission.c_b_ec_cs}</td>
                                            <td className="border px-4 py-2">{admission.maths}</td>
                                            <td className="border px-4 py-2">{admission.total_pcm}</td>
                                            <td className="border px-4 py-2">{admission.pcm_percent}</td>
                                            <td className="border px-4 py-2">{admission.qual_exam}</td>
                                            <td className="border px-4 py-2">{admission.board}</td>
                                            <td className="border px-4 py-2">{admission.state_puc}</td>
                                            <td className="border px-4 py-2">{admission.puc_usno}</td>
                                            <td className="border px-4 py-2">{admission.year_pass}</td>
                                            <td className="border px-4 py-2">{admission.rank_from}</td>
                                            <td className="border px-4 py-2">{admission.cet_reg}</td>
                                            <td className="border px-4 py-2">{admission.cet_rank}</td>
                                            <td className="border px-4 py-2">{new Date(admission.seat_allot_date).toLocaleDateString()}</td>
                                            <td className="border px-4 py-2">{admission.category_claimed}</td>
                                            <td className="border px-4 py-2">{admission.category_allot_under}</td>
                                            <td className="border px-4 py-2">{admission.course}</td>
                                            <td className="border px-4 py-2">{new Date(admission.adm_date).toLocaleDateString()}</td>
                                            <td className="border px-4 py-2">{admission.amt_col}</td>
                                            <td className="border px-4 py-2">{admission.col_fee_receipt}</td>
                                            <td className="border px-4 py-2">{new Date(admission.col_fee_rec_date).toLocaleDateString()}</td>
                                            <td className="border px-4 py-2">{admission.amt_cet}</td>
                                            <td className="border px-4 py-2">{admission.semester}</td>
                                            <td className="border px-4 py-2">{admission.quota}</td>
                                            <td className="border px-4 py-2">{admission.col_code}</td>
                                            <td className="border px-4 py-2">{admission.cet_no}</td>
                                            <td className="border px-4 py-2">{admission.doc_submitted}</td>
                                            <td className="border px-4 py-2">{admission.doc_to_be_submitted}</td>
                                        </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                            ) : (
                            admissionYear && <p>No admissions found for {admissionYear}.</p>
                            )
                        }
                    </div>
                    )
                    
                }
                               
                {showForm && selectedAdmission && (
                    <form onSubmit={handleFormSubmit} className="mt-4">
                        <div className="p-2 max-w-6xl bg-red-50 shadow-md rounded-md  my-2 ml-4 mt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Admission year */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-1"
                                        htmlFor="adm_year"
                                    >
                                        Admission Year
                                    </label>
                                    <input
                                        type="text"
                                        id="adm_year"
                                        name="adm_year"
                                        value={new Date(selectedAdmission.adm_year).toLocaleDateString()}
                                        onChange={handleFormChange}
                                        className="border border-gray-300 rounded w-96 px-2 py-1"
                                        required
                                    />
                                </div>
                                {/* Usno */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-1"
                                        htmlFor="usno"
                                    >
                                        USNO
                                    </label>
                                    <input
                                        type="text"
                                        id="usno"
                                        name="usno"
                                        value={selectedAdmission.usno}
                                        onChange={handleFormChange}
                                        className="border border-gray-300 rounded w-96 px-2 py-1"
                                        required
                                    />
                                </div>
                                <div >
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-1"
                                        htmlFor="Student-name"
                                    >
                                        Student Name
                                    </label>
                                    <input
                                        type="text"
                                        name="s_name"
                                        value={selectedAdmission.s_name}
                                        onChange={handleFormChange}
                                        className="border border-gray-300 rounded w-96 px-2 py-1"
                                        required
                                    />
                                </div>
                                <div >
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-1"
                                        htmlFor="Father-name"
                                    >
                                        Father Name
                                    </label>
                                    <input
                                        type="text"
                                        name="f_name"
                                        value={selectedAdmission.f_name}
                                        onChange={handleFormChange}
                                        className="border border-gray-300 rounded w-96 px-2 py-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-1"
                                        htmlFor="Mother-name"
                                    >
                                        Mother Name
                                    </label>
                                    <input
                                        type="text"
                                        name="m_name"
                                        value={selectedAdmission.m_name}
                                        onChange={handleFormChange}
                                        className="border border-gray-300 rounded w-96 px-2 py-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-1"
                                        htmlFor="dob"
                                    >
                                        DoB
                                    </label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={selectedAdmission.dob.split('T')[0]}
                                        onChange={handleFormChange}
                                        className="border border-gray-300 rounded w-96 px-2 py-1 cursor-pointer"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-1"
                                        htmlFor="gender"
                                    >
                                        Gender
                                    </label>
                                    <select
                                        name="gender"
                                        onChange={handleFormChange}
                                        className="border border-gray-300 rounded w-96 px-2 py-1 cursor-pointer"
                                        value={selectedAdmission?.gender ||""} 
                                        required
                                    >
                                        <option value="Select your gender">Select your gender</option>
                                        <option value="Male      ">Male</option>
                                        <option value="Female    ">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                {/* Physically challenged */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-1"
                                        htmlFor="phy_challenged"
                                    >
                                        Physically Challenged? Yes/No
                                    </label>
                                    <input
                                        name="phy_challenged"
                                        id="phy_challenged"
                                        type="checkbox"
                                        checked={selectedAdmission?.phy_challenged === '1' }
                                        onChange={(e) => {
                                            const isChecked = e.target.checked ? '1' : '0';
                                            setSelectedAdmission((prev) => {
                                                if (prev) {
                                                    return {
                                                        ...prev,
                                                        phy_challenged: isChecked,
                                                    };
                                                }
                                                return prev;
                                            });
                                        }}
                                        className="mt-1"
                                    />
                                    <span className="ml-2">
                                        {selectedAdmission?.phy_challenged === '1' ? "Yes" : "No"}
                                    </span>
                                </div>

                                {/* email challenged */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-1"
                                        htmlFor="st_email"
                                    >
                                        Email:
                                    </label>
                                    <input
                                        type="email"
                                        name="st_email"
                                        value={selectedAdmission?.st_email || ''}
                                        onChange={handleFormChange}
                                        className="border border-gray-300 rounded w-96 px-2 py-1"
                                        />
                                    {formErrors.st_email && (
                                        <p className="text-red-600 text-sm mt-1">{formErrors.st_email}</p>
                                    )}
                                </div>
                                {/* Student Phone */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-1"
                                        htmlFor="st_mobile"
                                    >
                                        Student Pnone No.
                                    </label>
                                    <input
                                        type="tel"                               
                                        id="st_mobile"
                                        name="st_mobile"
                                        placeholder="Enter your phone number"
                                        value={selectedAdmission?.st_mobile || ''}
                                        onChange={handleFormChange}
                                        className={`border border-gray-300 rounded w-96 px-2 py-1 ${formErrors.st_mobile ? 'border-red-500' : 'border-gray-300'}`}
                                        required    
                                    />
                                    {formErrors.st_mobile && <span style={{ color: 'red' }}>{formErrors.st_mobile}</span>}
                                </div>
                                {/* Parent Phone */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-1"
                                        htmlFor="parent_mobile"
                                    >
                                        Parent Phone No.
                                    </label>
                                    <input
                                        type="tel"                               
                                        id="parent_mobile"
                                        name="parent_mobile"
                                        placeholder="Enter parent phone number"
                                        value={selectedAdmission?.parent_mobile || ''}
                                        onChange={handleFormChange}
                                        className={`border border-gray-300 rounded w-96 px-2 py-1 ${formErrors.parent_mobile ? 'border-red-500' : 'border-gray-300'}`}
                                        required    
                                    />
                                    {formErrors.parent_mobile && <span style={{ color: 'red' }}>{formErrors.parent_mobile}</span>}
                                </div>
                                {/* Gardian Phone */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-1"
                                        htmlFor="gardian_mobile"
                                    >
                                    Gardian Phone No.
                                    </label>
                                    <input
                                        type="tel"                               
                                        id="gardian_mobile"
                                        name="gardian_mobile"
                                        placeholder="Enter gardian phone number"
                                        value={selectedAdmission?.gardian_mobile || ''}
                                        onChange={handleFormChange}
                                        className={`border border-gray-300 rounded w-96 px-2 py-1 ${formErrors.gardian_mobile ? 'border-red-500' : 'border-gray-300'}`}
                                        required    
                                    />
                                    {formErrors.gardian_mobile && <span style={{ color: 'red' }}>{formErrors.gardian_mobile}</span>}
                                </div>
                                {/* Blood Group */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-1"
                                        htmlFor="blood group"
                                    >
                                        Blood Group
                                    </label>
                                    <select
                                        name="blood_group"
                                        className="border border-gray-300 rounded w-96 px-2 py-1 cursor-pointer"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.blood_group ||""}  // Controlled component
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
                                {/* Adhaar No */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-1"
                                        htmlFor="adhar_no"
                                    >
                                        Adhaar No
                                    </label>
                                    <input
                                        type="text"
                                        id="adhar_no"
                                        name="adhar_no"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.adhar_no || ''}
                                        className="border border-gray-300 rounded w-96 px-2 py-1"
                                        required
                                    />
                                        {formErrors.adhar_no && <span style={{ color: 'red' }}>{formErrors.adhar_no}</span>}
                                </div>
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-1"
                                        htmlFor="f_occupation"
                                    >
                                        Father Occupation
                                    </label>
                                    <input
                                        type="text"
                                        name="f_occupation"
                                        value={selectedAdmission.f_occupation}
                                        onChange={handleFormChange}
                                        className="border border-gray-300 rounded w-96 px-2 py-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-1"
                                        htmlFor="annual_income"
                                    >
                                        Father Occupation
                                    </label>
                                    <input
                                        type="text"
                                        name="annual_income"
                                        value={selectedAdmission.annual_income}
                                        onChange={handleFormChange}
                                        className="border border-gray-300 rounded w-96 px-2 py-1"
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
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.nationality || ""}  // Controlled component
                                        required
                                        >
                                        <option value="">Select your Nationality</option>
                                        <option value="INDIAN">INDIAN</option>
                                        <option value="NEPAL">NEPAL</option>
                                        <option value="OTHER">OTHER</option>
                                    </select>
                                </div>
                                {/* Relegion*/}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="relegion"
                                    >
                                        Relegion
                                    </label>
                                    <select
                                        name="relegion"
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.religion || ""}  // Controlled component
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
                                        name="caste"
                                        placeholder="Caste"
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.caste || ""}  // Controlled component
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
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.category || ""}  // Controlled component
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
                                {/* Permanent Address */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="permanent_addr"
                                    >
                                        Permanent Address Line 1
                                    </label>
                                    <input
                                        type="text"
                                        id="permanent_adrs"
                                        name="permanent_adrs"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.permanent_adrs || ""}  // Controlled component
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        placeholder="Permanent Address"
                                        required
                                    />
                                </div>
                                {/* Local Address */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="permanent_addr"
                                    >
                                        Permanent Address Line 1
                                    </label>
                                    <input
                                        type="text"
                                        id="local_adrs"
                                        name="local_adrs"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.local_adrs || ""}  // Controlled component
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        placeholder="Local Address"
                                        required
                                    />
                                </div>
                                {/* state student is from */}
                                <div className="block w-96">
                                    <label className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="state from"
                                    >
                                        Select State Student is from
                                    </label>
                                    <IndianStateSelect selectedState={selectedState2} handleChange={handleStateChange2} />
                                </div>
                                {/* District */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="district"
                                    >
                                        District
                                    </label>
                                    <input
                                        type="text"
                                        id="district"
                                        name="district"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.district || ""}  // Controlled component
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        placeholder="District"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
    {/*------------------------------------------------------------------------------------------------------------------*/}
                        <div className="p-2 max-w-6xl bg-red-100 shadow-md rounded-md  my-2 ml-4 mt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">  
                                {/* SSLC Percent */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="sslc_percent"
                                    >
                                        SSLC Percentage
                                    </label>
                                    <input
                                        type="text"
                                        id="sslc_percent"
                                        name="sslc_percent"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.sslc_percent || ""}  // Controlled component
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        placeholder="SSLC Percentage"
                                        required
                                    />
                                </div>
                                {/* PUC Percent */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="puc_percent"
                                    >
                                        PUC Percentage
                                    </label>
                                    <input
                                        type="text"
                                        id="puc_percent"
                                        name="puc_percent"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.puc_percent || ""}  // Controlled component
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        placeholder="PUC Percentage"
                                        required
                                    />
                                </div>
                                {/* Phy marks */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="phy_marks"
                                    >
                                        PUC Percentage
                                    </label>
                                    <input
                                        type="text"
                                        id="phy_marks"
                                        name="phy_marks"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.phy_marks || ""}  // Controlled component
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        placeholder="Physics Marks"
                                        required
                                    />
                                </div>
                                {/* Che-CS-EC marks */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="c_b_ec_cs"
                                    >
                                        Chemistry/Biology/EC/CS Marks
                                    </label>
                                    <input
                                        type="text"
                                        id="c_b_ec_cs"
                                        name="c_b_ec_cs"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.c_b_ec_cs || ""}  // Controlled component
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        placeholder="c_b_ec_cs marks"
                                        required
                                    />
                                </div>
                                {/* Maths marks */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="maths"
                                    >
                                        Maths Marks
                                    </label>
                                    <input
                                        type="text"
                                        id="maths"
                                        name="maths"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.maths || ""}  // Controlled component
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        placeholder="Mathematics marks"
                                        required
                                    />
                                </div>
                                {/* PCM Total */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="pcm_total"
                                    >
                                        PCM Total
                                    </label>
                                    <input
                                        type="text"
                                        id="total_pcm"
                                        name="total_pcm"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.total_pcm || ""}  // Controlled component
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        placeholder="PCM Total"
                                        required
                                    />
                                </div>
                                {/* PCM Percentage */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="pcm_percent"
                                    >
                                        PCM Percentage
                                    </label>
                                    <input
                                        type="text"
                                        id="pcm_percent"
                                        name="pcm_percent"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.pcm_percent || ""}  // Controlled component
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        placeholder="PCM Percentage"
                                        required
                                    />
                                </div>
                                {/* Qualifying Exam */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="qual_exam"
                                    >
                                        Qualifying Exam
                                    </label>
                                    <select
                                        name="qual_exam"
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.qual_exam || ""}  // Controlled component
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
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        onChange={handleFormChange}
                                            value={selectedAdmission?.board || ""}  // Controlled component
                                        required
                                        >
                                        <option value="">Select Board</option>
                                        <option value="PUC">PUC</option>
                                        <option value="CBSC">CBSC</option>
                                        <option value="ICSE">ICSE</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                {/* state PUC */}
                                <div className="block w-96">
                                    <label className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="state_puc"
                                    >
                                        State Student studied PUC/10+2
                                    </label>
                                    <IndianStateSelect selectedState={selectedState1} handleChange={handleStateChange1} />
                                </div>
                                {/* PUC usno */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="puc_usno"
                                    >
                                        PUC Reg. No
                                    </label>
                                    <input
                                        type="text"
                                        id="puc_usno"
                                        name="puc_usno"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.puc_usno || ""}  // Controlled component
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        placeholder="PUC Reg. No"
                                        required
                                    />
                                </div>
                                {/* Year Pass */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="year_pass"
                                    >
                                        PUC Pass Year
                                    </label>
                                    <input
                                        type="text"
                                        id="year_pass"
                                        name="year_pass"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.year_pass || ""}  // Controlled component
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        placeholder="PUC Pass Year"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
    {/*//----------------------------------------------------------------------------------------------------------------------- */}   

                        <div className="p-2 max-w-6xl bg-red-50 shadow-md rounded-md  my-2 ml-4 mt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">  
                                {/* Rank from*/}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="rank_From"
                                    >
                                    Rank from
                                    </label>
                                    <select
                                        name="rank from"
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.rank_from || ""}  // Controlled component
                                        required
                                        >
                                        <option value="">Select Rank from</option>
                                        <option value="CET">CET</option>
                                        <option value="COMED-K">COMED-K</option>
                                        <option value="AIEEE">AIEEE</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                {/* CET reg */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="cet_reg"
                                    >
                                        CET Register No.
                                    </label>
                                    <input
                                        type="text"
                                        id="cet_reg"
                                        name="cet_reg"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.cet_reg || ""}  // Controlled component
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        placeholder="CET Register No."
                                        required
                                    />
                                </div>

                                {/* CET rank */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="cet_rank"
                                    >
                                        CET Rank
                                    </label>
                                    <input
                                        type="text"
                                        id="cet_rank"
                                        name="cet_rank"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.cet_rank || ""}  // Controlled component
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        placeholder="CET Rank"
                                        required
                                    />
                                </div>
                                {/* Seat_allotment date */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-1"
                                        htmlFor="seat_allot_date"
                                    >
                                        Seat Allotment Date
                                    </label>
                                    <input
                                        type="date"
                                        name="seat_allot_date"
                                        value={selectedAdmission.seat_allot_date.split('T')[0]}
                                        onChange={handleFormChange}
                                        className="border border-gray-300 rounded w-96 px-2 py-1 cursor-pointer"
                                        required
                                    />
                                </div>
                                {/* Category clamed*/}
                                <div className=" rounded w-96 px-2 py-1 cursor-pointer">
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
                                <div className="rounded w-96 px-2 py-1 cursor-pointer">
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
                                <div className="rounded w-96 px-2 py-1 cursor-pointer">
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
                                            name="adm_date"
                                            value={selectedAdmission.adm_date.split('T')[0]}
                                            onChange={handleFormChange}
                                            className="border border-gray-300 rounded w-96 px-2 py-1 cursor-pointer"
                                            required
                                        />
                                </div>
                                {/* Amount paid in clg */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="amt_col"
                                    >
                                        Amount Paid in College
                                    </label>
                                    <input
                                        type="text"
                                        id="amt_col"
                                        name="amt_col"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.amt_col || ""}  // Controlled component
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        placeholder="Amount Paid in College"
                                        required
                                    />
                                </div>
                                {/* College Fee reciept */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="col_fee_receipt"
                                    >
                                        College Fee receipt no.
                                    </label>
                                    <input
                                        type="text"
                                        id="col_fee_receipt"
                                        name="col_fee_receipt"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.col_fee_receipt || ""}  // Controlled component
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        placeholder="College Fee receipt no."
                                        required
                                    />
                                </div>
                                {/* College Fee paid date*/}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="col_fee_rec_date"
                                    >
                                        College Fee paid date
                                    </label>
                                    <input
                                            type="date"
                                            name="col_fee_rec_date"
                                            value={selectedAdmission.col_fee_rec_date.split('T')[0]}
                                            onChange={handleFormChange}
                                            className="border border-gray-300 rounded w-96 px-2 py-1 cursor-pointer"
                                            required
                                        />
                                </div>
                                {/* Amount CET */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="amt_cet"
                                    >
                                        Amount Paid at KEA
                                    </label>
                                    <input
                                        type="text"
                                        id="amt_cet"
                                        name="amt_cet"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.amt_cet || ""}  // Controlled component
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        placeholder="Amount Paid at KEA"
                                        required
                                    />
                                </div>
                                {/* semester */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="semester"
                                    >
                                        Semester
                                    </label>
                                    <select
                                        name="semester"
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.semester || ""}  // Controlled component
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
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.quota || ""}  // Controlled component
                                        required
                                        >
                                        <option value="">Select quota</option>
                                        <option value="E004">E004</option>
                                        <option value="GQ(E060)">E060</option>
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
                                        name="col_code"
                                        id="col_code" // Use id for accessibility
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.col_code || ""}  // Controlled component
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
                                        htmlFor="cet_no"
                                    >
                                        CET Number
                                    </label>
                                    <input
                                        type="text"
                                        id="cet_no"
                                        name="cet_no"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.cet_no || ""}  // Controlled component
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        placeholder="Enter CET Number"
                                        required
                                    />
                                </div>
                                {/* Document submitted */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="doc_submitted"
                                    >
                                        Document Sumbitted
                                    </label>
                                    <input
                                        type="text"
                                        id="doc_submitted"
                                        name="doc_submitted"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.doc_submitted || ""}  // Controlled component
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        placeholder="Document Sumbitted"
                                        required
                                    />
                                </div>
                                {/* Document to be submitted */}
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="doc_to_be_submitted"
                                    >
                                        Document to be Sumbitted
                                    </label>
                                    <input
                                        type="text"
                                        id="doc_to_be_submitted"
                                        name="doc_to_be_submitted"
                                        onChange={handleFormChange}
                                        value={selectedAdmission?.doc_to_be_submitted || ""}  // Controlled component
                                        className="block w-96 p-2 border border-gray-300 rounded-md required"
                                        placeholder="Document to be Sumbitted"
                                        required
                                    />
                                </div>
                                
                                
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Save Changes
                        </button>
                    </form>
                )}
            </div>
        </Layout>    
    );
};

export default AdmissionData;
