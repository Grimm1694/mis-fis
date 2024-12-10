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
    Cat_1G: number;
    Cat_2A: number;
    Cat_2B:number;
    Cat_3A: number;
    Cat_3B: number;
    GM:number;
    SC: number;
    ST: number;
    NRI: number;
    Others: number;
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
    const [categoryStats, setCategoryStats] = useState<BranchStat[]>([]);
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
                const response = await fetch(`/api/adm_category_stat?admission_year=${admissionYear}`);
                if (!response.ok) {
                    throw new Error('Error fetching data');
                }
                const data = await response.json();
                if (data.categoryStatistics.length > 0) {
                    setCategoryStats(data.categoryStatistics);
                    setTotalCount(data.totalCount);
                } else {
                    setCategoryStats([]);
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
         <div className="flex flex-col w-9/12 items-start mt-8">
            <div className="ml-4  "> {/* Wrapper div to control width */}
                <h1 className='ml-4 text-2xl'>Category Statistics(Branch-wise)</h1>
                <AdmissionYearDropdown initialYear={Admyear} onYearChange={handleYearChange} />
                {admissionYear && categoryStats.length > 0 && (
                <h2 className="ml-4 text-2xl">Total: {totalCount}</h2>) }  
            </div> 
            {Admyear && !loading && categoryStats.length > 0 ? (
                <>
                    <div className="ml-4 w-screen"> {/* Wrapper div to control width */}
                        <table className="ml-4 w-9/12 bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-300">
                                    <th className="py-2 px-4 text-right text-gray-700 font-semibold border-b">Branch</th>
                                    <th className="py-2 px-4 text-right text-gray-700 font-semibold border-b">Count</th>
                                    <th className="py-2 px-4 text-right text-gray-700 font-semibold border-b">1G</th>
                                    <th className="py-2 px-4 text-right text-gray-700 font-semibold border-b">2A</th>
                                    <th className="py-2 px-4 text-right text-gray-700 font-semibold border-b">2B</th>
                                    <th className="py-2 px-4 text-right text-gray-700 font-semibold border-b">3A</th>
                                    <th className="py-2 px-4 text-right text-gray-700 font-semibold border-b">3B</th>
                                    <th className="py-2 px-4 text-right text-gray-700 font-semibold border-b">GM</th>
                                    <th className="py-2 px-4 text-right text-gray-700 font-semibold border-b">SC</th>
                                    <th className="py-2 px-4 text-right text-gray-700 font-semibold border-b">ST</th>
                                    <th className="py-2 px-4 text-right text-gray-700 font-semibold border-b">NRI</th>
                                    <th className="py-2 px-4 text-right text-gray-700 font-semibold border-b">Others</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoryStats.map((stat, index) => (
                                    <tr
                                        key={stat.Branch}
                                        className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}
                                    >
                                        <td className="py-2 px-4 border-b text-right">{stat.Branch}</td>
                                        <td className="py-2 px-4 border-b text-right">{stat.Count}</td>
                                        <td className="py-2 px-4 border-b text-right">{stat.Cat_1G}</td>
                                        <td className="py-2 px-4 border-b text-right">{stat.Cat_2A}</td>
                                        <td className="py-2 px-4 border-b text-right">{stat.Cat_2B}</td>
                                        <td className="py-2 px-4 border-b text-right">{stat.Cat_3A}</td>
                                        <td className="py-2 px-4 border-b text-right">{stat.Cat_3B}</td>
                                        <td className="py-2 px-4 border-b text-right">{stat.GM}</td>
                                        <td className="py-2 px-4 border-b text-right">{stat.SC}</td>
                                        <td className="py-2 px-4 border-b text-right">{stat.ST}</td>
                                        <td className="py-2 px-4 border-b text-right">{stat.NRI}</td>
                                        <td className="py-2 px-4 border-b text-right">{stat.Others}</td>
                                    </tr>
                                ))}
                                {/* Totals Row */}
                                <tr className="font-semibold bg-gray-200">
                                    <td className="py-2 px-4 border-b text-right">Total</td>
                                    <td className="py-2 px-4 border-b text-right">{totalCount}</td>
                                    <td className="py-2 px-4 border-b text-right">{categoryStats.reduce((sum, stat) => sum + (stat.Cat_1G || 0), 0)}</td>
                                    <td className="py-2 px-4 border-b text-right">{categoryStats.reduce((sum, stat) => sum + (stat.Cat_2A || 0), 0)}</td>
                                    <td className="py-2 px-4 border-b text-right">{categoryStats.reduce((sum, stat) => sum + (stat.Cat_2B || 0), 0)}</td>
                                    <td className="py-2 px-4 border-b text-right">{categoryStats.reduce((sum, stat) => sum + (stat.Cat_3A || 0), 0)}</td>
                                    <td className="py-2 px-4 border-b text-right">{categoryStats.reduce((sum, stat) => sum + (stat.Cat_3B || 0), 0)}</td>
                                    <td className="py-2 px-4 border-b text-right">{categoryStats.reduce((sum, stat) => sum + (stat.GM || 0), 0)}</td>
                                    <td className="py-2 px-4 border-b text-right">{categoryStats.reduce((sum, stat) => sum + (stat.SC || 0), 0)}</td>
                                    <td className="py-2 px-4 border-b text-right">{categoryStats.reduce((sum, stat) => sum + (stat.ST || 0), 0)}</td>
                                    <td className="py-2 px-4 border-b text-right">{categoryStats.reduce((sum, stat) => sum + (stat.NRI || 0), 0)}</td>
                                    <td className="py-2 px-4 border-b text-right">{categoryStats.reduce((sum, stat) => sum + (stat.Others || 0), 0)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                admissionYear && !loading && categoryStats.length === 0 &&(
                    <div className="mt-4 ml-4 text-xl">No data available for the academic year.</div>
                )
            )}
        </div>
        </Layout>
    );
};

export default AdmissionStatistics;
