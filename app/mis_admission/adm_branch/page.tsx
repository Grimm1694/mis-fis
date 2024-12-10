"use client"

import ScrollToTop from '../../components/ui/scroll_to_top';
import Layout from '../../components/ui/Layout';
import { useEffect, useState, useRef } from "react";
import { useUser } from "../../context/usercontext";
import { useRouter } from 'next/navigation';

// Define the type for each item in the fetched data
interface Branch {
    brcode: string;
    brcode_title: string;
  }
  
  const HomePage: React.FC = () => {
    const [data, setData] = useState<Branch[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [highlightedRow, setHighlightedRow] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>(""); 
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [isEditMode, setIsEditMode] = useState(false); // Track if we are editing an existing row

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
  
    const fetchData = async () => {
      try {
        const res = await fetch("/api/adm_branch_fetch");
        const result = await res.json();
        setData(result.data); // Setting fetched data to state
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    // States for form fields
    const [brcode, setBrcode] = useState("");
    const [brcode_title, setBrcodeTitle] = useState("");
  
    // Handle row click: Pre-fill the form with the row's data
    const handleRowClick = (branch: Branch) => {
      setBrcode(branch.brcode);
      setBrcodeTitle(branch.brcode_title);
      setIsEditMode(true);
      dialogRef.current?.showModal(); // Open the dialog
    };

    const handleInsertNew = () => {
        setBrcode("");
        setBrcodeTitle("");
        setIsEditMode(false);
        dialogRef.current?.showModal(); // Open the dialog
      };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        const apiEndpoint = isEditMode ? "/api/adm_branch_update" : "/api/adm_branch_insert"; // Conditionally decide whether to insert or update
        const res = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ brcode, brcode_title }),
        });
  
        if (res.ok) {
          alert(isEditMode ? "Data updated successfully" : "Data inserted successfully");
          await fetchData();
          dialogRef.current?.close();
          setHighlightedRow(brcode);
          setTimeout(() => setHighlightedRow(null), 3000);
        } else {
          alert("Failed to update data");
        }
      } catch (error) {
        console.error("Error inserting/updating data", error);
      }
    };

    const filteredData = data.filter((branch) => {
        return (
          branch.brcode.toLowerCase().includes(searchQuery.toLowerCase()) 
        );
      });

      const handleDelete = async (brcode: string, brcode_title: string) => {
        const confirmDelete = confirm("Are you sure you want to delete this record?");
        if (confirmDelete) {
          try {
            const res = await fetch("/api/adm_branch_delete", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ brcode, brcode_title}),
            });
    
            if (res.ok) {
              alert("Data deleted successfully");
              await fetchData(); // Refresh the table
            } else {
              alert("Failed to delete data");
            }
          } catch (error) {
            console.error("Error deleting data", error);
          }
        }
      };  

  
    if (loading) return <p>Loading...</p>; 
  
    return (
      <Layout moduleType="admission">
        <ScrollToTop />
        <div className="flex flex-col items-start mt-8">
          <div className="ml-10 pb-2 font-bold">
            <h1 className='text-2xl'>Branch Management</h1>
          </div>
  
          {/* Search Bar */}
          <div className="ml-10 mb-4 flex items-center space-x-4">
            <input
                type="text"
                placeholder="Search by Branch"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-400 rounded"
            />
            <button
                onClick={handleInsertNew}
                className="px-6 py-2 w-48 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Insert New
            </button>
        </div>
  
          <div className="flex ml-10">
            <div>
              <table className="table-auto border-collapse w-full h-40 items-center justify-center bg-white border-2 border-gray-700 shadow-md rounded-lg">
                <thead>
                  <tr className="bg-blue-100 h-10 border-b">
                    <th className="text-left py-3 px-4 font-bold text-gray-600">Sl.No</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-600">Branch</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-600">Title</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr
                        key={item.brcode}
                        className={`border-b h-10 hover:bg-gray-100 cursor-pointer ${
                        highlightedRow === item.brcode ? "bg-yellow-200" : ""
                        }`}
                        onClick={() => handleRowClick(item)} // Call handleRowClick on row click
                        onContextMenu={(e) => {
                        e.preventDefault(); // Prevent the default context menu
                        handleDelete(item.brcode, item.brcode_title); // Call handleDelete on right-click
                        }}
                    >
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{item.brcode}</td>
                      <td className="py-3 px-4">{item.brcode_title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
  
            {/* Modal (dialog) for form */}
            <dialog ref={dialogRef} className="p-6 bg-white rounded-md shadow-lg" style={{ width: "600px" }}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="brcode" className="block text-gray-700">
                    Branch:
                  </label>
                  <input
                    id="brcode"
                    type="text"
                    value={brcode}
                    onChange={(e) => setBrcode(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="brcode_title" className="block text-gray-700">
                    Branch Title:
                  </label>
                  <input
                    id="brcode_title"
                    type="text"
                    value={brcode_title}
                    onChange={(e) => setBrcodeTitle(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300"
                    required
                  />
                </div>
  
                <div className="flex justify-end space-x-3">
                    <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        {isEditMode ? "Update" : "Submit"}
                    </button>
                  <button type="button" onClick={() => dialogRef.current?.close()} className="px-4 py-2 bg-gray-400 text-white rounded">
                    Close
                  </button>
                </div>
              </form>
            </dialog>
          </div>
        </div>
      </Layout>
    );
  };
  
  export default HomePage;
  