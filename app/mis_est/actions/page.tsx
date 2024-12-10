"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface User {
  pky: number;
  eid: string;
  ename: string;
  pass: string;
  role: string;
  department: string;
  designation: string;
}

const initialUserState: User = {
  pky: 0,
  eid: "",
  ename: "",
  pass: "",
  role: "faculty",
  department: "",
  designation: "",
};

export default function AdminUserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<"add" | "table">("table");
  const [newUser, setNewUser] = useState<User>(initialUserState);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // const modalRef = useRef<HTMLDivElement | null>(null);

  // Fetch Users
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/fetchEmp");
        if (!response.ok) throw new Error("Failed to fetch users.");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setErrorMessage("Failed to load users.");
      }
    }
    fetchUsers();
  }, []);

  // Handle Delete
  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch("/api/fetchEmp", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to delete user.");
      alert("User deleted successfully.");
      setUsers(users.filter((user) => user.pky !== id)); // Optimistic update
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  }

  // Add or Update User
  async function handleSaveUser() {
    try {
      const method = editUser ? "PUT" : "POST";
      const response = await fetch("/api/fetchEmp", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editUser || newUser),
      });

      if (!response.ok) throw new Error(`Failed to ${editUser ? "update" : "add"} user.`);

      alert(`User ${editUser ? "updated" : "added"} successfully!`);
      setActiveView("table");
      setNewUser(initialUserState);
      setEditUser(null);

      const updatedUsers = await (await fetch("/api/fetchEmp")).json();
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error saving user:", error);
      alert(`Failed to ${editUser ? "update" : "add"} user.`);
    }
  }

  // Filter Users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.ename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="container mx-auto p-4">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-4 bg-gray-100 p-3 rounded-lg shadow">
        <h1 className="text-xl font-semibold">Admin Panel</h1>
        <div className="flex space-x-3">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeView === "add"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => {
              setActiveView("add");
              setEditUser(null);
            }}
          >
            Add User
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeView === "table"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveView("table")}
          >
            View Table
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-500 text-white"
            onClick={() => router.push("/admin")}
          >
            Back
          </button>
        </div>
      </nav>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {errorMessage}
        </div>
      )}

      {/* Add/Edit User Form */}
      {activeView === "add" && (
        <motion.div>
          <h2 className="text-xl font-semibold mb-4">
            {editUser ? "Edit User" : "Add New User"}
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              className="input"
              placeholder="Faculty ID"
              value={editUser ? editUser.eid : newUser.eid}
              onChange={(e) =>
                editUser
                  ? setEditUser({ ...editUser, eid: e.target.value })
                  : setNewUser({ ...newUser, eid: e.target.value })
              }
            />
            <input
              type="text"
              className="input"
              placeholder="Full Name"
              value={editUser ? editUser.ename : newUser.ename}
              onChange={(e) =>
                editUser
                  ? setEditUser({ ...editUser, ename: e.target.value })
                  : setNewUser({ ...newUser, ename: e.target.value })
              }
            />
            <input
              type="password"
              className="input"
              placeholder="Password"
              value={editUser ? editUser.pass : newUser.pass}
              onChange={(e) =>
                editUser
                  ? setEditUser({ ...editUser, pass: e.target.value })
                  : setNewUser({ ...newUser, pass: e.target.value })
              }
            />
            <label htmlFor="role" className="sr-only">
              Role
            </label>
            <select
              id="role"
              className="input"
              value={editUser ? editUser.role : newUser.role}
              onChange={(e) =>
                editUser
                  ? setEditUser({ ...editUser, role: e.target.value })
                  : setNewUser({ ...newUser, role: e.target.value })
              }
            >
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
              <option value="hod">HOD</option>
              <option value="principal">Principal</option>
            </select>
            <label htmlFor="department" className="sr-only">
              Department
            </label>
            <select
              id="department"
              className="input"
              value={editUser ? editUser.department : newUser.department}
              onChange={(e) =>
                editUser
                  ? setEditUser({ ...editUser, department: e.target.value })
                  : setNewUser({ ...newUser, department: e.target.value })
              }
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
            </select>
            <select
              className="input"
              value={editUser ? editUser.designation : newUser.designation}
              onChange={(e) =>
                editUser
                  ? setEditUser({ ...editUser, designation: e.target.value })
                  : setNewUser({ ...newUser, designation: e.target.value })
              }
            >
              <option value="">Select Designation</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Lecturer">Lecturer</option>
            </select>
            <button
              onClick={handleSaveUser}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              {editUser ? "Update User" : "Add User"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Table View */}
      {activeView === "table" && (
        <motion.div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-center">Role</th>
                <th className="px-6 py-3 text-center">Department</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.pky}>
                  <td className="px-6 py-3">{user.ename}</td>
                  <td className="px-6 py-3 text-center">{user.role}</td>
                  <td className="px-6 py-3 text-center">{user.department}</td>
                  <td className="px-6 py-3 text-center space-x-3">
                    <button
                      onClick={() => {
                        setEditUser(user);
                        setActiveView("add");
                      }}
                      className="text-blue-500"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(user.pky)}
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
