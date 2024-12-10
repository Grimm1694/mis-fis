"use client";

import { useState } from "react";
import { useUser } from "./context/usercontext";
import React from "react";
import Image from "next/image";
import drait from "@/app/assets/full_logo-wide.png";
import { useRouter } from "next/navigation";
import buddha from "./assets/buddha.jpg";
import ImageWithAltCenter from "./components/image_with_center";

const LoginPage = () => {
  const { setUser } = useUser();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState<"Student" | "Faculty">("Student"); // Default login type
  const router = useRouter();

  const handleLogin = async () => {
    // Determine the API endpoint based on login type
    const apiEndpoint =
      loginType === "Faculty"
        ? "/api/login_user_staff"
        : "/api/login_user_student";

    try {
      // Make the API call
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Set user context with the retrieved data
        setUser({
          usno: data.usno,
          name: data.name,
          role: data.role,
          department: data.department,
          emp_id: userId,
        });

        // Redirect based on the login type and role
        if (loginType === "Faculty") {
          if (data.role === "faculty") {
            router.push("/mis_faculty/faculty_home");
          } else if (data.role === "hod") {
            router.push("/mis_hod/hod_home");
          } else if (data.role === "admission" || data.role === "adm_admin") {
            router.push("/mis_admission/adm_home");
          } else if (data.role === "accounts" || data.role === "acc_admin") {
            router.push("/mis_accounts/accounts_home");
          } else if (data.role === "est") {
            router.push("/mis_est");
          }
        } else if (loginType === "Student") {
          router.push("/mis_student/student_home");
        }
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-24 bg-gray-50">
      <header className="bg-gradient-to-r fixed from-white from-25% via-blue-500 to-purple-600 flex items-center justify-between px-4 py-2 top-0 left-0 z-50 w-full">
        <Image src={drait} width={400} height={500} alt="drait logo wide" />
      </header>

      <div className="flex flex-col items-center space-y-6">
        {/* Centered Image */}
        <ImageWithAltCenter src={buddha} alt="Image Not Available" />

        {/* Centered Heading */}
        <h2 className="text-2xl font-bold text-center">
          Management Information System
        </h2>

        {/* Centered Form */}
        <div className="w-full max-w-md p-6 bg-white rounded shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

          {/* Login Type Selection */}
          <div className="flex justify-center space-x-4 mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="Student"
                checked={loginType === "Student"}
                onChange={() => setLoginType("Student")}
                className="form-radio"
              />
              <span>Student Login</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="Faculty"
                checked={loginType === "Faculty"}
                onChange={() => setLoginType("Faculty")}
                className="form-radio"
              />
              <span>Faculty Login</span>
            </label>
          </div>

          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
