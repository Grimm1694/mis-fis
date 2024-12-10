"use client";

import React, { useEffect, useState, useRef } from "react";
import AdmissionYearDropdown from '../../components/admission_year';
import ScrollToTop from '../../components/ui/scroll_to_top';
import Layout from '../../components/ui/Layout';
import { useUser } from "../../context/usercontext";
import { useRouter } from 'next/navigation';

// Define the type for each item in the fetched data
interface Intake {
  brcode: string;
  aicte: number;
  aided: number;
  unaided: number;
  comedk: number;
  mq: number;
  snq: number;
  admyear:string;
}

const HomePage = () => {

  const [data, setData] = useState<Intake[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null); // To highlight rows
  const [searchQuery, setSearchQuery] = useState<string>(""); // State to store search input
  const dialogRef = useRef<HTMLDialogElement>(null); // Ref for the dialog
  const [error, setError] = useState<string | null>(null);
  const [Admyear, setAdmyear] = useState(''); // Initially set to an empty string
  const [admissionYear, setAdmissionYear] = useState("");
  // States for form fields
  const [brcode, setBrcode] = useState("");
  const [aicte, setAicte] = useState<number | "">("");
  const [aided, setAided] = useState<number | "">("");
  const [unaided, setUnaided] = useState<number | "">("");
  const [comedk, setComedk] = useState<number | "">("");
  const [mq, setMq] = useState<number | "">("");
  const [snq, setSnq] = useState<number | "">("");
  const [admyear, setAdmYear] = useState("");
  const [isEditMode, setIsEditMode] = useState(false); // Track if we are editing an existing row
  const alertShownRef = useRef(false);
  const previousPage = typeof window !== "undefined" ? window.location.pathname : '/';

//------------------------------------------------------------------------------------------
  // Redirect if not logged in; only run this on the client
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && !user) {
      router.push('/'); // Redirect to login
      }
    

    // Redirect to login if user is not logged in
    if (!user) {
        router.push('/');
        return;
    }

    // Check if user has the required role; otherwise, show alert and redirect
    if (user.role !== "adm_admin" && !alertShownRef.current) {
        alert("Not authorized User");
        alertShownRef.current = true;
        router.replace(previousPage);
        return;
    }   

    // Fetch data based on admissionYear when it's available
     if (admissionYear) {
       fetchData();
    }
    else return; 
}, [user, router, previousPage, admissionYear]); 




/*   useEffect(() => {
    if (typeof window !== 'undefined' && !user) {
    router.push('/'); // Redirect to login
    }
  }, [user, router]);   */

//---------------------------------------------------------------------------------------------------------  
  const handleYearChange = (selectedYear: string) => {
    setAdmyear(selectedYear);
    setAdmissionYear(selectedYear);
    setAdmYear(selectedYear)
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
//------------------------------------------------------------------------------------------------------------
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

  useEffect(() => {
    if (!admissionYear) return;
      fetchData();
    }, [admissionYear]);
//-----------------------------------------------------------------------------------------------------
  
  // Handle row click: Pre-fill the form with the row's data
  const handleRowClick = (intake: Intake) => {
    setBrcode(intake.brcode);
    setAicte(intake.aicte);
    setAided(intake.aided);
    setUnaided(intake.unaided);
    setComedk(intake.comedk);
    setMq(intake.mq);
    setSnq(intake.snq);
    setAdmYear(intake.admyear);
    setIsEditMode(true);
    dialogRef.current?.showModal(); // Open the dialog
  };
//-----------------------------------------------------------------------------------------------------
  // Open modal for inserting new entry
  const handleInsertNew = () => {
    setBrcode("");
    setAicte("");
    setAided("");
    setUnaided("");
    setComedk("");
    setMq("");
    setSnq("");
    setAdmYear("");
    setIsEditMode(false);
    dialogRef.current?.showModal(); // Open the dialog
  };
//-----------------------------------------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const apiEndpoint = isEditMode ? `/api/adm_intake_update?admission_year=${admissionYear}` : `/api/adm_intake_insert?admission_year=${admissionYear}`; // Conditionally decide whether to insert or update
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ brcode, aicte, aided, unaided, comedk, mq, snq, admissionYear}),
      });

      if (res.ok) {
        alert(isEditMode ? "Data updated successfully" : "Data inserted successfully");
        await fetchData(); // Refresh the table
        dialogRef.current?.close(); // Close the dialog after submit
        setHighlightedRow(brcode); // Highlight the updated/inserted row
        setTimeout(() => setHighlightedRow(null), 3000); // Remove highlight after 3 seconds
      } else {
        alert("Failed to insert/update data");
      }
    } catch (error) {
      console.error("Error inserting/updating data", error);
    }
  };
//-----------------------------------------------------------------------------------------------------
  // Filter data based on search query
  const filteredData = data.filter((intake) => {
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
  const handleDelete = async (brcode: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this record?");
    if (confirmDelete) {
      try {
        const res = await fetch("/api/delete_data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ brcode}),
        });

        if (res.ok) {
          alert("Data deleted successfully");
          //await fetchData(); // Refresh the table
        } else {
          alert("Failed to delete data");
        }
      } catch (error) {
        console.error("Error deleting data", error);
      }
    }
  };
//-----------------------------------------------------------------------------------------------------
  return (
    <Layout moduleType="admission"> <ScrollToTop />
   <div className="flex flex-col items-start mt-8">
      <h1 className='ml-4 text-2xl'>Admission Intake Details</h1>
      <div className="ml-0 "> {/* Wrapper div to control width */}
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
              className="w-1/3 p-2 border border-gray-400 rounded mr-4"
            />
            <button
              onClick={handleInsertNew}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Insert New
            </button>
          </div>

          <div className="flex ml-4">
            <div>
              <table className="table-auto border-collapse w-auto h-40 items-center justify-center bg-white border-2 border-gray-700 shadow-md rounded-lg">
                <thead>
                  <tr className="bg-blue-100 h-10 border-b">
                    <th className="text-left py-3 px-4 font-bold text-gray-600">Sl.No</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-600">Branch</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-600">AICTE</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-600">Aided</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-600">Unaided</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-600">ComedK</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-600">Management</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-600">SNQ</th>
                  </tr>
                </thead>
                <tbody>
                {filteredData.map((item,index) => ( 
                    <tr
                      key={item.brcode}
                      className={`border-b h-10 hover:bg-gray-100 cursor-pointer ${
                        highlightedRow === item.brcode ? "bg-yellow-200" : ""
                      }`}
                      onClick={() => handleRowClick(item)} // Call handleRowClick on row click
                      onContextMenu={(e) => {
                        e.preventDefault(); // Prevent the default context menu
                        handleDelete(item.brcode); // Call handleDelete on right-click
                      }} 
                    >
                      <td className="py-3 px-4 text-right">{index+1}</td>
                      <td className="py-3 px-4 text-right">{item.brcode}</td>
                      <td className="py-3 px-4 text-right">{item.aicte}</td>
                      <td className="py-3 px-4 text-right">{item.aided}</td>
                      <td className="py-3 px-4 text-right">{item.unaided}</td>
                      <td className="py-3 px-4 text-right">{item.comedk}</td>
                      <td className="py-3 px-4 text-right">{item.mq}</td>
                      <td className="py-3 px-4 text-right">{item.snq}</td>
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr className="font-semibold bg-gray-200">
                      <td className="py-2 px-4 border-b text-right"></td>
                      <td className="py-2 px-4 border-b text-right">Total</td>
                      <td className="py-2 px-4 border-b text-right">{data.reduce((sum, stat) => sum + stat.aicte, 0)}</td>
                      <td className="py-2 px-4 border-b text-right">{data.reduce((sum, stat) => sum + stat.aided, 0)}</td>
                      <td className="py-2 px-4 border-b text-right">{data.reduce((sum, stat) => sum + stat.unaided, 0)}</td>
                      <td className="py-2 px-4 border-b text-right">{data.reduce((sum, stat) => sum + stat.comedk, 0)}</td>
                      <td className="py-2 px-4 border-b text-right">{data.reduce((sum, stat) => sum + stat.mq, 0)}</td>
                      <td className="py-2 px-4 border-b text-right">{data.reduce((sum, stat) => sum + stat.snq, 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modal (dialog) for form */}
            <dialog ref={dialogRef} className="p-6 bg-white rounded-md shadow-lg" style={{ width: "600px" }}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="faid" className="block text-gray-700">
                    Branch:
                  </label>
                  <input
                    id="brcode"
                    type="text"
                    value={brcode}
                    onChange={(e) => setBrcode(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300"
                    required
                    disabled={isEditMode} // Disable ID editing in edit mode
                  />
                </div>
                <div>
                  <label htmlFor="faname" className="block text-gray-700">
                    AICTE:
                  </label>
                  <input
                    id="aicte"
                    type="text"
                    value={aicte}
                    onChange={(e) => setAicte(e.target.value ? Number(e.target.value) : "")}
                    className="mt-1 block w-full p-2 border border-gray-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="aided" className="block text-gray-700">
                    Aided:
                  </label>
                  <input
                    id="aided"
                    type="text"
                    value={aided}
                    onChange={(e) => setAided(e.target.value ? Number(e.target.value) : "")}
                    className="mt-1 block w-full p-2 border border-gray-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="unaided" className="block text-gray-700">
                    Unaided:
                  </label>
                  <input
                    id="unaided"
                    type="text"
                    value={unaided}
                    onChange={(e) => setUnaided(e.target.value ? Number(e.target.value) : "")}
                    className="mt-1 block w-full p-2 border border-gray-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="comedk" className="block text-gray-700">
                    ComedK:
                  </label>
                  <input
                    id="comedk"
                    type="text"
                    value={comedk}
                    onChange={(e) => setComedk(e.target.value ? Number(e.target.value) : "")}
                    className="mt-1 block w-full p-2 border border-gray-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="mq" className="block text-gray-700">
                    Management:
                  </label>
                  <input
                    id="mq"
                    type="text"
                    value={mq}
                    onChange={(e) => setMq(e.target.value ? Number(e.target.value) : "")}
                    className="mt-1 block w-full p-2 border border-gray-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="snq" className="block text-gray-700">
                    SNQ:
                  </label>
                  <input
                    id="snq"
                    type="text"
                    value={snq}
                    onChange={(e) => setSnq(e.target.value ? Number(e.target.value) : "")}
                    className="mt-1 block w-full p-2 border border-gray-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="admyear" className="block text-gray-700">
                    Admission Year:
                  </label>
                  <input
                    id="admyear"
                    type="text"
                    value={admyear}
                    onChange={(e) => setAdmYear(e.target.value ? e.target.value : "")}
                    className="mt-1 block w-full p-2 border border-gray-300"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => dialogRef.current?.close()}
                    className="px-6 py-2 mr-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  
                  <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    {isEditMode ? "Update" : "Submit"}
                  </button>
                
                </div>
              </form>
            </dialog>
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
