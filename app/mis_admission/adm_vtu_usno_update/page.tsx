"use client"

import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import BranchSelect from '../../components/branch';
import ScrollToTop from '../../components/ui/scroll_to_top';
import Layout from '../../components/ui/Layout';
import AdmissionYearDropdown from '../../components/admission_year';
import { useUser } from "../../context/usercontext";
import { useRouter } from 'next/navigation';

    interface FormErrors {
        [key: string]: string;
    }

    interface Admission {
        adm_year: string;
        usno: string;
        old_usno:string;
        s_name: string;
        f_name: string;
        m_name: string; 
        course: string;          
    }

    const VTUusnoUpdate = () => {
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
        const [admissionYear, setAdmissionYear] = useState('');
        const [searchQuery, setSearchQuery] = useState<string>(""); // State to store search input
        const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
        const [showForm, setShowForm] = useState(false);
        const [formErrors, setFormErrors] = useState<FormErrors>({});
        const [selectedBranch, setSelectedBranch] = useState<string>("");
        const [selectedRowData, setSelectedRowData] = useState<{ usno: string; s_name: string } | null>(null);
        const [Admyear, setAdmyear] = useState('');
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
                const response = await fetch(`/api/adm_vtu_usno_fetch?admission_year=${admissionYear}`);
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
            setSelectedBranch(admission.course|| '');
            setSelectedRowData({ usno: admission.usno, s_name: admission.s_name }); 
            setSelectedAdmission({
                ...admission,
            });
            setShowForm(true);
        };
//-------------------------------------------------------------------------------------------------------------------------
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
            const { name, value } = e.target;
            setSelectedAdmission((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    [name]: value,
                };
            });
        };
//------------------------------------Form Submit--------------------------------------------------            
        const handleFormSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (selectedAdmission) {
                try {
                const response = await fetch(`/api/adm_vtu_usno_update`, {
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

// --------------------------------Filter----------------------------------------------------------------------  
        const filteredData = admissions.filter((admission) => {
            return (
                (admission.usno && admission.usno.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (admission.old_usno && admission.old_usno.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (admission.course && admission.course.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (admission.s_name && admission.s_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (admission.adm_year && admission.adm_year.toLowerCase().includes(searchQuery.toLowerCase())) 
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
        
                <div className="ml-2 mt-8">
                    {/* Dropdown for selecting admission year */}
                    <h1 className='ml-4 text-2xl'>Update VTU USNO</h1>
                    <AdmissionYearDropdown initialYear={Admyear} onYearChange={handleYearChange} />
                    
                    {/* Conditionally render the search bar only when data is loaded */}
                    {!loading && admissions.length > 0 && (
                        <div className="flex my-2">
                            <input
                                type="text"
                                placeholder="Search by USNO, Name, Department"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-96 p-2 border border-gray-400 rounded"
                            />
                            {searchQuery.length > 0 && (
                                <div className=" ml-4">
                                    <button
                                    onClick= {handleBackButton}
                                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                                    >
                                    Back
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
                                            <th className="px-4 py-2 border">OLD USN</th>
                                            <th className="px-4 py-2 border">Name</th>
                                            <th className="px-4 py-2 border">Father</th>
                                            <th className="px-4 py-2 border">Mother</th>
                                            <th className="px-4 py-2 border">Course</th>
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
                                                <td className="border px-4 py-2">{admission.old_usno}</td>
                                                <td className="border px-4 py-2">{admission.s_name}</td>
                                                <td className="border px-4 py-2">{admission.f_name}</td>
                                                <td className="border px-4 py-2">{admission.m_name}</td>
                                                <td className="border px-4 py-2">{admission.course}</td>
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
                            <div className=" max-w-6xl bg-red-50 shadow-md rounded-md  my-2 mt-2">
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
                                            value={selectedAdmission?.usno || ''}
                                            onChange={handleFormChange}
                                            className="border border-gray-300 rounded w-96 px-2 py-1"
                                            required
                                        />
                                    </div>
                                    {/* Old Usno */}
                                    <div>
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-1"
                                            htmlFor="oldusno"
                                        >
                                            OLD USNO
                                        </label>
                                        <input
                                            type="text"
                                            id="oldusno"
                                            name="oldusno"
                                            value={selectedAdmission.old_usno}
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
export default VTUusnoUpdate;
