"use client"

import { useEffect, useState, useRef } from "react";
import BranchSelect from '../../components/branch';
import ScrollToTop from '../../components/ui/scroll_to_top';
import Layout from '../../components/ui/Layout';
import AdmissionYearDropdown from '../../components/admission_year';
import { useUser } from "../../context/usercontext";
import { useRouter } from 'next/navigation';

interface Admission {
    adm_year: string;
    usno: string;
    s_name: string;
    f_name: string;
    m_name: string;
    course: string;
    old_brcode: string;
    cob_flag: number | null;
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


    useEffect(() => {
        if (typeof window === 'undefined') return; // Ensure code runs only on client side
    
        const handleRedirects = () => {
            // Redirect to login if user is not logged in
            if (!user) {
                router.push('/');
                return;
            }
    
            // Check if user has the required role; otherwise, show alert and redirect
            if (user.role !== "adm_admin" && !alertShownRef.current) {
                alert("Not authorized User");
                alertShownRef.current = true;
                router.replace(previousPage);
                return;
            }
    
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
                initialCheckedRows[admission.usno] = admission.cob_flag === 1;
            });
            setCheckedRows(initialCheckedRows);
        }
    }, [admissions]); 

    const fetchAdmissions = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/adm_vtu_usno_fetch?admission_year=${admissionYear}`);
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

    const filteredData = admissions.filter((admission) =>
        (admission.usno && admission.usno.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (admission.course && admission.course.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (admission.s_name && admission.s_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (admission.adm_year && admission.adm_year.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleCheckboxChange = (usno: string, isChecked: boolean) => {
        setCheckedRows((prev) => ({ ...prev, [usno]: isChecked }));
    };

    const handleUpdate = async (usno: string) => {
        const confirmUpdate = confirm("Do you want to update?");
        if (confirmUpdate) {
            try {
                const response = await fetch(`/api/adm_cob_update_flag`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usno, cob_Flag: checkedRows[usno] ? 1 : null }),
                });
                if (!response.ok) throw new Error("Failed to update");

                alert("Updated successfully!");
                setAdmissions((prevAdmissions) =>
                    prevAdmissions.map((admission) =>
                        admission.usno === usno ? { ...admission, cob_flag: checkedRows[usno] ? 1 : null } : admission
                    )
                );
            } catch (error) {
                alert(`Error: ${(error as Error).message}`);
            }
        }
    };

    return (
        <Layout moduleType="admission">
            <ScrollToTop/>
            <div className="ml-2 mt-8">
                <h1 className='ml-4 text-2xl'>Mark Change of Branch Students</h1>
                <AdmissionYearDropdown initialYear={Admyear} onYearChange={handleYearChange} />
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
                            <div className="ml-4">
                                <button
                                    onClick={handleBackButton}
                                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
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
                                        <th className="px-4 py-2 border">COB Flag</th>
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
                                                    {(checkedRows[admission.usno] !== (admission.cob_flag === 1)) && (
                                                        <button
                                                            onClick={() => handleUpdate(admission.usno)}
                                                            className="bg-blue-500 text-white px-2 py-1 rounded"
                                                        >
                                                            UPDATE
                                                        </button>
                                                    )}
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
