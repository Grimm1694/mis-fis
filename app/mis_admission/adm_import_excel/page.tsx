"use client"

import ScrollToTop from '../../components/ui/scroll_to_top';
import Layout from '../../components/ui/Layout';
import UploadExcel from '../../components/import_adm_excel_form'; // Adjust the path as necessary
import { useEffect, useState } from 'react';
import { useUser } from "../../context/usercontext";
import { useRouter } from 'next/navigation';

const ImportExcel: React.FC = () => {
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
  return (
  <Layout moduleType="admission"> <ScrollToTop />  
    <div>
      <UploadExcel />
    </div>
 </Layout>
  );
  
};

export default ImportExcel;
