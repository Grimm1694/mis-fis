"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, notFound } from "next/navigation";
import { FacultyProfileNav } from "../../components/faculty/facultyProfileNav";
import image from "@/assets/image.jpg";
import Image from "next/image";
export default function FacultyProfile() {
  const [facultyDetails, setFacultyDetails] = useState<{
    data: {
      photo: string;
      firstName: string;
      lastName: string;
      facultyId: string;
      spouseName: string;
      qualification: string;
      title: string;
      middleName: string;
      emailId: string;
      contactNo: string;
      alternateContactNo: string;
      emergencyContactNo: string;
      adharNo: string;
      panNo: string;
      dob: string;
      gender: string;
      nationality: string;
      firstAddressLine1: string;
      firstAddressLine2: string;
      firstAddressLine3: string;
      correspondenceAddressLine1: string;
      correspondenceAddressLine2: string;
      correspondenceAddressLine3: string;
      religion: string;
      caste: string;
      category: string;
      motherTongue: string;
      speciallyChallenged: boolean;
      remarks: string;
      languages: string[];
      bankName: string;
      accountNo: string;
      accountName: string;
      accountType: string;
      branch: string;
      ifsc: string;
      pfNumber: string;
      uanNumber: string;
      pensionNumber: string;
      motherName: string;
      fatherName: string;
      children: JSON;
    };
  } | null>(null);
const [facultyEducationDetails, setFacultyEducationDetails] = useState<{
    data: {
      facultyId: string;
      Program: string;
      usnSsn: string;
      schoolCollege: string;
      specialization: string;
      mediumOfInstruction: string;
      passClass: string;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams(); // For fetching query parameters
  const router = useRouter(); // New router from `next/navigation`

  useEffect(() => {
    async function fetchFacultyDetails() {
      try {
        const token = localStorage.getItem("token");
        const facultyId = token ? JSON.parse(token).facultyId : null;
        console.log(facultyId);
        if (!facultyId) {
          notFound();
          return;
        }
        const response = await fetch(
          `/api/facultypersonaldetails?facultyId=${facultyId}`
        );
        const response1 = await fetch(
          `/api/facultyeducation?facultyId=${facultyId}`
        );
        
        if (!response.ok || !response1.ok) {
          router.push(`/faculty/faculty_reg?facultyId=${facultyId}`);
          return;
        }
        const data = await response.json();
        const data1 = await response1.json();
        setFacultyDetails(data);
        setFacultyEducationDetails(data1);
      } catch (error) {
        console.error("Error fetching faculty details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFacultyDetails();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!facultyDetails) {
    return <div>Faculty not found</div>;
  }
  return (
    <div>
      <FacultyProfileNav />
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
          <div className="relative">
            <Image
              src={facultyDetails?.data.photo || image}
              alt={`${facultyDetails?.data.firstName || ""} ${
                facultyDetails?.data.lastName || ""
              }`}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {facultyDetails.data.firstName} {facultyDetails.data.lastName}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Staff ID</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.data.facultyId}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Designation</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.data.qualification}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.data.contactNo}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">
                  {facultyDetails.data.emailId || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Qualification</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.qualification || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Title</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.title || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Middle Name</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.middleName || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Alternate Contact No</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.alternateContactNo || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Emergency Contact No</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.emergencyContactNo || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Aadhar No</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.adharNo || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">PAN No</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.panNo || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.dob.split("T")[0] || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.gender || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Nationality</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.nationality || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">First Address Line 1</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.firstAddressLine1 || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">First Address Line 2</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.firstAddressLine2 || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">First Address Line 3</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.firstAddressLine3 || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                Correspondence Address Line 1
              </p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.correspondenceAddressLine1 || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                Correspondence Address Line 2
              </p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.correspondenceAddressLine2 || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                Correspondence Address Line 3
              </p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.correspondenceAddressLine3 || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Religion</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.religion || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Caste</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.caste || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.category || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Mother Tongue</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.motherTongue || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Specially Challenged</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.speciallyChallenged ? "Yes" : "No"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Remarks</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.remarks || "N/A"}
              </p>
            </div>
            {/* <div className="space-y-1">
            <p className="text-sm text-gray-500">Languages</p>
            <p className="font-medium text-gray-800">
              {facultyDetails.data.languages || "N/A"}
            </p>
          </div> */}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Academic Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Program</p>
              <p className="font-medium text-gray-800">
                {facultyEducationDetails?.data?.Program || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">UsnSsn</p>
              <p className="font-medium text-gray-800">
                {facultyEducationDetails?.data.usnSsn || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">School College</p>
              <p className="font-medium text-gray-800">
                {facultyEducationDetails?.data.schoolCollege || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Specialization</p>
              <p className="font-medium text-gray-800">
                {facultyEducationDetails?.data.specialization || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Medium Of Instruction</p>
              <p className="font-medium text-gray-800">
                {facultyEducationDetails?.data.mediumOfInstruction || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Pass Class</p>
              <p className="font-medium text-gray-800">
                {facultyEducationDetails?.data.passClass || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Bank Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Bank Name</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.bankName || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Account Name</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.accountName || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Account Type</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.accountType || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Account Number</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.accountNo || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Branch</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.branch || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">IFSC</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.ifsc || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">PF Number</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.pfNumber || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">UAN Number</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.uanNumber || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Pension Number</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.pensionNumber || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Family Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Mother's Name</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.motherName || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Father's Name</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.fatherName || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Spouse Name</p>
              <p className="font-medium text-gray-800">
                {facultyDetails.data.spouseName || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
