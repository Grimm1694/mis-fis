"use client";

import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Layout from "../../components/ui/Layout";
import ScrollToTop from "../../components/ui/scroll_to_top";
import { useUser } from "../../context/usercontext";
import PopupModal from "../../components/accounts/branch_wise_fee_status"; // Import the modal component

ChartJS.register(ArcElement, Tooltip, Legend);

interface Accounts {
    usno: string;
    s_name: string;
    brcode: string;
    semester: string;
    total_fee: number;
    paid_status: string;
}
interface ReportData {
  branch: string;
  semester: string;
  demandCount: number;
  paidCount: number;
  unpaidCount: number;
  paidPercentage: number;
}

const FeeDemand = () => {
    const { user } = useUser();

    const [accounts, setAccounts] = useState<Accounts[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [academicYear, setAcademicYear] = useState<string>("");
    const [academicYearInput, setAcademicYearInput] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [dataFetched, setDataFetched] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [reportData, setReportData] = useState<ReportData[]>([]);
    const [grandTotal, setGrandTotal] = useState({
      demand: 0,
      paid: 0,
      unpaid: 0,
      paidPercentage: 0,
    });

    const [studentCountReport, setStudentCountReport] = useState<ReportData[]>([]);
    const [grandStudentCount, setGrandStudentCount] = useState({
      demand: 0,
      paid: 0,
      unpaid: 0,
      paidPercentage: 0,
    });

//-----------------------------------------------------------------------------------------------------
    const generateStudentCountReport = () => {
      const reportMap = new Map<string, ReportData>();
      let totalDemandCount = 0;
      let totalPaidCount = 0;
      let totalUnpaidCount = 0;
    
      filteredData.forEach((account) => {
        const key = account.brcode;
        const isPaid = account.paid_status.toLowerCase() === "paid";
    
        if (!reportMap.has(key)) {
          reportMap.set(key, {
            branch: account.brcode,
            semester: "All Semesters", // You can customize this if needed
            demandCount: 0,
            paidCount: 0,
            unpaidCount: 0,
            paidPercentage: 0,
          });
        }
    
        const reportItem = reportMap.get(key)!;
        reportItem.demandCount += 1; // Increment the count of students
        if (isPaid) {
          reportItem.paidCount += 1;
        } else {
          reportItem.unpaidCount += 1;
        }
      });
    
      const reportArray = Array.from(reportMap.values());
      reportArray.forEach((item) => {
        item.paidPercentage =
          item.demandCount > 0 ? (item.paidCount / item.demandCount) * 100 : 0;
        totalDemandCount += item.demandCount;
        totalPaidCount += item.paidCount;
        totalUnpaidCount += item.unpaidCount;
      });
    
      setStudentCountReport(reportArray); // Set the report to a new state
      setGrandStudentCount({
        demand: totalDemandCount,
        paid: totalPaidCount,
        unpaid: totalUnpaidCount,
        paidPercentage: totalDemandCount > 0 ? (totalPaidCount / totalDemandCount) * 100 : 0,
      });
    };  

  //------------------------------------------------------------------------------------------------  

    const generateReport = () => {
      const reportMap = new Map<string, ReportData>();
      let totalDemand = 0;
      let totalPaid = 0;
      let totalUnpaid = 0;
  
      filteredData.forEach((account) => {
        const key = `${account.brcode}_${account.semester}`;
        const demandCount = account.total_fee;
        const isPaid = account.paid_status.toLowerCase() === "paid";
  
        if (!reportMap.has(key)) {
          reportMap.set(key, {
            branch: account.brcode,
            semester: account.semester,
            demandCount: 0,
            paidCount: 0,
            unpaidCount: 0,
            paidPercentage: 0,
          });
        }
  
        const reportItem = reportMap.get(key)!;
        reportItem.demandCount += demandCount;
        if (isPaid) {
          reportItem.paidCount += demandCount;
        } else {
          reportItem.unpaidCount += demandCount;
        }
      });
  
      const reportArray = Array.from(reportMap.values());
      reportArray.forEach((item) => {
        item.paidPercentage =
          item.demandCount > 0 ? (item.paidCount / item.demandCount) * 100 : 0;
        totalDemand += item.demandCount;
        totalPaid += item.paidCount;
        totalUnpaid += item.unpaidCount;
      });
  
      setReportData(reportArray);
      setGrandTotal({
        demand: totalDemand,
        paid: totalPaid,
        unpaid: totalUnpaid,
        paidPercentage: totalDemand > 0 ? (totalPaid / totalDemand) * 100 : 0,
      });
    };
  
    const handleShowReport = () => {
      generateReport();
      generateStudentCountReport();
      setShowModal(true);
    };
//--------------------------------------------------------------------------------------------------------------
    const fetchAccounts = async (academicYear: string) => {
      setLoading(true);
      setError(null);
      setDataFetched(false);
      try {
        const response = await fetch(`/api/accounts/acc_fee_demand_fetch?academic_year=${academicYear}`);
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        const data = await response.json();
        setAccounts(data.feeDemand);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
        setDataFetched(true);
      }
    };

    const handleGetData = () => {
      if (!academicYearInput.trim()) {
        setError("Please enter a valid academic year.");
        return;
      }
      setAcademicYear(academicYearInput.trim());
      fetchAccounts(academicYearInput.trim());
    };

    const handleYearInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAcademicYearInput(event.target.value);
      setError(null);
      setAccounts([]);
      setDataFetched(false);
    };

    const handleBackButton = () => {
      setSearchQuery("");
    };

    const filteredData = searchQuery.trim() === "" ? accounts : accounts.filter((account) => {
        const searchTerms = searchQuery.toLowerCase().split(" ");
        const matchesBranch = searchTerms.some((term) => account.brcode.toLowerCase() === term );
        const matchesPaidStatus = searchTerms.some((term) => {
          if (term === "paid" && account.paid_status.toLowerCase() === "paid") {
            return true;
          } else if (term === "notpaid" && account.paid_status.toLowerCase() === "not paid") {
            return true;
          }
          return false;
        });
        const matchesSemester = searchTerms.some(
          (term) => account.semester.toLowerCase() === term
        );
        const matchesUsnoOrName = searchTerms.some(
          (term) =>
            account.usno.toLowerCase().includes(term) ||
            account.s_name.toLowerCase().includes(term)
        );
        return matchesBranch && matchesSemester && matchesPaidStatus && matchesUsnoOrName;
    });

    

    // Calculate data for pie chart
    const paidCount = filteredData.filter((account) => account.paid_status.toLowerCase() === "paid")
      .length;
    const unpaidCount = filteredData.length - paidCount;

    const formatToIndianCurrency = (amount: number): string => {
      return amount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      });
    };

    const pieChartData = {
      labels: ["Paid", "Unpaid"],
      datasets: [
        {
          label: "Fee Status",
          data: [paidCount, unpaidCount],
          backgroundColor: ["#A7F3D0", "#FECACA"],
          borderWidth: 1,
        },
      ],
    };

    return (
      <Layout moduleType="accounts">
          <ScrollToTop />
              {/* Report Modal */}
              <PopupModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                reportData={reportData}
                grandTotal={grandTotal}  
                studentCountReport={studentCountReport} // Add new prop for branch-wise report  
                grandStudentCount={grandStudentCount}
                academicYear="2023-2024" // Example academic year
              />

              
              <div className="ml-2 mt-6">
                  <h1 className="ml-4 text-2xl">Student Fee Demand</h1>
                  <div className="flex items-start  mb-4 ml-4">
                      {/* Left Section */}
                      <div className="w-auto pr-4">
                        {/* Academic Year and Get Data Button */}
                        <div className="flex items-center mb-4">
                          <input
                            type="text"
                            placeholder="Academic Year ex: 2024-25"
                            value={academicYearInput}
                            onChange={handleYearInputChange}
                            className="w-60 p-2 border border-gray-400 rounded"
                          />
                          <button
                            onClick={handleGetData}
                            className="ml-2 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                          >
                            Get Data
                          </button>
                          {accounts.length > 0 &&(
                            <button
                            onClick={handleShowReport}
                            className="ml-2 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                          >
                            Report
                          </button>
                          
                        )}
                        </div>

                        {/* Search Box */}
                        {accounts.length > 0 && (
                        <div className="flex items-center">
                            <div>
                                <label
                                  htmlFor="search"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Search
                                </label>
                                <input
                                  type="text"
                                  id="search"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className="w-96 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                                  placeholder="Search by branch, year, paid status"
                                />
                            </div>
                            {searchQuery && (
                            <div>
                              <button
                                onClick={() => setSearchQuery("")}
                                className="ml-2 bg-red-500 text-white px-4 py-2 mt-6 rounded-md hover:bg-red-600"
                              >
                                Clear
                              </button>
                            </div> 
                          )}
                        </div>  
                        )}
                        {accounts.length > 0 &&(
                          <div>
                            <p className="mt-2 text-sm text-gray-600">
                                Note: Type search string as: <b>cs ii paid</b> for filtering 2nd year CS branch
                                  students with <b>PAID</b> status.
                            </p>
                            <p className="mt-2 text-sm text-gray-600">
                              <b>cs ii notpaid</b> for filtering 2nd year CS branch students with <b>NOT PAID</b> status.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right Section (Statistics) */}
                      {accounts.length > 0 && (
                        <div className="w-auto bg-gray-100 p-4 rounded-md shadow">
                          <table className="w-full table-auto border-collapse border border-gray-300">
                            <thead className="bg-gray-200">
                              <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                                <th className="border border-gray-300 px-4 py-2 text-right">Amount (INR)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-gray-300 px-4 py-2">Total Demand</td>
                                <td className="border border-gray-300 px-4 py-2 text-right">
                                  {formatToIndianCurrency(
                                    accounts.reduce((sum, account) => sum + account.total_fee, 0)
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 px-4 py-2">Total Paid</td>
                                <td className="border border-gray-300 px-4 py-2 text-right">
                                  {formatToIndianCurrency(
                                    accounts
                                      .filter((account) => account.paid_status.toLowerCase() === "paid")
                                      .reduce((sum, account) => sum + account.total_fee, 0)
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 px-4 py-2">Total to be Paid</td>
                                <td className="border border-gray-300 px-4 py-2 text-right">
                                  {formatToIndianCurrency(
                                    accounts
                                      .filter((account) => account.paid_status.toLowerCase() === "not paid")
                                      .reduce((sum, account) => sum + account.total_fee, 0)
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}

                    </div>
                      {/* Table and Pie Chart */}
                      {loading ? (
                        <p className="ml-4">Loading...</p>
                      ) : error ? (
                        <p className="text-red-600">Error: {error}</p>
                      ) : (
                        <div className="flex">
                          {/* Table */}
                          <div className="w-3/4">
                            {accounts.length > 0 ? (
                              <table className="min-w-max ml-4 table-auto bg-white border border-gray-300">
                                <thead className="bg-gray-200">
                                  <tr>
                                    <th className="px-4 py-2 border">Sl.No</th>
                                    <th className="px-4 py-2 border">USN</th>
                                    <th className="px-4 py-2 border">Name</th>
                                    <th className="px-4 py-2 border">Branch</th>
                                    <th className="px-4 py-2 border">Year</th>
                                    <th className="px-4 py-2 border text-right">Total Fee</th>
                                    <th className="px-4 py-2 border">Paid Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filteredData.map((account, index) => (
                                    <tr
                                      key={account.usno}
                                      className={`hover:bg-gray-100 cursor-pointer ${
                                        account.paid_status.toLowerCase() === "paid"
                                          ? "bg-green-100"
                                          : "bg-red-100"
                                      }`}
                                    >
                                      <td className="border px-4 py-2">{index + 1}</td>
                                      <td className="border px-4 py-2">{account.usno}</td>
                                      <td className="border px-4 py-2">{account.s_name}</td>
                                      <td className="border px-4 py-2">{account.brcode}</td>
                                      <td className="border px-4 py-2">{account.semester}</td>
                                      <td className="border px-4 py-2 text-right">
                                        {account.total_fee.toFixed(2)}
                                      </td>
                                      <td className="border px-4 py-2">{account.paid_status}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                                dataFetched && accounts.length === 0 && (
                              <p className="text-red-600">No fee demand available for the academic year.</p>
                              )
                            )}
                          </div>
                          {/* Pie Chart */}
                          {accounts.length > 0 && (
                            <div className="w-1/4 pl-4">
                              <Pie data={pieChartData} />
                            </div>
                          )}
                        </div>
                      )}
        </div>
      
      </Layout>
    );
};

export default FeeDemand;
