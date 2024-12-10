"use client"

import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import BranchSelect from '../../components/branch';
import ScrollToTop from '../../components/ui/scroll_to_top';
import Layout from '../../components/ui/Layout';
import AdmissionYearDropdown from '../../components/admission_year';
import { useUser } from "../../context/usercontext";
import { useRouter } from 'next/navigation';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font, PDFViewer, Image } from '@react-pdf/renderer';
import MyDocument from '../../components/mypdfdocument_tc';

    interface FormErrors {
        [key: string]: string;
    }

    interface Admission {
        adm_year: string;
        usno: string;
        s_name: string;
        f_name: string;
        gender: string;
        dob: string; 
        caste: string;
        category: string;
        nationality: string;
        adm_date: string;
        course: string;          
    }

    
    const VTUusnoUpdate = () => {
//------------------------------------------------------------------------------------------
        // Redirect if not logged in; only run this on the client
        const { user } = useUser();
        const router = useRouter();
        
      

       /*  useEffect(() => {
        if (typeof window !== 'undefined' && !user) {
        router.push('/'); // Redirect to login
        }
        }, [user, router]); */
//------------------------------------------------------------------------------------------  
        const [admissions, setAdmissions] = useState<Admission[]>([]);
        const [DoL, setDOL] = useState(new Date().toISOString().split("T")[0]);
        const [Sem, setSem] = useState<string>("");
        const [CondChar, setCondChar] = useState<string>("");
        const [Shara, setShara] = useState<string>("");
        const [QualNext, setQualNext] = useState<string>("");
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
        const [preview, setPreview] = useState(false);  // State to toggle preview
        const [tableData, setTableData] = useState<string[][]>([]);
        

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
                const response = await fetch(`/api/adm_certificate_tc_fetch?admission_year=${admissionYear}`);
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
        const handleFormSubmit = (e: React.FormEvent) => {
            e.preventDefault();

            if (!selectedAdmission) {
                alert("No admission data selected!");
                return;
            }

            const generatedData = [
                ['Name of Student / ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು  ', selectedAdmission.s_name || "N/A"],
                ['Name of Father / Mother / Gardian\n ತಂದೆ / ತಾಯಿಯ / ಪೋಷಕರ ಹೆಸರು   ', selectedAdmission.f_name || "N/A"],
                ['Gender / ಲಿಂಗ ', selectedAdmission.gender || "N/A"],
                ['Date of Birth / ಜನ್ಮ ದಿನಾಂಕ ', selectedAdmission.dob ? new Date(selectedAdmission.dob).toLocaleDateString() : "N/A"],
                ['Caste / ಜಾತಿ ', selectedAdmission.caste || "N/A"],
                ['Category / ವರ್ಗ ', selectedAdmission.category || "N/A"],
                ['Nationality / ರಾಷ್ಟ್ರೀಯತೆ   ', selectedAdmission.nationality || "N/A"],
                ['Admission Date / ಪ್ರವೇಶ ದಿನಾಂಕ   ', selectedAdmission.adm_date ? new Date(selectedAdmission.adm_date).toLocaleDateString() : "N/A"],
                ['Date of Leaving / ಸಂಸ್ಥೆಯನ್ನು ಬಿಟ್ಟ ದಿನಾಂಕ  ', DoL || "N/A"],
                ['Programme Studied / ಓದುತಿದ್ದ ವಿಭಾಗ   ', selectedAdmission.course || "N/A"],
                ['USNO / ನೋಂದಣಿ ಸಂಖ್ಯೆ   ', selectedAdmission.usno || "N/A"],
                ['Class Studying / ಓದುತಿದ್ದ ತರಗತಿ   ', Sem || "N/A"],
                ['Whether Qualified for promotion to the Next higher Class\n ಮೇಲಿನ ತರಗತಿಗೆ ಭಡ್ತಿ ಪಡೆಯಲು ಅರ್ಹರೇ?  ', QualNext || "N/A"],
                ['Conduct & Character / ವಿದ್ಯಾರ್ಥಿಯ ಗುಣ ಮತ್ತು ನಡೆತೆ   ', CondChar || "N/A"],
                ['Remarks / ಷರಾ  ', Shara || "N/A"],
            ];
            setTableData(generatedData);
            setPreview(!preview)

            // Render MyDocument with tableData
            // For example, using PDFViewer or PDFDownloadLink
           /*  return (
                <PDFViewer>
                    <MyDocument tableData={tableData} />
                </PDFViewer>
            ); */
        };

        interface MyDocumentProps {
            tableData: string[][];      }
        
//---------------------------------Back Button------------------------------------------------------
        const handleBackButton = async () => {
            setShowForm(false);
            setSearchQuery('');
        };

// --------------------------------Filter----------------------------------------------------------------------  
        const filteredData = admissions.filter((admission) => {
            return (
                (admission.usno && admission.usno.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
                    <h1 className='ml-4 text-2xl'>Transfer Certificate</h1>
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
                                <table className="min-w-full bg-white border border-gray-300 ">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="px-4 py-2 border">Sl.No</th> 
                                            <th className="px-4 py-2 border">USN</th>
                                            <th className="px-4 py-2 border">Name</th>
                                            <th className="px-4 py-2 border">Father</th>
                                            <th className="px-4 py-2 border">Gender</th>
                                            <th className="px-4 py-2 border">DoB</th>
                                            <th className="px-4 py-2 border">Caste</th>
                                            <th className="px-4 py-2 border">Category</th>
                                            <th className="px-4 py-2 border">Nationality</th>
                                            <th className="px-4 py-2 border">Adm Date</th>
                                            <th className="px-4 py-2 border">Corurse</th>
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
                                                <td className="border px-4 py-2">{admission.usno}</td>
                                                <td className="border px-4 py-2">{admission.s_name}</td>
                                                <td className="border px-4 py-2">{admission.f_name}</td>
                                                <td className="border px-4 py-2">{admission.gender}</td>
                                                <td className="border px-4 py-2">{new Date(admission.dob).toLocaleDateString()}</td>
                                                <td className="border px-4 py-2">{admission.caste}</td>
                                                <td className="border px-4 py-2">{admission.category}</td>
                                                <td className="border px-4 py-2">{admission.nationality}</td>
                                                <td className="border px-4 py-2">{new Date(admission.adm_date).toLocaleDateString()}</td>
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
                                    {/* s_name*/}
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
                                    {/* f_name*/}
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
                                    {/* gender*/}
                                    <div>
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-1"
                                            htmlFor="gender"
                                        >
                                            Gender
                                        </label>
                                        <input
                                            type="text"
                                            name="gender"
                                            value={selectedAdmission.gender}
                                            onChange={handleFormChange}
                                            className="border border-gray-300 rounded w-96 px-2 py-1"
                                            required
                                        />
                                    </div>
                                    {/* dob*/}
                                    <div>
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-1"
                                            htmlFor="dob"
                                        >
                                            DoB
                                        </label>
                                        <input
                                            type="text"
                                            name="gender"
                                            value={new Date(selectedAdmission.dob).toLocaleDateString()}
                                            onChange={handleFormChange}
                                            className="border border-gray-300 rounded w-96 px-2 py-1"
                                            required
                                        />
                                    </div>
                                    {/* caste*/}
                                    <div>
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-1"
                                            htmlFor="caste"
                                        >
                                            Caste
                                        </label>
                                        <input
                                            type="text"
                                            name="caste"
                                            value={selectedAdmission.caste}
                                            onChange={handleFormChange}
                                            className="border border-gray-300 rounded w-96 px-2 py-1"
                                            required
                                        />
                                    </div>
                                    {/* category*/}
                                    <div>
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-1"
                                            htmlFor="category"
                                        >
                                            Category
                                        </label>
                                        <input
                                            type="text"
                                            name="category"
                                            value={selectedAdmission.category}
                                            onChange={handleFormChange}
                                            className="border border-gray-300 rounded w-96 px-2 py-1"
                                            required
                                        />
                                    </div>
                                    {/* Nationality*/}
                                    <div>
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-1"
                                            htmlFor="nationality"
                                        >
                                            Nationality
                                        </label>
                                        <input
                                            type="text"
                                            name="nationality"
                                            value={selectedAdmission.nationality}
                                            onChange={handleFormChange}
                                            className="border border-gray-300 rounded w-96 px-2 py-1"
                                            required
                                        />
                                    </div>
                                    {/* adm_date*/}
                                    <div>
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-1"
                                            htmlFor="adm_date"
                                        >
                                            Admission Date
                                        </label>
                                        <input
                                            type="text"
                                            name="adm_date"
                                            value={new Date(selectedAdmission.adm_date).toLocaleDateString()}
                                            onChange={handleFormChange}
                                            className="border border-gray-300 rounded w-96 px-2 py-1"
                                            required
                                        />
                                    </div>
                                    {/* date_of_leaving*/}
                                    <div>
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-1"
                                            htmlFor="date_of_leaving"
                                        >
                                            Date of Leaving Institute
                                        </label>
                                        <input
                                            type="date"
                                            id="dob"
                                            value={DoL}
                                            onChange={(e) => setDOL(e.target.value)}
                                            className="border border-gray-300 rounded w-96 px-2 py-1"
                                            required
                                        />
                                    </div>
                                    {/* Course*/}
                                    <div>
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-1"
                                            htmlFor="course"
                                        >
                                            Course
                                        </label>
                                        <input
                                            type="text"
                                            name="course"
                                            value={selectedAdmission.course}
                                            onChange={handleFormChange}
                                            className="border border-gray-300 rounded w-96 px-2 py-1"
                                            required
                                        />
                                    </div>
                                    {/* USNO */}
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
                                    {/* class_studying */}
                                    <div>
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-1"
                                            htmlFor="class_studying"
                                        >
                                            Class Studying at the time of Leaving
                                        </label>
                                        <input
                                            type="text"
                                            id="class_studying"
                                            name="class_studying" 
                                            value={Sem}
                                            onChange={(e) => setSem(e.target.value)}
                                            className="border border-gray-300 rounded w-96 px-2 py-1"
                                            required
                                        />
                                    </div>
                                    {/* qual_next */}
                                    <div>
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-1"
                                            htmlFor="qual_next"
                                        >
                                            Whether Qualified for Promotion to the next Higher Class?
                                        </label>
                                        <input
                                            type="text"
                                            id="qual_next"
                                            name="qual_next" 
                                            value={QualNext}
                                            onChange={(e) => setQualNext(e.target.value)}
                                            className="border border-gray-300 rounded w-96 px-2 py-1"
                                            required
                                        />
                                    </div>
                                    {/* conduct_char */}
                                    <div>
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-1"
                                            htmlFor="conduct_char"
                                        >
                                            Character and Conduct of the Student
                                        </label>
                                        <input
                                            type="text"
                                            id="conduct_char"
                                            name="conduct_char" 
                                            value={CondChar}
                                            onChange={(e) => setCondChar(e.target.value)}
                                            className="border border-gray-300 rounded w-96 px-2 py-1"
                                            required
                                        />
                                    </div>
                                    {/* shara */}
                                    <div>
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-1"
                                            htmlFor="shara"
                                        >
                                            Remarks
                                        </label>
                                        <input
                                            type="text"
                                            id="shara"
                                            name="shara" 
                                            value={Shara}
                                            onChange={(e) => setShara(e.target.value)}
                                            className="border border-gray-300 rounded w-96 px-2 py-1"
                                            required
                                        />
                                    </div>
                                </div>    
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    type="submit"
                                    className="mt-2 mb-2 bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                Submit
                                </button>
                                {/* Button to toggle PDF preview */}
                            </div>
                        </form>  
                    )}
                    {tableData.length > 0 && (
                        <button
                        onClick={() => setPreview(!preview)}
                        className="mb-4 p-2 bg-blue-500 text-white rounded"
                        >
                        {preview ? 'Hide Preview' : 'Preview PDF'}
                        </button>
                    )}  
             
                    {/* Conditional rendering for PDF preview */}
                    {tableData.length > 0 && preview && (
                        preview ? (
                        <PDFViewer width="100%" height="600">
                            <MyDocument tableData={tableData} />
                        </PDFViewer>
                        ) : (
                        <PDFDownloadLink
                            document={<MyDocument tableData={tableData} />}
                            fileName="Student_Admission_Information.pdf"
                        >
                            <button className="mb-4 p-2 bg-green-300 text-white rounded">
                            Download PDF
                            </button>
                        </PDFDownloadLink>
                        )
                    )}     
                </div>
            </Layout>    
        );
    };
export default VTUusnoUpdate;
