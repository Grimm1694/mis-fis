"use client"

import React, { useEffect, useState } from 'react';
import ScrollToTop from '../../components/ui/scroll_to_top';
import Layout from '../../components/ui/Layout';
import AdmissionYearDropdown from '../../components/admission_year';
import { useUser } from "../../context/usercontext";
import { useRouter } from 'next/navigation';

interface Admission {
    adm_year: string;
    usno: string;
    old_usno: string;
    s_name: string;
    course: string;
}

const SaveOldUsn = () => {
    const [admissions, setAdmissions] = useState<Admission[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [admissionYear, setAdmissionYear] = useState('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [Admyear, setAdmyear] = useState('');
    const [pendingUpdate, setPendingUpdate] = useState(false); // To track if confirmation is needed
//------------------------------------------------------------------------------------------
    // Redirect if not logged in; only run this on the client
    /* const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined' && !user) {
        router.push('/'); // Redirect to login
        }
    }, [user, router]); */
//------------------------------------------------------------------------------------------  

    useEffect(() => {
        const fetchAdmyear = async () => {
            try {
                const response = await fetch('/api/settings');
                if (!response.ok) throw new Error('Failed to fetch admission year');
                const data = await response.json();
                setAdmyear(data.data[0].adm_year);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchAdmyear();
    }, []);

    const fetchAdmissions = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/adm_vtu_usno_fetch?admission_year=${admissionYear}`);
            if (!response.ok) throw new Error('Error fetching data');
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

    const handlePrepareUpdate = () => {
        setPendingUpdate(true); // Set the state to prompt the confirmation
        const updatedAdmissions = admissions.map(admission => ({
            ...admission,
            old_usno: admission.usno // Copy usno to old_usno in the component state
        }));
        setAdmissions(updatedAdmissions);
    };

    const handleConfirmUpdate = async () => {
        if (!pendingUpdate) return;

        try {
            const response = await fetch('/api/adm_oldusno_update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adm_year: admissionYear }), // Send the required data for update
            });
            if (!response.ok) throw new Error('Failed to update USNO');
            setPendingUpdate(false); // Reset pending update
            await fetchAdmissions(); // Refresh data after update
        } catch (error) {
            setError((error as Error).message);
        }
    };

    const handleYearChange = (selectedYear: string) => {
        setAdmissionYear(selectedYear);
        setError(null);
        setAdmissions([]);
        setSearchQuery('');
    };

    const handleBackButton = () => {
        setSearchQuery('');
    };

    const filteredData = admissions.filter((admission) => {
        return (
            (admission.usno && admission.usno.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (admission.old_usno && admission.old_usno.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (admission.course && admission.course.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (admission.s_name && admission.s_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (admission.adm_year && admission.adm_year.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    });

    return (
        <Layout moduleType="admission">
            <ScrollToTop />
            <div className="ml-2 mt-6">
                <h1 className='ml-4 text-2xl'>Save Old USNO</h1>
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
                        <button
                            onClick={handleBackButton}
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-4"
                        >
                            Back
                        </button>
                        <button
                            onClick={handlePrepareUpdate}
                            className="bg-green-500 text-white px-4 py-2 rounded mt-4 ml-4"
                        >
                            Copy USNO to OLD USNO
                        </button>
                        {pendingUpdate && (
                            <button
                                onClick={handleConfirmUpdate}
                                className="bg-red-500 text-white px-4 py-2 rounded mt-4 ml-4"
                            >
                                Confirm Update
                            </button>
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
                                        <th className="px-4 py-2 border">Admission Year</th>
                                        <th className="px-4 py-2 border">USN</th>
                                        <th className="px-4 py-2 border">OLD USN</th>
                                        <th className="px-4 py-2 border">Name</th>
                                        <th className="px-4 py-2 border">Course</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((admission, index) => (
                                        <tr key={admission.usno} className="hover:bg-gray-100 cursor-pointer">
                                            <td className="border px-4 py-2">{index + 1}</td>
                                            <td className="border px-4 py-2">{new Date(admission.adm_year).toLocaleDateString()}</td>
                                            <td className="border px-4 py-2">{admission.usno}</td>
                                            <td className="border px-4 py-2">{admission.old_usno}</td>
                                            <td className="border px-4 py-2">{admission.s_name}</td>
                                            <td className="border px-4 py-2">{admission.course}</td>
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

export default SaveOldUsn;
