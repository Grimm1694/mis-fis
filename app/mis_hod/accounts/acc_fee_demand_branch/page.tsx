"use client";
import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Layout from "../../../components/ui/Layout";
import ScrollToTop from "../../../components/ui/scroll_to_top";
import { useUser } from "../../../context/usercontext";
import PopupModal from "../../../components/accounts/branch_wise_fee_status"; // Import the modal component

ChartJS.register(ArcElement, Tooltip, Legend);

interface Accounts {
    usno: string;
    s_name: string;
    brcode: string;
    semester: string;
    total_fee: number;
    paid_status: string;
}


const FeeDemandBranch = () => {
    const { user } = useUser();

    const [accounts, setAccounts] = useState<Accounts[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [academicYear, setAcademicYear] = useState<string>("");
    const [academicYearInput, setAcademicYearInput] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [dataFetched, setDataFetched] = useState(false);
    const [department, setDepartment] = useState<string | null>(() => {
      // Retrieve usno from sessionStorage if available
      return sessionStorage.getItem("department");
    });  
//------------------------------------------------------------------------------------
    const calculateStatistics = () => {
      const semesters = [...new Set(accounts.map((account) => account.semester))];
      const semesterStats = semesters.map((semester) => {
        const semesterAccounts = accounts.filter(
          (account) => account.semester.toLowerCase() === semester.toLowerCase()
        );
        const totalStudents = semesterAccounts.length;
        const paidCount = semesterAccounts.filter(
          (account) => account.paid_status.toLowerCase() === "paid"
        ).length;
        const unpaidCount = totalStudents - paidCount;
        const paidPercentage = ((paidCount / totalStudents) * 100).toFixed(2);
  
        return {
          semester,
          totalStudents,
          paidCount,
          unpaidCount,
          paidPercentage: isNaN(Number(paidPercentage)) ? "0.00" : paidPercentage,
        };
      });
  
      const grandTotalStudents = accounts.length;
      const grandTotalPaid = accounts.filter(
        (account) => account.paid_status.toLowerCase() === "paid"
      ).length;
      const grandTotalUnpaid = grandTotalStudents - grandTotalPaid;
      const grandPaidPercentage = ((grandTotalPaid / grandTotalStudents) * 100).toFixed(2);
  
      return {
        semesterStats,
        grandTotals: {
          totalStudents: grandTotalStudents,
          paidCount: grandTotalPaid,
          unpaidCount: grandTotalUnpaid,
          paidPercentage: isNaN(Number(grandPaidPercentage)) ? "0.00" : grandPaidPercentage,
        },
      };
    };
  
    const { semesterStats, grandTotals } = calculateStatistics();
//---------------------------------------------------------------------------------------------------------
   
   
    const [grandTotal, setGrandTotal] = useState({
      demand: 0,
      paid: 0,
      unpaid: 0,
      paidPercentage: 0,
    });

    useEffect(() => {
      if (user) {
        setDepartment(user.department);
        sessionStorage.setItem("department", user.department); // Save usno to sessionStorage
      }
    }, [user]);


    const fetchAccounts = async (academicYear: string) => {
      setLoading(true);
      setError(null);
      setDataFetched(false);
      try {
        const response = await fetch(`/api/accounts/acc_fee_demand_fetch_branch?academic_year=${academicYear}&department=${department}`);
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
                        
                        
                         {/* Semester-wise Statistics */}
                        <table className="w-full table-auto border-collapse border border-gray-300 mt-4">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="border border-gray-300 px-4 py-2">Semester</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Total Students</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Paid</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Not Paid</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Paid %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {semesterStats.map((stat) => (
                            <tr key={stat.semester}>
                              <td className="border border-gray-300 px-4 py-2">{stat.semester}</td>
                              <td className="border border-gray-300 px-4 py-2 text-right">
                                {stat.totalStudents}
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-right">{stat.paidCount}</td>
                              <td className="border border-gray-300 px-4 py-2 text-right">
                                {stat.unpaidCount}
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-right">
                                {stat.paidPercentage}%
                              </td>
                            </tr>
                          ))}
                          <tr className="font-bold">
                            <td className="border border-gray-300 px-4 py-2">Grand Total</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">
                              {grandTotals.totalStudents}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-right">
                              {grandTotals.paidCount}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-right">
                              {grandTotals.unpaidCount}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-right">
                              {grandTotals.paidPercentage}%
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

export default FeeDemandBranch;
