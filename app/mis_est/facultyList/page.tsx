// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useRouter } from "next/navigation";

// interface Faculty {
//   faculty_name: string;
//   department: string;
//   qualification: string;
//   contactNo: string;
//   title: string;
// }

// export default function FacultyInfoPage() {
//   const [facultyList, setFacultyList] = useState<Faculty[]>([]);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
//   const [errorMessage, setErrorMessage] = useState<string>("");
//   const router = useRouter();
//   // Fetch Faculty Data
//   useEffect(() => {
//     async function fetchFacultyData() {
//       try {
//         const response = await fetch("/api/fetchFaculty");
//         if (!response.ok) throw new Error("Failed to fetch faculty data.");
//         const data = await response.json();
//         setFacultyList(data);
//       } catch (error) {
//         console.error("Error fetching faculty data:", error);
//         setErrorMessage("Failed to load faculty data.");
//       }
//     }
//     fetchFacultyData();
//   }, []);

//   // Filter Faculty
//   const filteredFaculty = facultyList.filter((faculty) => {
//     const matchesSearch = faculty.faculty_name
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const matchesDepartment =
//       selectedDepartment === "All" || faculty.department === selectedDepartment;

//     return matchesSearch && matchesDepartment;
//   });

//   return (
//     <div className="container mx-auto p-4">
//       {/* Navbar */}
//       <nav className="flex justify-between items-center mb-4 bg-gray-100 p-3 rounded-lg shadow">
//         <h1 className="text-xl font-semibold">Faculty Information</h1>
//         <div className="flex space-x-4">
//           {/* Search Bar */}
//           <input
//             type="text"
//             placeholder="Search by Name"
//             className="input px-3 py-2 rounded-md border"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />

//           {/* Department Filter */}
//           <label htmlFor="department-select" className="sr-only">
//             Select Department
//           </label>
//           <select
//             id="department-select"
//             className="input px-3 py-2 rounded-md border"
//             value={selectedDepartment}
//             onChange={(e) => setSelectedDepartment(e.target.value)}
//           >
//             <option value="All">All Departments</option>
//             <option value="CS">Computer Science</option>
//             <option value="AE">AE</option>
//             <option value="CH">CH</option>
//             <option value="CB">CB</option>
//             <option value="CV">CV</option>
//             <option value="EC">EC</option>
//             <option value="EE">EE</option>
//             <option value="HS">HS</option>
//             <option value="IM">IM</option>
//             <option value="IS">IS</option>
//             <option value="IT">IT</option>
//             <option value="MA">MA</option>
//             <option value="MBA">MBA</option>
//             <option value="MCA">MCA</option>
//             <option value="ME">ME</option>
//             <option value="ML">ML</option>
//             <option value="PH">PH</option>
//             <option value="TE">TE</option>
//           </select>
//         </div>
//       </nav>

//       {/* Error Message */}
//       {errorMessage && (
//         <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
//           {errorMessage}
//         </div>
//       )}

//       {/* Table View */}
//       <motion.div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow-lg rounded-lg">
//           <thead>
//             <tr>
//               <th className="px-6 py-3 text-left">Name</th>
//               <th className="px-6 py-3 text-center">Department</th>
//               <th className="px-6 py-3 text-center">Qualification</th>
//               <th className="px-6 py-3 text-center">Contact No</th>
//               <th className="px-6 py-3 text-center">Title</th>
//             </tr>
//           </thead>
//           <tbody onClick={() => router.push("www.google.com")}>
//             {filteredFaculty.map((faculty, index) => (
//               <tr key={index}>
//                 <td className="px-6 py-3">{faculty.faculty_name}</td>
//                 <td className="px-6 py-3 text-center">{faculty.department}</td>
//                 <td className="px-6 py-3 text-center">
//                   {faculty.qualification}
//                 </td>
//                 <td className="px-6 py-3 text-center">{faculty.contactNo}</td>
//                 <td className="px-6 py-3 text-center">{faculty.title}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </motion.div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Faculty {
  faculty_name: string;
  department: string;
  qualification: string;
  contactNo: string;
  title: string;
  employee_id: string; // New field from backend
}

export default function FacultyInfoPage() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // For search functionality
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All"); // For department filter
  const [errorMessage, setErrorMessage] = useState<string>(""); // For error handling
  const router = useRouter();

  // Fetch Faculty Data
  useEffect(() => {
    async function fetchFacultyData() {
      try {
        const response = await fetch("/api/fetchFaculty");
        if (!response.ok) throw new Error("Failed to fetch faculty data.");
        const data = await response.json();
        setFacultyList(data);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        setErrorMessage("Failed to load faculty data.");
      }
    }
    fetchFacultyData();
  }, []);

  // Filter Faculty
  const filteredFaculty = facultyList.filter((faculty) => {
    const matchesSearch = faculty.faculty_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" || faculty.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="container mx-auto p-4">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-4 bg-gray-100 p-3 rounded-lg shadow">
        <h1 className="text-xl font-semibold">Faculty Information</h1>
        <div className="flex space-x-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by Name"
            className="input px-3 py-2 rounded-md border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Department Filter */}
          <label htmlFor="department-select" className="sr-only">
            Select Department
          </label>
          <select
            id="department-select"
            className="input px-3 py-2 rounded-md border"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="CS">Computer Science</option>
            <option value="AE">AE</option>
            <option value="CH">CH</option>
            <option value="CB">CB</option>
            <option value="CV">CV</option>
            <option value="EC">EC</option>
            <option value="EE">EE</option>
            <option value="HS">HS</option>
            <option value="IM">IM</option>
            <option value="IS">IS</option>
            <option value="IT">IT</option>
            <option value="MA">MA</option>
            <option value="MBA">MBA</option>
            <option value="MCA">MCA</option>
            <option value="ME">ME</option>
            <option value="ML">ML</option>
            <option value="PH">PH</option>
            <option value="TE">TE</option>
          </select>
        </div>
      </nav>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {errorMessage}
        </div>
      )}

      {/* Table View */}
      <motion.div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-center">Name</th>
              <th className="px-6 py-3 text-center">Department</th>
              <th className="px-6 py-3 text-center">Qualification</th>
              <th className="px-6 py-3 text-center">Contact No</th>
            </tr>
          </thead>
          <tbody>
            {filteredFaculty.map((faculty, index) => (
              <tr
                key={index}
                onClick={() => router.push(`/faculty/${faculty.employee_id}`)} // Navigate to slug page
                className="cursor-pointer hover:bg-gray-100"
              >
                <td className="px-6 py-3 text-center">{faculty.title}</td>
                <td className="px-6 py-3">{faculty.faculty_name}</td>
                <td className="px-6 py-3 text-center">{faculty.department}</td>
                <td className="px-6 py-3 text-center">
                  {faculty.qualification}
                </td>
                <td className="px-6 py-3 text-center">{faculty.contactNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
