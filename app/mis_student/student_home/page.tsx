"use client";

import React, { useState, useEffect } from "react";
import Layout from "../../../app/components/ui/Layout";
import { useUser } from "../../context/usercontext";
import { useRouter } from 'next/navigation';

interface StudentTicket {
  id: number;
  title: string;
  description: string;
  status: string;
  date: string;
  dateLabel: string; // Custom label for the date field
  link: string; // Optional link for more details
}

const StudentDashboard: React.FC = () => {
    const { user } = useUser();
    const router = useRouter();

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [AdmYear, setAdmYear] = useState("");
    const [AcademicYear, setAcademicYear] = useState("");
    const [ResultYear, setResultYear] = useState("");
    const [feeAmount, setFeeAmount] = useState<number | null>(null);
    const [usno, setUSNO] = useState<string | null>(() => {
        // Retrieve usno from sessionStorage if available
        return sessionStorage.getItem("usno");
      });
    const [department, setDepartment] = useState<string | null>(() => {
        // Retrieve usno from sessionStorage if available
        return sessionStorage.getItem("department");
      });  
    const [admissionFeeStatus, setAdmissionFeeStatus] = useState<{
        status: string;
        link: string;
    }>({
        status: "Fetching...",
        link: "#",
    });   
    
  // Fetch data for Academic Year and Result Year
  useEffect(() => {
    if (user && user.usno) {
      setUSNO(user.usno);
      sessionStorage.setItem("usno", user.usno); // Save usno to sessionStorage
      setDepartment(user.department);
      sessionStorage.setItem("department", user.department); // Save usno to sessionStorage
    }
  }, [user]);

  // Fetch data for Academic Year and Result Year
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (!response.ok) {
          throw new Error("Failed to fetch settings table data");
        }
        const data = await response.json();
        setAdmYear(data.data[0].adm_year);
        setAcademicYear(data.data[0].academic_year);
        setResultYear(data.data[0].result_year); // Assuming your API provides result_year
      } catch (error) {
        const errorMessage = (error as Error).message;
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Fetch tuition fee status
  useEffect(() => {
    const fetchFeeStatus = async () => {
      try {
        const response = await fetch(
          `/api/student_tution_fee_paid_status?usno=${usno}&academic_year=${AcademicYear}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch fee status");
        }
        const data = await response.json();
        console.log("Fee Status Data:", data); // Add this line to debug
        setFeeAmount(data.total_fee);
        setAdmissionFeeStatus({
          status: data.status === "Paid" ? "Paid" : "Not Paid",
          link:
            data.status === "Paid"
              ? "/dashboard/fee-details"
              : "https://pgthesis.drait.in/onlinepay/adm_index.php",
        });
      } catch (error) {
        setAdmissionFeeStatus({
          status: "Error",
          link: "#",
        });
      }
    };

    if (usno) {
      fetchFeeStatus();
    }
  }, [usno, AcademicYear]);

    const handleViewDetails = async () => {
        if (feeAmount === null) {
            alert("Fee details are not available.");
        } else {
            alert(
                `You have paid tuition fee of Rs. ${feeAmount} for the Academic Year ${AcademicYear}.`
            );
        }
    };
  

    return (
        <Layout moduleType="student">
            <div className="min-h-screen min-w-screen  p-4">
                <h1 className="text-2xl font-bold mb-2">Student Dashboard</h1>
                <h2 className="text-1xl font-bold mb-4"><span className="font-semibold">USNO:</span> {usno}</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {/* Tuition Fee Ticket */}
                    <div className=" bg-gray-100 shadow-lg rounded-lg p-4 border border-gray-300 hover:shadow-xl transition-shadow">
                        <h2 className="text-xl font-semibold mb-2">Tuition Fee</h2>
                        <p className="text-gray-600 text-sm mb-2">
                            Status of Tuition Fee Paid
                        </p>
                        <div className="text-sm">
                        <p>
                            <span className="font-semibold">Status:</span>{" "}
                            <span
                            className={` font-bold ${
                                admissionFeeStatus.status === "Paid"
                                ? "text-green-700"
                                : admissionFeeStatus.status === "Not Paid"
                                ? "text-red-500"
                                : "text-yellow-500"
                            }`}
                            >
                            {admissionFeeStatus.status}
                            </span>
                        </p>
                        <p>
                            <span className="font-semibold">Academic Year:</span>{" "}
                            {AcademicYear}
                        </p>
                        <p>
                            <span className="font-semibold">USNO:</span> {usno}
                        </p>
                        </div>
                        {admissionFeeStatus.status === "Not Paid" ? (
                        <a
                            href={admissionFeeStatus.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-block text-blue-500 hover:underline text-sm"
                        >
                            Pay Now
                        </a>
                        ) : (
                        <button
                            onClick={handleViewDetails}
                            className="mt-4 inline-block text-blue-500 hover:underline text-sm"
                        >
                            View Details
                        </button>
                        )}
                    </div>

                    {/* Semester Attendance, CIE, SEE */}
                    <div
                        className="bg-gray-100 shadow-lg rounded-lg p-4 border border-gray-300 hover:shadow-xl transition-shadow"
                    >
                        <h2 className="text-xl font-semibold mb-2">
                        Semester Attendance, CIE, SEE
                        </h2>
                        <p className="text-gray-600 text-sm mb-4">
                        Attendence and CIE marks Detial
                        </p>
                        <div className="text-sm">
                        <p>
                            <span className="font-semibold">Status:</span>{" "}
                            <span className="text-orange-500">Pending</span>
                        </p>
                        <p>
                            <span className="font-semibold">Result Year:</span> {ResultYear}
                        </p>
                        </div>
                        <a
                        href="/dashboard/assignments"
                        className="mt-4 inline-block text-blue-500 hover:underline text-sm"
                        >
                        View Detail
                        </a>
                    </div>

                    {/* Feedback Ticket */}
                    <div
                        className="bg-gray-100 shadow-lg rounded-lg p-4 border border-gray-300 hover:shadow-xl transition-shadow"
                    >
                        <h2 className="text-xl font-semibold mb-2">Feedback</h2>
                        <p className="text-gray-600 text-sm mb-4">Submit your feedback.</p>
                        <div className="text-sm">
                        <p>
                            <span className="font-semibold">Status:</span>{" "}
                            <span className="text-orange-500">Pending</span>
                        </p>
                        <p>
                            <span className="font-semibold">Feedback Date:</span> 2025-01-20
                        </p>
                        </div>
                        <a
                        href="/dashboard/feedback"
                        className="mt-4 inline-block text-blue-500 hover:underline text-sm"
                        >
                        Submit Feedback
                        </a>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default StudentDashboard;
