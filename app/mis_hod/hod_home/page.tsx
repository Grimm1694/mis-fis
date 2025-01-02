"use client"

import React from "react";
import Layout from '../../../app/components/ui/Layout';
import { get } from "lodash";

const Home = () => {
  const branch = sessionStorage.getItem("departmentName");
  console.log("departmentName", branch);
  return (
    <Layout moduleType="hod">
        <div className="flex flex-1 items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">HoD Home</h1>
        </div>
    </Layout>

  );
};

export default Home;