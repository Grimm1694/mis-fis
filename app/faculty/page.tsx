"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
const Page = () => {
  const router = useRouter();
  const [facultyId, setFacultyId] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (facultyId) {
      try {
        const response = await fetch(`/api/check_emp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ facultyId }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message || "Something went wrong");
          return;
        }
        const data = await response.json();
        if (data) {
          router.push(`/faculty/faculty_reg/${facultyId}`);
        } else {
          alert("Faculty is not registered or does not exist.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while checking faculty ID.");
      }
    } else {
      alert("Please enter a Faculty ID");
    }
  };
  return (
    <div>
      {" "}
      <h1>Find Faculty Page</h1>{" "}
      <form onSubmit={handleSubmit}>
        {" "}
        <input
          type="text"
          value={facultyId}
          onChange={(e) => setFacultyId(e.target.value)}
          placeholder="Enter Faculty ID"
        />{" "}
        <button type="submit">Submit</button>{" "}
      </form>{" "}
    </div>
  );
};
export default Page;
