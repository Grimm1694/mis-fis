"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

interface FacultyDetails {
  id: number;
  employee_id: string;
  faculty_name: string;
  qualification: string;
  department: string;
  photo?: string;
  title: string;
  emailId?: string;
  contactNo: string;
  alternateContactNo?: string;
  emergencyContactNo?: string;
  adharNo?: string;
  panNo?: string;
  dob?: string;
  gender?: string;
  nationality?: string;
  firstAddressLine?: string;
  correspondenceAddressLine?: string;
  religion?: string;
  caste?: string;
  category?: string;
  motherTongue?: string;
  speciallyChallenged?: string;
  remarks?: string;
  languages?: string;
  bankName?: string;
  accountNo?: string;
  accountName?: string;
  accountType?: string;
  branch?: string;
  ifsc?: string;
  pfNumber?: string;
  uanNumber?: string;
  pensionNumber?: string;
  motherName?: string;
  fatherName?: string;
  spouseName?: string;
  children?: string;
  dateOfJoiningDrait?: string;
  designation?: string;
  aided?: string;
}

export default function FacultyDetailsPage() {
  const params = useParams();
  const employee_id = params?.employee_id;
  const [facultyDetails, setFacultyDetails] = useState<FacultyDetails | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function fetchFacultyDetails() {
      if (!employee_id) return;

      try {
        const response = await fetch("/api/fetchFullFacDetails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employee_id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to fetch faculty details."
          );
        }

        const data = await response.json();
        setFacultyDetails(data);
      } catch (error) {
        console.error("Error fetching faculty details:", error);
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unknown error occurred.");
        }
      }
    }

    fetchFacultyDetails();
  }, [employee_id]);

  const isValidImageUrl = (url: string | undefined): boolean => {
    return (
      !!url &&
      (url.startsWith("/") ||
        url.startsWith("http://") ||
        url.startsWith("https://"))
    );
  };

  if (errorMessage) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        <h1>Error</h1>
        <p>{errorMessage}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!facultyDetails) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Image
        src={
          isValidImageUrl(facultyDetails.photo)
            ? facultyDetails.photo!
            : "/placeholder.jpg"
        }
        alt="Faculty Photo"
        width={128}
        height={128}
        className="mb-4 w-32 h-32 rounded-full"
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p>
            <strong>Employee ID:</strong> {facultyDetails.employee_id}
          </p>
          <p>
            <strong>Department:</strong> {facultyDetails.department}
          </p>
          <p>
            <strong>Qualification:</strong> {facultyDetails.qualification}
          </p>
          <p>
            <strong>Contact No:</strong> {facultyDetails.contactNo}
          </p>
          <p>
            <strong>Alternate Contact:</strong>{" "}
            {facultyDetails.alternateContactNo || "N/A"}
          </p>
          <p>
            <strong>Emergency Contact:</strong>{" "}
            {facultyDetails.emergencyContactNo || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {facultyDetails.emailId || "N/A"}
          </p>
          <p>
            <strong>Title:</strong> {facultyDetails.title}
          </p>
        </div>
        <div>
          <p>
            <strong>Date of Joining:</strong>{" "}
            {facultyDetails.dateOfJoiningDrait || "N/A"}
          </p>
          <p>
            <strong>Gender:</strong> {facultyDetails.gender || "N/A"}
          </p>
          <p>
            <strong>Nationality:</strong> {facultyDetails.nationality || "N/A"}
          </p>
          <p>
            <strong>Religion:</strong> {facultyDetails.religion || "N/A"}
          </p>
          <p>
            <strong>Languages:</strong> {facultyDetails.languages || "N/A"}
          </p>
          <p>
            <strong>PF Number:</strong> {facultyDetails.pfNumber || "N/A"}
          </p>
          <p>
            <strong>UAN Number:</strong> {facultyDetails.uanNumber || "N/A"}
          </p>
          <p>
            <strong>Spouse Name:</strong> {facultyDetails.spouseName || "N/A"}
          </p>
        </div>
      </div>
      <h2 className="text-xl font-bold mt-6">Additional Details</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p>
            <strong>Address:</strong> {facultyDetails.firstAddressLine || "N/A"}
          </p>
          <p>
            <strong>Correspondence Address:</strong>{" "}
            {facultyDetails.correspondenceAddressLine || "N/A"}
          </p>
          <p>
            <strong>Bank Name:</strong> {facultyDetails.bankName || "N/A"}
          </p>
          <p>
            <strong>Account No:</strong> {facultyDetails.accountNo || "N/A"}
          </p>
        </div>
        <div>
          <p>
            <strong>Branch:</strong> {facultyDetails.branch || "N/A"}
          </p>
          <p>
            <strong>IFSC:</strong> {facultyDetails.ifsc || "N/A"}
          </p>
          <p>
            <strong>Pension Number:</strong>{" "}
            {facultyDetails.pensionNumber || "N/A"}
          </p>
          <p>
            <strong>Designation:</strong> {facultyDetails.designation || "N/A"}
          </p>
        </div>
      </div>
      <button
        onClick={() => router.back()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Go Back
      </button>
    </div>
  );
}
