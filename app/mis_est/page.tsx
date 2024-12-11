"use client";

import React, { useState, useEffect } from "react";
import Layout from "../../app/components/ui/Layout";
import { useUser } from "../context/usercontext";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { user } = useUser();

  //Redirect if not logged in; only run this on the client
  // useEffect(() => {
  //   if (typeof window !== "undefined" && !user) {
  //     router.push("/"); // Redirect to login
  //   }
  // }, [user, router]);

  const [studentCounts, setStudentCounts] = useState({
    total_employee: 0,
    cs_faculty: 0,
    ae_faculty: 0,
    cv_faculty: 0,
    ec_faculty: 0,
    ch_faculty: 0,
    cb_faculty: 0,
    ee_faculty: 0,
    hs_faculty: 0,
    im_faculty: 0,
    it_faculty: 0,
    ma_faculty: 0,
    mba_faculty: 0,
    mca_faculty: 0,
    me_faculty: 0,
    ml_faculty: 0,
    ph_faculty: 0,
    te_faculty: 0,
    boys_emp: 0,
    girls_emp: 0,
  });

  // Fetch student data only when the user is logged in
  useEffect(() => {
    if (user) {
      fetch("/api/adminDashboard")
        .then((response) => response.json())
        .then((data) => {
          if (data && data.length > 0) {
            const studentData = data[0];
            setStudentCounts({
              total_employee: studentData.total_employee,
              cs_faculty: studentData.CS,
              ae_faculty: studentData.AE,
              cv_faculty: studentData.CV,
              ec_faculty: studentData.EC,
              ch_faculty: studentData.CH,
              cb_faculty: studentData.CB,
              ee_faculty: studentData.EE,
              hs_faculty: studentData.HS,
              im_faculty: studentData.IM,
              it_faculty: studentData.IT,
              ma_faculty: studentData.MA,
              mba_faculty: studentData.MBA,
              mca_faculty: studentData.MCA,
              me_faculty: studentData.ME,
              ml_faculty: studentData.ML,
              ph_faculty: studentData.PH,
              te_faculty: studentData.TE,
              boys_emp: studentData.boy_emp,
              girls_emp: studentData.girl_emp,
            });
          }
        })
        .catch((error) => console.error("Error fetching student data:", error));
    }
  }, [user]);

  return (
    <Layout moduleType="admission">
      {/* {user && (
          <p>
              Welcome, {user.name}! Your role is: {user.role}.
          </p>
      )} */}
      <div className="h-screen pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4  gap-6 ml-5 mr-5">
          <div
            className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center"
            onClick={() => router.push("/mis_est/facultyList")}
          >
            <h2 className="text-lg font-bold">Total Faculty in Campus</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">
              {studentCounts.total_employee}
            </p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total Male faculty</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">
              {studentCounts.boys_emp}
            </p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total Female faculty</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">
              {studentCounts.girls_emp}
            </p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total CS faculty</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">
              {studentCounts.cs_faculty}
            </p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total AE faculty</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">
              {studentCounts.ae_faculty}
            </p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total CV faculty</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">
              {studentCounts.cv_faculty}
            </p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total EC faculty</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">
              {studentCounts.ec_faculty}
            </p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total CH faculty</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">
              {studentCounts.ch_faculty}
            </p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total CB faculty</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">
              {studentCounts.cb_faculty}
            </p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total EE faculty</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">
              {studentCounts.ee_faculty}
            </p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total HS faculty</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">
              {studentCounts.hs_faculty}
            </p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total IM faculty</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">
              {studentCounts.im_faculty}
            </p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total IT faculty</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">
              {studentCounts.it_faculty}
            </p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total MA faculty</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">
              {studentCounts.ma_faculty}
            </p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total MBA faculty</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">
              {studentCounts.mba_faculty}
            </p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total MCA faculty</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">
              {studentCounts.mca_faculty}
            </p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total ME faculty</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">
              {studentCounts.me_faculty}
            </p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total ML faculty</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">
              {studentCounts.ml_faculty}
            </p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total PH faculty</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">
              {studentCounts.ph_faculty}
            </p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total TE faculty</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">
              {studentCounts.te_faculty}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
