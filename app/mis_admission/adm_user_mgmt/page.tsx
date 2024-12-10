"use client"

import ScrollToTop from '../../components/ui/scroll_to_top';
import Layout from '../../components/ui/Layout';
import { useEffect, useState, useRef } from "react";
import { useUser } from "../../context/usercontext";
import { useRouter } from 'next/navigation';



// Define the type for each item in the fetched data
interface Employee {
  eid: string;
  ename: string;
  pass: string;
  role: string;
  department: string;
  designation: string;
}

const HomePage: React.FC = () => {
//------------------------------------------------------------------------------------------
  // Redirect if not logged in; only run this on the client
  const { user } = useUser();
  const router = useRouter();
  const previousPage = typeof window !== "undefined" ? window.location.pathname : '/'; // Save the current path as Page A
  
 /*  useEffect(() => {
    if (typeof window !== 'undefined' && !user) {
    router.push('/'); // Redirect to login
    }
  }, [user, router]); */
//------------------------------------------------------------------------------------------  


  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null); // To highlight rows
  const [searchQuery, setSearchQuery] = useState<string>(""); // State to store search input
  const dialogRef = useRef<HTMLDialogElement>(null); // Ref for the dialog
  const alertShownRef = useRef(false); // Ref to track if alert has been shown

  const fetchData = async () => {
    try {
      const res = await fetch("/api/adm_user_retrieve");
      const result = await res.json();
      setData(result.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

 /*  useEffect(() => {
    fetchData();
  }, []); */

  // States for form fields
  const [empid, setempid] = useState("");
  const [empname, setempName] = useState("");
  const [emppass, setempPass] = useState("");
  const [emprole, setempRole] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");

  // Handle row click: Pre-fill the form with the row's data
  const handleRowClick = (employee: Employee) => {
    setempid(employee.eid);
    setempName(employee.ename);
    setempPass(employee.pass);
    setempRole(employee.role);
    setDepartment(employee.department);
    setDesignation(employee.designation);
    dialogRef.current?.showModal(); // Open the dialog
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/adm_user_update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ empid, empname, emppass, emprole, department, designation }),
      });

      if (res.ok) {
        alert("Data updated successfully");
        await fetchData(); // Refresh the table
        dialogRef.current?.close(); // Close the dialog after submit
        setHighlightedRow(empid); // Highlight the updated row
        setTimeout(() => setHighlightedRow(null), 3000); // Remove highlight after 3 seconds
      } else {
        alert("Failed to update data");
      }
    } catch (error) {
      console.error("Error updating data", error);
    }
  };

  // Filter data based on search query
  const filteredData = data.filter((employee) => {
    return (
      employee.eid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.ename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.designation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });



   useEffect(() => {
    if (user && user.role !== "adm_admin") {
      window.alert("Not authorized");
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) {
        // Redirect to login if user is not logged in
        router.push('/');
        return;
    }

    if (user.role !== "adm_admin" && !alertShownRef.current) {
        alert("Not authorized User"); // Show alert once
        alertShownRef.current = true; // Mark alert as shown
        router.replace(previousPage); // Redirect back to previous page
    }
    else
      fetchData();
  }, [user, router, previousPage]);

    // Fetch data and render only if user is an admin
    if (!user || user.role !== "adm_admin") {
        return null;
    } 

if (loading) return <p>Loading...</p>;

  return (
    <Layout moduleType="admission"> <ScrollToTop />
    
    <div className="flex flex-col h-screen mt-8">
      <div className=" ml-10 pb-8 font-bold">
      <h1 className=' text-2xl'>User Management</h1>
      </div>

      {/* Search Bar */}
      <div className="ml-10 mb-4">
        <input
          type="text"
          placeholder="Search by Employee ID, Name, Department, or Designation"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/3 p-2 border border-gray-400 rounded"
        />
      </div>

      <div className="flex ml-10">
        <div>
          <table className="table-auto border-collapse w-auto h-40 items-center justify-center bg-white border-2 border-gray-700 shadow-md rounded-lg">
            <thead>
              <tr className="bg-blue-100 h-10 border-b">
                <th className="text-left py-3 px-4 font-bold text-gray-600">Employee ID</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600">Employee Name</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600">Password</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600">Role</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600">Department</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600">Designation</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr
                  key={item.eid}
                  className={`border-b h-10 hover:bg-gray-100 cursor-pointer ${
                    highlightedRow === item.eid ? "bg-yellow-200" : ""
                  }`}
                  onClick={() => handleRowClick(item)} // Call handleRowClick on row click
                  onContextMenu={(e) => {
                    e.preventDefault(); // Prevent the default context menu
                  }}
                >
                  <td className="py-3 px-4">{item.eid}</td>
                  <td className="py-3 px-4">{item.ename}</td>
                  <td className="py-3 px-4">{item.pass}</td>
                  <td className="py-3 px-4">{item.role}</td>
                  <td className="py-3 px-4">{item.department}</td>
                  <td className="py-3 px-4">{item.designation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal (dialog) for form */}
        <dialog ref={dialogRef} className="p-6 bg-white rounded-md shadow-lg" style={{ width: "600px" }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="faid" className="block text-gray-700">
                FID:
              </label>
              <input
                id="empid"
                type="text"
                value={empid}
                onChange={(e) => setempid(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300"
                required
                disabled // Always disable ID editing
              />
            </div>
            <div>
              <label htmlFor="empname" className="block text-gray-700">
                Faculty Name:
              </label>
              <input
                id="empname"
                type="text"
                value={empname}
                onChange={(e) => setempName(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300"
                required
              />
            </div>
            <div>
              <label htmlFor="emppass" className="block text-gray-700">
                Password:
              </label>
              <input
                id="emppass"
                type="text"
                value={emppass}
                onChange={(e) => setempPass(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300"
                required
              />
            </div>
            <div>
              <label htmlFor="emprole" className="block text-gray-700">
                Faculty Role:
              </label>
              <input
                id="emprole"
                type="text"
                value={emprole}
                onChange={(e) => setempRole(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300"
                required
              />
            </div>
            <div>
              <label htmlFor="department" className="block text-gray-700">
                Department:
              </label>
              <input
                id="department"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300"
                required
              />
            </div>
            <div>
              <label htmlFor="designation" className="block text-gray-700">
                Designation:
              </label>
              <input
                id="designation"
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="mt-1 block w-full p-...2 border border-gray-300"
                required
              />
            </div>

            {/* Submit and Close Buttons */}
            <div className="flex justify-end space-x-3">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                Update
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




