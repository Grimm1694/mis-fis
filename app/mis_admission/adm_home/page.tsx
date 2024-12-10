"use client";

import React, { useState, useEffect } from 'react';
import Layout from '../../../app/components/ui/Layout';
import { useUser } from "../../context/usercontext";
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  // Redirect if not logged in; only run this on the client
  useEffect(() => {
    if (typeof window !== 'undefined' && !user) {
      router.push('/'); // Redirect to login
    }
  }, [user, router]);

  const [studentCounts, setStudentCounts] = useState({
    total_students: 0,
    sc_students: 0,
    st_students: 0,
    mgmt_students: 0,
    phyChlg_students: 0,
    boys_students: 0,
    girls_students: 0,
  });

  // Fetch student data only when the user is logged in
  useEffect(() => {
    if (user) {
      fetch('/api/adm_stat_dashboard')
        .then((response) => response.json())
        .then((data) => {
          if (data && data.length > 0) {
            const studentData = data[0];
            setStudentCounts({
              total_students: studentData.total_students,
              sc_students: studentData.SC,
              st_students: studentData.ST,
              mgmt_students: studentData.Mgmt,
              phyChlg_students: studentData.phyChlg,
              boys_students: studentData.boy_students,
              girls_students: studentData.girl_students,
            });
          }
        })
        .catch((error) => console.error('Error fetching student data:', error));
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
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total Students in Campus</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">{studentCounts.total_students}</p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total First Year Admissions</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">{studentCounts.total_students}</p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total Lateral Entry Students</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700"></p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total Working Professional Students</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700"></p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total PG Students</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700"></p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total Physically Challenged Students</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">{studentCounts.phyChlg_students}</p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-xl font-bold">Total Management Quota Students</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">{studentCounts.mgmt_students}</p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total SC Students</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">{studentCounts.sc_students}</p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total ST Students</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">{studentCounts.st_students}</p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total Boys</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">{studentCounts.boys_students}</p>
          </div>
          <div className="bg-blue-100 p-6 shadow-2xl rounded-lg flex flex-col items-center">
            <h2 className="text-lg font-bold">Total Girls</h2>
            <p className="mt-4 flex items-center justify-center bg-transparent border-blue-700 border-4 rounded-full w-20 h-20 text-2xl font-bold text-pink-700">{studentCounts.girls_students}</p>
          </div>
        </div>
      </div>
    </Layout> 
  );
} 

