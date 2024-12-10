"use client"

import { useEffect, useState, useRef } from "react";
import BranchSelect from '../../components/branch';
import ScrollToTop from '../../components/ui/scroll_to_top';
import Layout from '../../components/ui/Layout';
import AdmissionYearDropdown from '../../components/admission_year';
import { useUser } from "../../context/usercontext";
import { useRouter } from 'next/navigation';
import xlsx from 'xlsx';

interface Admission {
    adm_year: string;
    usno: string;
    s_name: string;
    course: string;
    c_semester: number;
    p_semester: number;
    eligibility: number | null;
}

const COBmark = () => {
    const { user } = useUser();
    const router = useRouter();
    const previousPage = typeof window !== "undefined" ? window.location.pathname : '/'; // Save the current path as Page A

    const [admissions, setAdmissions] = useState<Admission[]>([]);
    const [checkedRows, setCheckedRows] = useState<{ [usno: string]: boolean }>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [admissionYear, setAdmissionYear] = useState('');
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [Admyear, setAdmyear] = useState('');
    const alertShownRef = useRef(false); // Ref to track if alert has been shown
   
    const [csemFields, setCSemFields] = useState<{ [usno: string]: number }>({});
    const [psemFields, setPSemFields] = useState<{ [usno: string]: number }>({});
    


    const handleChangeCSem = (usno:string, value:number) => {
        setCSemFields((prev) => ({
        ...prev,
        [usno]: value,
        }));
    };
    const handleChangePSem = (usno:string, value:number) => {
        setPSemFields((prev) => ({
        ...prev,
        [usno]: value,
        }));
    };

    useEffect(() => {
        if (admissions.length > 0) {
            const initialCheckedRows: { [usno: string]: boolean } = {};
            const initialCSemFields: { [usno: string]: number } = {};
            const initialPSemFields: { [usno: string]: number } = {};
            
            admissions.forEach(admission => {
                initialCheckedRows[admission.usno] = admission.eligibility === 1;
                initialCSemFields[admission.usno] = admission.c_semester;
                initialPSemFields[admission.usno] = admission.p_semester;
            });
            
            setCheckedRows(initialCheckedRows);
            setCSemFields(initialCSemFields);
            setPSemFields(initialPSemFields);
        }
    }, [admissions]);

    useEffect(() => {
        if (typeof window === 'undefined') return; // Ensure code runs only on client side
    
        const handleRedirects = () => {
            // Redirect to login if user is not logged in
           /*  if (!user) {
                router.push('/');
                return;
            } */
    
            // Check if user has the required role; otherwise, show alert and redirect
           /*  if (user.role !== "adm_admin" && !alertShownRef.current) {
                alert("Not authorized User");
                alertShownRef.current = true;
                router.replace(previousPage);
                return;
            } */
    
            // Fetch data based on admissionYear when it's available
            if (admissionYear) {
                fetchAdmissions();
            }
        };
    
        handleRedirects();
    }, [user, admissionYear, previousPage, router]); 

    useEffect(() => {
        const fetchAdmyear = async () => {
            try {
                setLoading(true); // Start loading before fetching
                const response = await fetch('/api/settings');
                if (!response.ok) throw new Error('Failed to fetch admission year');
                const data = await response.json();
                setAdmyear(data.data[0].adm_year);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false); // Stop loading once the data is fetched
            }
        };
    
        fetchAdmyear();
    }, []); // Only run once on mount

     useEffect(() => {
        if (admissions.length > 0) {
            const initialCheckedRows: { [usno: string]: boolean } = {};
            admissions.forEach(admission => {
                initialCheckedRows[admission.usno] = admission.eligibility == 1;
            });
            setCheckedRows(initialCheckedRows);
        }
    }, [admissions]); 

    const fetchAdmissions = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/adm_eligibility_fetch?admission_year=${admissionYear}`);
            if (!response.ok) throw new Error('Error fetching data');
            const data = await response.json();
            setAdmissions(data);

            console.log('msg',data)
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleYearChange = (selectedYear: string) => {
        setAdmissionYear(selectedYear);
        setError(null);
        setAdmissions([]);
        setSearchQuery('');
    };

    const handleBackButton = () => setSearchQuery('');  
    
    // Check if the search query matches the column name
    const filteredData = admissions.filter((admission) => {
        const searchQueryLower = searchQuery.toLowerCase();
        const searchTerms = searchQueryLower.split(/\s+/); // Split the query into multiple terms (space-separated)
        
        // Check if the search query matches 'eligible' or 'noneligible'
        const eligibilityFilter = searchTerms.includes('eligible') || searchTerms.includes('noneligible');
        const courseFilter = searchTerms.some(term => admission.course && admission.course.toLowerCase().includes(term));
        const usnoFilter = searchTerms.some(term => admission.usno && admission.usno.toLowerCase().includes(term));
        const nameFilter = searchTerms.some(term => admission.s_name && admission.s_name.toLowerCase().includes(term));
    
        // Eligibility conditions based on search terms
        const isNonEligible = admission.eligibility === 1;  // Noneligible students have eligibility === 1
        const isEligible = admission.eligibility === null; // Eligible students have eligibility === null
        
        // Eligibility matches the search term (either 'eligible' or 'noneligible')
        const eligibilityMatches = eligibilityFilter
            ? (searchTerms.includes('eligible') ? isEligible : searchTerms.includes('noneligible') ? isNonEligible : true)
            : true; // If 'eligible' or 'noneligible' isn't part of the query, allow any eligibility value
        
        // Ensure the course filter matches the course term (e.g., 'ei')
        const courseMatches = searchTerms.some(term => admission.course && admission.course.toLowerCase().includes(term));
    
        // Combine the filters
        return (
            (eligibilityMatches && courseMatches && (usnoFilter || nameFilter || courseFilter)) // Combine eligibility and course filters
        );
    });
    
    const handleCheckboxChange = (usno: string, isChecked: boolean) => {
        setCheckedRows((prev) => ({ ...prev, [usno]: isChecked }));
    };

    const handleUpdate = async (usno: string) => {
        const confirmUpdate = confirm("Do you want to update?");
        if (confirmUpdate) {
            try {
                const response = await fetch(`/api/adm_eligibility_update_flag`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        usno, 
                        c_semester: csemFields[usno] ?? admissions.find(a => a.usno === usno)?.c_semester ?? 0,
                        p_semester: psemFields[usno] ?? admissions.find(a => a.usno === usno)?.p_semester ?? 0,
                        eligibility: checkedRows[usno] ? 1 : null 
                    }),
                });
                if (!response.ok) throw new Error("Failed to update");
    
                alert("Updated successfully!");
                setAdmissions((prevAdmissions) =>
                    prevAdmissions.map((admission) =>
                        admission.usno === usno 
                            ? { ...admission, 
                                c_semester: csemFields[usno] ?? admission.c_semester, 
                                p_semester: psemFields[usno] ?? admission.p_semester, 
                                eligibility: checkedRows[usno] ? 1 : null 
                              } 
                            : admission
                    )
                );
            } catch (error) {
                alert(`Error: ${(error as Error).message}`);
            }
        }
    };
    



    const exportToExcel = () => {
        // Convert data to a worksheet
        const ws = xlsx.utils.json_to_sheet(filteredData); // Use filteredData or tableData here if defined
        
        // Create a new workbook and append the worksheet
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Admissions');
    
        // Export to Excel file
        xlsx.writeFile(wb, 'Eligibility_report.xlsx');
    };

    return (
        <Layout moduleType="admission">
            <ScrollToTop/>
            <div className="ml-2 mt-8">
                <h1 className='ml-4 text-2xl'>Update Eligiblity and View Report of Eligible and Non-Eligible Students</h1>
                <h1 className='ml-4 text-2xl'><ul>Note:</ul></h1>
                <h1 className='ml-4 text-1xl'>(To View Eligible Students, Type <b> eligible</b> in search field followed by space and branch code if branch wise data is required)</h1>
                <h1 className='ml-4 text-1xl'>(To View Non Eligible Students, Type <b> noneligible</b> in search field followed  by space  and branch code if branch wise data is required)</h1>
                <h1 className='ml-4 text-1xl'>(If Eligibility flag  is checked -- Student is Non eligible)</h1>
                <AdmissionYearDropdown initialYear={Admyear} onYearChange={handleYearChange} />
                {!loading && admissions.length > 0 && (
                    <div className="flex my-2">
                    <input
                        type="text"
                        placeholder="Search by USNO, Name, Department, eligible"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-96 mr-4 p-2 border border-gray-400 rounded"
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
                </div>
                )}
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-red-600">Error: {error}</p>
                ) : (
                    <div>
                        {admissions.length > 0 ? (
                            <table className="min-w-full bg-white border border-gray-300">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-2 border">Sl.No</th>
                                        <th className="px-4 py-2 border">USN</th>
                                        <th className="px-4 py-2 border">Name</th>
                                        <th className="px-4 py-2 border">Branch</th>
                                        <th className="px-4 py-2 border">Current Semester</th>
                                        <th className="px-4 py-2 border">Semester Promoted to</th>
                                        <th className="px-4 py-2 border">Eligibility Flag</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((admission, index) => (
                                        <tr key={admission.usno} className="hover:bg-gray-100 cursor-pointer">
                                            <td className="border px-4 py-2">{index + 1}</td>
                                            <td className="border px-4 py-2">{admission.usno}</td>
                                            <td className="border px-4 py-2">{admission.s_name}</td>
                                            <td className="border px-4 py-2">{admission.course}</td>
                                            <td className="border px-4 py-2">
                                                <div className="flex items-center gap-2 leading-none">
                                                    <input
                                                        type="number"
                                                        value={
                                                            psemFields[admission.usno] !== undefined && psemFields[admission.usno] !== null
                                                                ? psemFields[admission.usno]
                                                                : admission.p_semester ?? 0 // Use 0 as fallback for null values
                                                        }
                                                        onChange={(e) => handleChangePSem(admission.usno, parseInt(e.target.value, 10) || 0)}
                                                        className="h-8 w-16 border px-2 py-1"
                                                    />
                                                </div>
                                            </td>
                                            <td className="border px-4 py-2">
                                                <div className="flex items-center gap-2 leading-none">
                                                    <input
                                                        type="number"
                                                        value={
                                                            csemFields[admission.usno] !== undefined && csemFields[admission.usno] !== null
                                                                ? csemFields[admission.usno]
                                                                : admission.c_semester ?? 0 // Use 0 as fallback for null values
                                                        }
                                                        onChange={(e) => handleChangeCSem(admission.usno, parseInt(e.target.value, 10) || 0)}
                                                        className="h-8 w-16 border px-2 py-1"
                                                    />
                                                </div>
                                            </td>
                                            <td className="border px-4 py-2">
                                                <div className="flex items-center gap-2 leading-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!checkedRows[admission.usno]} // Ensure a boolean value
                                                        onChange={(e) => handleCheckboxChange(admission.usno, e.target.checked)}
                                                        className="h-4 w-4"
                                                    />
                                                    <button
                                                        onClick={() => handleUpdate(admission.usno)}
                                                        className="bg-blue-500 text-white px-2 py-1 rounded"
                                                    >
                                                        UPDATE
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            admissionYear && <p>No admissions found for {admissionYear}.</p>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default COBmark;
