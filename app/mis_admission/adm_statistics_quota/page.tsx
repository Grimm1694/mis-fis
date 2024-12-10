"use client";

import React, { useEffect, useState, useRef } from "react";
import { Chart, BarController, CategoryScale, LinearScale, BarElement } from 'chart.js';
import AdmissionYearDropdown from '../../components/admission_year';
import ScrollToTop from '../../components/ui/scroll_to_top';
import Layout from '../../components/ui/Layout';
import { useUser } from "../../context/usercontext";
import { useRouter } from 'next/navigation';




Chart.register(BarController, CategoryScale, LinearScale, BarElement);

// Define the type for each item in the fetched data
interface Intake {
    brcode: string;
    aicte: number;
    aided: number;
    aidedAdmitted: number;
    aidedVacant: number;
    unaided: number;
    unaidedAdmitted: number;
    unaidedVacant: number;
    comedk: number;
    comedkAdmitted: number;
    comedkVacant: number;
    mq: number;
    mqAdmitted: number;
    mqVacant: number;
    snq: number;
    snqAdmitted: number;
    snqVacant: number;
    pmssAdmitted:number;
    jkAdmitted:number;
    nriAdmitted:number;
    goiAdmitted:number;
    admyear: string;
}

const HomePage = () => {
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

    const columns = ['aided', 'unaided', 'comedk', 'mq', 'snq'];  
    const [data, setData] = useState<Intake[]>([]);
    const [admdata, setadmData] = useState<Intake[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>(""); // State to store search input
    const [error, setError] = useState<string | null>(null);
    const [Admyear, setAdmyear] = useState(''); // Initially set to an empty string
    const [admissionYear, setAdmissionYear] = useState("");
    const [mergedData, setMergedData] = useState<Intake[]>([]); // Merged data
    const chartRef = useRef<HTMLCanvasElement | null>(null);

//----------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------  
    const handleYearChange = (selectedYear: string) => {
        setAdmyear(selectedYear);
        setAdmissionYear(selectedYear);
    }
//----------------------------------------------------------------------------------------------------------
useEffect(() => {
    const fetchAdmyear = async () => {
        try {
            const response = await fetch('/api/settings'); // Replace with your actual API endpoint
            if (!response.ok) {
                throw new Error('Failed to fetch admission year');
            }

            const data = await response.json();
            setAdmyear(data.data[0].adm_year); // Assuming the API returns { adm_year: 'YYYY-MM-DD' }
            console.log('msg1',data.data[0].adm_year)
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
//-----------------------------------------------------------------------------------------------------------
    const fetchData = async () => {
    setLoading(true);
    try {
        const res = await fetch(`/api/adm_intake_fetch?admission_year=${admissionYear}`);
        if (!res.ok) {
            throw new Error('Error fetching data');
        }
        const result = await res.json();
        //if (result && Array.isArray(result.data)) {
         if (result.admIntake.length > 0) {
            setData(result.admIntake);
            //setLoading(false);
        } else {
            console.error("Fetched data is not an array or the structure is unexpected:", result);
            setData([]); // Set data to an empty array to prevent errors
        }  
            
    } catch (err) {
        console.error("Error fetching data:", err);
        //setLoading(false);
    }finally {
        setLoading(false);
    }
    };

//------------------------------------------------------------------------------------------------------
const fetchAdmission = async () => {
    setLoading(true);
    try {
        const resAdm = await fetch(`/api/adm_stat_admission?admission_year=${admissionYear}`);
        if (!resAdm.ok) {
            throw new Error('Error fetching data');
        }
        const admresult = await resAdm.json();
        //if (result && Array.isArray(result.data)) {
         if (admresult.admStatistics.length > 0) {
            setadmData(admresult.admStatistics);
            //setLoading(false);
        } else {
            console.error("Fetched data is not an array or the structure is unexpected:", admresult);
            setadmData([]); // Set data to an empty array to prevent errors
        }  
            
    } catch (err) {
        console.error("Error fetching data:", err);
        //setLoading(false);
    }finally {
        setLoading(false);
    }
};

useEffect(() => {
    if (!admissionYear)  return;{
        fetchData();
        fetchAdmission();
    }
}, [admissionYear]);

useEffect(() => {
    if (data.length > 0 && admdata.length > 0) {
        // Merge the admission data (admdata) into the intake data (data) based on 'brcode'
        const mergedData = data.map((item) => {
            const matchingAdm = admdata.find((admItem) => admItem.brcode === item.brcode);
            const aidedAdmitted = matchingAdm ? matchingAdm.aidedAdmitted : 0;
            const unaidedAdmitted = matchingAdm ? matchingAdm.unaidedAdmitted : 0;
            const mqAdmitted = matchingAdm ? matchingAdm.mqAdmitted : 0;
            const snqAdmitted = matchingAdm ? matchingAdm.snqAdmitted : 0;
            const comedkAdmitted = matchingAdm ? matchingAdm.comedkAdmitted : 0;
            const aidedVacant = item.aided - aidedAdmitted;
            const unaidedVacant = item.unaided - unaidedAdmitted;
            const comedkVacant = item.comedk - comedkAdmitted;
            const mqVacant = item.mq - mqAdmitted;
            const snqVacant = item.snq - snqAdmitted;
            
            if (matchingAdm) {
                // Merge the admitted data into the intake data for matching 'brcode'
                return {
                    ...item,  // Original intake data
                    aidedAdmitted: matchingAdm.aidedAdmitted || 0,  // From admdata
                    unaidedAdmitted: matchingAdm.unaidedAdmitted || 0,  // From admdata
                    comedkAdmitted: matchingAdm.comedkAdmitted || 0,  // From admdata
                    mqAdmitted: matchingAdm.mqAdmitted || 0,  // From admdata
                    snqAdmitted: matchingAdm.snqAdmitted || 0,  // From admdata
                    aidedVacant,
                    unaidedVacant,
                    mqVacant,
                    snqVacant,
                    comedkVacant,
                    pmssAdmitted: matchingAdm.pmssAdmitted || 0,  // From admdata
                    jkAdmitted: matchingAdm.jkAdmitted || 0,  // From admdata
                    nriAdmitted: matchingAdm.nriAdmitted || 0,  // From admdata
                    goiAdmitted: matchingAdm.goiAdmitted || 0,  // From admdata
                    
                };
            }
            return item; // If no match, return the original item
        });
        //setData(mergedData);  // Update the state with the merged data
        setMergedData(mergedData);
    }
}, [data, admdata]);
//---------------------------------------------------------------------------------------
  // Filter data based on search query
    const filteredData = mergedData.filter((intake) => {
        return (
        intake.brcode.toLowerCase().includes(searchQuery.toLowerCase()) 
        /* intake.aicte.toLowerCase().includes(searchQuery.toLowerCase()) ||
        intake.aided.toLowerCase().includes(searchQuery.toLowerCase()) ||
        intake.unaided.toLowerCase().includes(searchQuery.toLowerCase()) ||
        intake.comedk.toLowerCase().includes(searchQuery.toLowerCase()) ||
        intake.mq.toLowerCase().includes(searchQuery.toLowerCase()) ||
        intake.snq.toLowerCase().includes(searchQuery.toLowerCase()) */
        );
    });
//-----------------------------------------------------------------------------------------------------
// Step 1: Calculate Grand Totals and Percentages for each branch
const grandTotals = columns.reduce((totals, col) => {
    const totalIntake = mergedData.reduce((sum, stat) => sum + Number(stat[col as keyof Intake] || 0), 0);
    const totalAdmitted = mergedData.reduce((sum, stat) => sum + Number(stat[`${col}Admitted` as keyof Intake] || 0), 0);
    const percentageAdmitted = totalIntake > 0 ? ((totalAdmitted / totalIntake) * 100).toFixed(2) : "0.00";
  
    totals[col] = { totalIntake, totalAdmitted, percentageAdmitted };
    return totals;
  }, {} as Record<string, { totalIntake: number; totalAdmitted: number; percentageAdmitted: string }>);
  
  // Step 2: Calculate Overall Grand Totals
  const totalIntakeAllBranches = Object.values(grandTotals).reduce((sum, { totalIntake }) => sum + totalIntake, 0);
  const totalAdmittedAllBranches = Object.values(grandTotals).reduce((sum, { totalAdmitted }) => sum + totalAdmitted, 0);
  const finalPercentageAdmitted = totalIntakeAllBranches > 0
    ? ((totalAdmittedAllBranches / totalIntakeAllBranches) * 100).toFixed(2)
    : "0.00";
  
  // Grand totals for display
  const overallGrandTotals = {
    totalIntake: totalIntakeAllBranches,
    totalAdmitted: totalAdmittedAllBranches,
    percentageAdmitted: finalPercentageAdmitted,
  };
  

//-----------------------------------------------------------------------------------------------------
return(
    <Layout moduleType="admission"> <ScrollToTop />
     <div className="flex flex-col items-start mt-8">
        <h1 className='ml-4 text-2xl'>Admission Details(Quota wise)</h1>
        <div className="w-full "> {/* Wrapper div to control width */}
            <AdmissionYearDropdown initialYear={Admyear} onYearChange={handleYearChange} />  
        </div> 
        {admissionYear  && !loading && data.length > 0 ? (
        <>
          {/*} Search Bar */}
            <div className="ml-4 mb-4 mt-2">
                <input
                type="text"
                placeholder="Search by Branch"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 p-2 border border-gray-400 rounded mr-4"
                />
            </div>
            <div className=" w-11/12">
                <table className="w-11/12 bg-white border  ml-4 border-gray-700 shadow-md rounded-lg">
                    {/* Table Header */}
                    <thead>
                        <tr>
                            <th rowSpan={2} className="border border-gray-700 bg-blue-100 px-2 py-2 text-center font-bold">Sl.No</th>
                            <th rowSpan={2} className="border border-gray-700 bg-blue-100 px-2 py-2 text-center font-bold">Branch</th>
                            <th rowSpan={2} className="border border-gray-700 bg-blue-100 px-2 py-2 text-center font-bold">AICTE Approved Intake</th>
                            <th colSpan={3} className="border border-gray-700 bg-blue-100 px-2 py-2 text-center font-bold">KEA Aided</th>
                            <th colSpan={3} className="border border-gray-700 bg-blue-100 px-2 py-2 text-center font-bold">KEA Unaided</th>
                            <th colSpan={3} className="border border-gray-700 bg-blue-100 px-2 py-2 text-center font-bold">ComedK</th>
                            <th colSpan={3} className="border border-gray-700 bg-blue-100 px-2 py-2 text-center font-bold">Management Quota (MQ)</th>
                            <th colSpan={3} className="border border-gray-700 bg-blue-100 px-2 py-2 text-center font-bold">SNQ</th>
                            <th rowSpan={2} className="border border-gray-700 bg-blue-100 px-2 py-2 text-center font-bold">PMSS</th>
                            <th rowSpan={2} className="border border-gray-700 bg-blue-100 px-2 py-2 text-center font-bold">JK</th>
                            <th rowSpan={2} className="border border-gray-700 bg-blue-100 px-2 py-2 text-center font-bold">NRI</th>
                            <th rowSpan={2} className="border border-gray-700 bg-blue-100 px-2 py-2 text-center font-bold">GOI</th>
                        </tr>
                        <tr>
                            {Array.from({ length: 5 }).flatMap((_, i) => [
                                <th
                                key={`intake-${i}`}
                                className="border border-gray-700 bg-blue-100 px-2 py-2 text-center font-bold"
                                >
                                Intake
                                </th>,
                                <th
                                key={`admitted-${i}`}
                                className="border border-gray-700 bg-blue-100 px-2 py-2 text-center font-bold"
                                >
                                Admitted
                                </th>,
                                <th
                                key={`vacant-${i}`}
                                className="border border-gray-700 bg-blue-100 px-2 py-2 text-center font-bold"
                                >
                                Vacant
                                </th>,
                            ])}
                        </tr>
                    </thead>
                    
                    {/* Table Body */}
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={item.brcode} className="hover:bg-gray-100" >
                                <td className="border border-gray-700 px-2 py-2 text-center">{index + 1}</td>
                                <td className="border border-gray-700 px-2 py-2 text-center">{item.brcode ?? ''}</td>
                                <td className="border border-gray-700 px-0 py-2 text-center">{item.aicte ?? ''}</td>
                                <td className="border border-gray-700 px-2 py-2 text-center">{item.aided ?? ''}</td>
                                <td className="border border-gray-700 px-2 py-2 text-center">{item.aidedAdmitted ?? ''}</td>
                                <td className="border border-gray-700 px-2 py-2 text-center">{item.aidedVacant ?? ''}</td>
                                <td className="border border-gray-700 px-2 py-2 text-center">{item.unaided ?? ''}</td>
                                <td className="border border-gray-700 px-2 py-2 text-center">{item.unaidedAdmitted ?? ''}</td>
                                <td className="border border-gray-700 px-2 py-2 text-center">{item.unaidedVacant ?? ''}</td>
                                <td className="border border-gray-700 px-2 py-2 text-center">{item.comedk ?? ''}</td>
                                <td className="border border-gray-700 px-2 py-2 text-center">{item.comedkAdmitted ?? ''}</td>
                                <td className="border border-gray-700 px-2 py-2 text-center">{item.comedkVacant?? ''}</td>
                                <td className="border border-gray-700 px-2 py-2 text-center">{item.mq ?? ''}</td>
                                <td className="border border-gray-700 px-2 py-2 text-center">{item.mqAdmitted ?? ''}</td>
                                <td className="border border-gray-700 px-2 py-2 text-center">{item.mqVacant ?? ''}</td>
                                <td className="border border-gray-700 px-2 py-2 text-center">{item.snq ?? ''}</td>
                                <td className="border border-gray-700 px-2 py-2 text-center">{item.snqAdmitted ?? ''}</td>
                                <td className="border border-gray-700 px-2 py-2 text-center">{item.snqVacant ?? ''}</td>
                                <td className="border border-gray-700 px-2 py-2 text-center">{item.pmssAdmitted ?? ''}</td>
                                <td className="border border-gray-700 px-2 py-2 text-center">{item.jkAdmitted ?? ''}</td>
                                <td className="border border-gray-700 px-2 py-2 text-center">{item.nriAdmitted ?? ''}</td>
                                <td className="border border-gray-700 px-2 py-2 text-center">{item.goiAdmitted }</td>
                            </tr>
                        ))}

                        {/* Totals Row */}
                        <tr className="font-semibold bg-gray-200">
                            <td className="border border-gray-700 px-2 py-2"></td>
                            <td className="border border-gray-700 px-2 py-2 text-center">Total</td>
                            <td className="border border-gray-700 px-2 py-2 text-center">
                                {mergedData.reduce((sum, stat) => sum + stat.aicte, 0)}
                            </td>
                            {columns.flatMap((col, index) => [
                                <td
                                key={`${col}-intake-${index}`}
                                className="border border-gray-700 px-2 py-2 text-center"
                                >
                                {mergedData.reduce((sum, stat) => {
                                    const key = `${col}` as keyof Intake; // Construct the key
                                    const value = stat[key];
                                    return sum + (typeof value === 'number' ? value : 0);
                                }, 0)}
                                </td>,
                                <td
                                key={`${col}-admitted-${index}`}
                                className="border border-gray-700 px-2 py-2 text-center"
                                >
                                {mergedData.reduce((sum, stat) => {
                                    const value = stat[`${col}Admitted` as keyof Intake];
                                    return sum + (typeof value === 'number' ? value : 0);
                                }, 0)}
                                </td>,
                                <td
                                key={`${col}-vacant-${index}`}
                                className="border border-gray-700 px-2 py-2 text-center"
                                >
                                {mergedData.reduce((sum, stat) => {
                                    const value = stat[`${col}Vacant` as keyof Intake];
                                    return sum + (typeof value === 'number' ? value : 0);
                                }, 0)}
                                </td>,
                            ])}
                            <td className="border border-gray-700 px-2 py-2 text-center">
                                {mergedData.reduce((sum, stat) => sum + stat.pmssAdmitted, 0)}
                            </td>
                            <td className="border border-gray-700 px-2 py-2 text-center">
                                {mergedData.reduce((sum, stat) => sum + stat.jkAdmitted, 0)}
                            </td>
                            <td className="border border-gray-700 px-2 py-2 text-center">
                                {mergedData.reduce((sum, stat) => sum + stat.nriAdmitted, 0)}
                            </td>
                            <td className="border border-gray-700 px-2 py-2 text-center">
                                {mergedData.reduce((sum, stat) => sum + stat.goiAdmitted, 0)}
                            </td>
                        </tr>
                    </tbody>
                </table>
                {/* Grand Totals Table */}
                <div className="mt-6">
                    <h2 className="text-xl ml-4 font-semibold mb-4">Grand Totals & Percentage</h2>
                    <table className="w-11/12 ml-4 bg-white border border-gray-700 shadow-md rounded-lg">
                        <thead>
                            <tr>
                                <th className="border border-gray-700 bg-blue-100 px-2 py-2 text-center font-bold">Category</th>
                                <th className="border border-gray-700 bg-blue-100 px-2 py-2 text-center font-bold">Total Intake</th>
                                <th className="border border-gray-700 bg-blue-100 px-2 py-2 text-center font-bold">Total Admitted</th>
                                <th className="border border-gray-700 bg-blue-100 px-2 py-2 text-center font-bold">% Admitted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {columns.map((col) => (
                                <tr key={col}>
                                    <td className="border border-gray-700 px-2 py-2 text-center">{col.toUpperCase()}</td>
                                    <td className="border border-gray-700 px-2 py-2 text-center">
                                        {grandTotals[col].totalIntake}
                                    </td>
                                    <td className="border border-gray-700 px-2 py-2 text-center">
                                        {grandTotals[col].totalAdmitted}
                                    </td>
                                    <td className="border border-gray-700 px-2 py-2 text-center">
                                        {grandTotals[col].percentageAdmitted}%
                                    </td>
                                </tr>
                            ))}
                            {/* Grand Totals Row */}
                            <tr>
                                <td className="border border-gray-700 px-2 py-2 text-center font-bold bg-gray-200">Grand Total</td>
                                <td className="border border-gray-700 px-2 py-2 text-center font-bold bg-gray-200">
                                    {overallGrandTotals.totalIntake}
                                </td>
                                <td className="border border-gray-700 px-2 py-2 text-center font-bold bg-gray-200">
                                    {overallGrandTotals.totalAdmitted}
                                </td>
                                <td className="border border-gray-700 px-2 py-2 text-center font-bold bg-gray-200">
                                    {overallGrandTotals.percentageAdmitted}%
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </>
        ) : (
          admissionYear && !loading && data.length === 0 &&(
              <div className="ml-4 mt-4 text-xl">No data available for the academic year.</div>
          )
        )}
    </div>
    </Layout>
  );
};
export default HomePage;
