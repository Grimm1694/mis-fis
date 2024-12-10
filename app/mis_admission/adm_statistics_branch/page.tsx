"use client";

import React, { useEffect, useState } from 'react';
import AdmissionYearDropdown from '../../components/admission_year';
import ScrollToTop from '../../components/ui/scroll_to_top';
import Layout from '../../components/ui/Layout';
import { useUser } from "../../context/usercontext";
import { useRouter } from 'next/navigation';

interface BranchStat {
    Branch: string;
    Count: number;
    boy_students: number;
    girl_students: number;
    SC: number;
    ST: number;
    Mgmt: number;
    phyChlg: number;
}

const AdmissionStatistics = () => {
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



    const [branchStats, setBranchStats] = useState<BranchStat[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [Admyear, setAdmyear] = useState(''); // Initially set to an empty string
    const [admissionYear, setAdmissionYear] = useState('');

    const handleYearChange = (selectedYear: string) => {
        setAdmyear(selectedYear);
        setAdmissionYear(selectedYear);
    }

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
                    console.log('msg1',Admyear)
                }catch (error) {
                    // Use type assertion to access error message safely
                    const errorMessage = (error as Error).message; // Assert that error is of type Error
                    setError(errorMessage); // Now you can safely use error.message
                }finally {
                    setLoading(false);
                }
        };
        fetchAdmyear();
    }, []);

    const fetchStatistics= async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/adm_branch_stat?admission_year=${admissionYear}`);
            if (!response.ok) {
                throw new Error('Error fetching data');
            }
            const data = await response.json();
            if (data.branchStatistics.length > 0) {
                setBranchStats(data.branchStatistics);
                setTotalCount(data.totalCount);
            } else {
                setBranchStats([]);
                setTotalCount(0);
            }
        } catch (error) {
            setError((error as Error).message);
        
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!admissionYear) return;
        fetchStatistics();
    }, [admissionYear]);
//-------------------------------------------------------------------------------------------------------------------   
    return (
        <Layout moduleType="admission"> <ScrollToTop />
       <div className="flex flex-col items-start mt-8">
            <div className="ml-4 "> {/* Wrapper div to control width */}
                <h1 className='ml-4 text-2xl'>Admissions(Branch-wise)</h1>
                <AdmissionYearDropdown initialYear={Admyear} onYearChange={handleYearChange} />
                {admissionYear && branchStats.length > 0 && (
                <h2 className="ml-4 text-2xl">Total : {totalCount}</h2>) }  
            </div> 
            {Admyear && !loading && branchStats.length > 0 ? (
                <>
                    <div className="ml-4 w-screen "> {/* Wrapper div to control width */}
                        <table className="ml-4 w-9/12 bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-4 text-right text-gray-700 font-semibold border-b">Branch</th>
                                    <th className="py-2 px-4 text-right text-gray-700 font-semibold border-b">Count</th>
                                    <th className="py-2 px-4 text-right text-gray-700 font-semibold border-b">Boys</th>
                                    <th className="py-2 px-4 text-right text-gray-700 font-semibold border-b">Girls</th>
                                    <th className="py-2 px-4 text-right text-gray-700 font-semibold border-b">SC</th>
                                    <th className="py-2 px-4 text-right text-gray-700 font-semibold border-b">ST</th>
                                    <th className="py-2 px-4 text-right text-gray-700 font-semibold border-b">Management</th>
                                    <th className="py-2 px-4 text-right text-gray-700 font-semibold border-b">Physically Challenged</th>
                                </tr>
                            </thead>
                            <tbody>
                                {branchStats.map((stat, index) => (
                                    <tr
                                        key={stat.Branch}
                                        className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}
                                    >
                                        <td className="py-2 px-4 border-b text-right">{stat.Branch}</td>
                                        <td className="py-2 px-4 border-b text-right">{stat.Count}</td>
                                        <td className="py-2 px-4 border-b text-right">{stat.boy_students}</td>
                                        <td className="py-2 px-4 border-b text-right">{stat.girl_students}</td>
                                        <td className="py-2 px-4 border-b text-right">{stat.SC}</td>
                                        <td className="py-2 px-4 border-b text-right">{stat.ST}</td>
                                        <td className="py-2 px-4 border-b text-right">{stat.Mgmt}</td>
                                        <td className="py-2 px-4 border-b text-right">{stat.phyChlg}</td>
                                    </tr>
                                ))}
                                {/* Totals Row */}
                                <tr className="font-semibold bg-gray-200">
                                    <td className="py-2 px-4 border-b text-right">Total</td>
                                    <td className="py-2 px-4 border-b text-right">{totalCount}</td>
                                    <td className="py-2 px-4 border-b text-right">{branchStats.reduce((sum, stat) => sum + stat.boy_students, 0)}</td>
                                    <td className="py-2 px-4 border-b text-right">{branchStats.reduce((sum, stat) => sum + stat.girl_students, 0)}</td>
                                    <td className="py-2 px-4 border-b text-right">{branchStats.reduce((sum, stat) => sum + stat.SC, 0)}</td>
                                    <td className="py-2 px-4 border-b text-right">{branchStats.reduce((sum, stat) => sum + stat.ST, 0)}</td>
                                    <td className="py-2 px-4 border-b text-right">{branchStats.reduce((sum, stat) => sum + stat.Mgmt, 0)}</td>
                                    <td className="py-2 px-4 border-b text-right">{branchStats.reduce((sum, stat) => sum + stat.phyChlg, 0)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                admissionYear && !loading && branchStats.length === 0 &&(
                    <div className="mt-4 ml-4 text-xl">No data available for the academic year.</div>
                )
            )}
        </div>
        </Layout>
    );
};

export default AdmissionStatistics;
