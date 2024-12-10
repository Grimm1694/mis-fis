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
    f_name: string;
    m_name: string;
    course: string;
    old_brcode: string;
    discontinued: number | null;
    discontinued_date: string;
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
   
    const [dateFields, setDateFields] = useState<{ [usno: string]: string }>({});

    const handleDateChange = (usno:string, value:string) => {
        setDateFields((prev) => ({
        ...prev,
        [usno]: value,
        }));
    };

    function formatToInputDate(dateString: string): string | null {
        if( dateString !== null){
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return null; // Return null if the date is invalid 
            }
             return date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
        }
        return null;
    }

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
                initialCheckedRows[admission.usno] = admission.discontinued === 1;
            });
            setCheckedRows(initialCheckedRows);
        }
    }, [admissions]); 

    const fetchAdmissions = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/adm_dropout_fetch?admission_year=${admissionYear}`);
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
        
            // Check if the search query matches the column name 'discontinued'
            if (searchQueryLower === 'discontinued') {
                return admission.discontinued === 1; // Only include rows where 'discontinued' is 1
            }
        
            // Otherwise, search within column values
            return (
                (admission.usno && admission.usno.toLowerCase().includes(searchQueryLower)) ||
                (admission.course && admission.course.toLowerCase().includes(searchQueryLower)) ||
                (admission.s_name && admission.s_name.toLowerCase().includes(searchQueryLower)) ||
                (admission.discontinued && admission.discontinued.toString().includes(searchQueryLower))
            );
        });

    const handleCheckboxChange = (usno: string, isChecked: boolean) => {
        setCheckedRows((prev) => ({ ...prev, [usno]: isChecked }));
    };

    const handleUpdate = async (usno: string) => {
        const confirmUpdate = confirm("Do you want to update?");
        if (confirmUpdate) {
            try {
                const response = await fetch(`/api/adm_dropout_update_flag`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usno, discontinued_date:dateFields[usno], discontinued: checkedRows[usno] ? 1 : null }),
                });
                if (!response.ok) throw new Error("Failed to update");

                alert("Updated successfully!");
                setAdmissions((prevAdmissions) =>
                    prevAdmissions.map((admission) =>
                        admission.usno === usno ? { ...admission,  discontinued_date:dateFields[usno], discontinued: checkedRows[usno] ? 1 : null } : admission
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
        xlsx.writeFile(wb, 'Discontinued.xlsx');
    };

    return (
        <Layout moduleType="admission">
            <ScrollToTop/>
            <div className="ml-2 mt-8">
                <h1 className='ml-4 text-2xl'>Mark Discontinued Students and View Report of Discontinued Student</h1>
                <h1 className='ml-4 text-1xl'>(To View Discontinued Students, Type discontinued in search field)</h1>
                <AdmissionYearDropdown initialYear={Admyear} onYearChange={handleYearChange} />
                {!loading && admissions.length > 0 && (
                    <div className="flex my-2">
                    <input
                        type="text"
                        placeholder="Search by USNO, Name, Department, discontinued"
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
                                        <th className="px-4 py-2 border">Father</th>
                                        <th className="px-4 py-2 border">Branch</th>
                                        <th className="px-4 py-2 border">Discontinued Flag</th>
                                        <th className="px-4 py-2 border">Discontinued Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((admission, index) => (
                                        <tr key={admission.usno} className="hover:bg-gray-100 cursor-pointer">
                                            <td className="border px-4 py-2">{index + 1}</td>
                                            <td className="border px-4 py-2">{admission.usno}</td>
                                            <td className="border px-4 py-2">{admission.s_name}</td>
                                            <td className="border px-4 py-2">{admission.f_name}</td>
                                            <td className="border px-4 py-2">{admission.course}</td>
                                            <td className="border px-4 py-2">
                                                <div className="flex items-center gap-2 leading-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={checkedRows[admission.usno] || false}
                                                        onChange={(e) => handleCheckboxChange(admission.usno, e.target.checked)}
                                                        className="h-4 w-4"
                                                    />
                                                    {(checkedRows[admission.usno] !== (admission.discontinued === 1)) && (
                                                        <button
                                                            onClick={() => handleUpdate(admission.usno)}
                                                            className="bg-blue-500 text-white px-2 py-1 rounded"
                                                        >
                                                            UPDATE
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="border px-4 py-2">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="date"
                                                        value={dateFields[admission.usno] || formatToInputDate(admission.discontinued_date)|| ""}
                                                        onChange={(e) => handleDateChange(admission.usno, e.target.value)}
                                                        className="border rounded px-2 py-1"
                                                    />
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
