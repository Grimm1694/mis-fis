"use client"

import React, { useState, useEffect } from 'react';
import Layout from '../../../app/components/ui/Layout';
import { useUser } from "../../context/usercontext";
import { useRouter } from 'next/navigation';

const Home = () => {
  return (
    <Layout moduleType="accounts">
      <div className="flex flex-1 items-center justify-center min-h-screen min-w-screen bg-gray-100">
        <h1 className="text-2xl font-bold items-center justify-center text-gray-800"> Accounts Section </h1>
      </div>
    </Layout>
  );
};

export default Home;