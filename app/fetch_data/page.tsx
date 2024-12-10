"use client";

import { useEffect, useState, useRef } from "react";

// Define the type for each item in the fetched data
interface Employee {
  fid: string;
  fname: string;
  pass: string;
  role: string;
  department: string;
  designation: string;
}

const HomePage: React.FC = () => {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null); // To highlight rows
  const [searchQuery, setSearchQuery] = useState<string>(""); // State to store search input
  const dialogRef = useRef<HTMLDialogElement>(null); // Ref for the dialog

  const fetchData = async () => {
    try {
      const res = await fetch("/api/retrieve_data");
      const result = await res.json();
      setData(result.data);
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
  const [faid, setFaid] = useState("");
  const [faname, setFaName] = useState("");
  const [fapass, setFaPass] = useState("");
  const [farole, setFaRole] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [isEditMode, setIsEditMode] = useState(false); // Track if we are editing an existing row

  // Handle row click: Pre-fill the form with the row's data
  const handleRowClick = (employee: Employee) => {
    setFaid(employee.fid);
    setFaName(employee.fname);
    setFaPass(employee.pass);
    setFaRole(employee.role);
    setDepartment(employee.department);
    setDesignation(employee.designation);
    setIsEditMode(true);
    dialogRef.current?.showModal(); // Open the dialog
  };

  // Open modal for inserting new entry
  const handleInsertNew = () => {
    setFaid("");
    setFaName("");
    setFaPass("");
    setFaRole("");
    setDepartment("");
    setDesignation("");
    setIsEditMode(false);
    dialogRef.current?.showModal(); // Open the dialog
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const apiEndpoint = isEditMode ? "/api/update_data" : "/api/insert_data"; // Conditionally decide whether to insert or update
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ faid, faname, fapass, farole, department, designation }),
      });

      if (res.ok) {
        alert(isEditMode ? "Data updated successfully" : "Data inserted successfully");
        await fetchData(); // Refresh the table
        dialogRef.current?.close(); // Close the dialog after submit
        setHighlightedRow(faid); // Highlight the updated/inserted row
        setTimeout(() => setHighlightedRow(null), 3000); // Remove highlight after 3 seconds
      } else {
        alert("Failed to insert/update data");
      }
    } catch (error) {
      console.error("Error inserting/updating data", error);
    }
  };

  // Filter data based on search query
  const filteredData = data.filter((employee) => {
    return (
      employee.fid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.designation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleDelete = async (fid: string, faname: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this record?");
    if (confirmDelete) {
      try {
        const res = await fetch("/api/delete_data", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fid, faname }),
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
    <div className="flex flex-col h-screen">
      <div className="mt-5 ml-10 pb-8">
        <h1>Faculty Login Credentials</h1>
        <button
          onClick={handleInsertNew}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Insert New
        </button>
      </div>

      {/* Search Bar */}
      <div className="ml-10 mb-4">
        <input
          type="text"
          placeholder="Search by Faculty ID, Name, Role, Department, or Designation"
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
                <th className="text-left py-3 px-4 font-bold text-gray-600">Faculty ID</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600">Faculty Name</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600">Password</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600">Role</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600">Department</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600">Designation</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr
                  key={item.fid}
                  className={`border-b h-10 hover:bg-gray-100 cursor-pointer ${
                    highlightedRow === item.fid ? "bg-yellow-200" : ""
                  }`}
                  onClick={() => handleRowClick(item)} // Call handleRowClick on row click
                  onContextMenu={(e) => {
                    e.preventDefault(); // Prevent the default context menu
                    handleDelete(item.fid,item.fname); // Call handleDelete on right-click
                  }}
                >
                  <td className="py-3 px-4">{item.fid}</td>
                  <td className="py-3 px-4">{item.fname}</td>
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
                id="faid"
                type="text"
                value={faid}
                onChange={(e) => setFaid(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300"
                required
                disabled={isEditMode} // Disable ID editing in edit mode
              />
            </div>
            <div>
              <label htmlFor="faname" className="block text-gray-700">
                Faculty Name:
              </label>
              <input
                id="faname"
                type="text"
                value={faname}
                onChange={(e) => setFaName(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300"
                required
              />
            </div>
            <div>
              <label htmlFor="fapass" className="block text-gray-700">
                Password:
              </label>
              <input
                id="fapass"
                type="text"
                value={fapass}
                onChange={(e) => setFaPass(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300"
                required
              />
            </div>
            <div>
              <label htmlFor="farole" className="block text-gray-700">
                Faculty Role:
              </label>
              <input
                id="farole"
                type="text"
                value={farole}
                onChange={(e) => setFaRole(e.target.value)}
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
    </div>
  );
};

export default HomePage;
