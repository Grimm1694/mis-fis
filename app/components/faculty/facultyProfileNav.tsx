"use client";

import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";

export function FacultyProfileNav() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const facultyId = searchParams.get("facultyId");

  if (!facultyId) {
    throw new Error("Faculty ID is missing in URL parameters.");
  }

  return (
    <nav className="flex items-center justify-end gap-4 mr-4 mt-2 text-xl text-blue-500 font-bold">
      <Link
        className={`link hover:underline underline-offset-3 ${
          pathname === "/faculty" ? "text-purple-500" : ""
        }`}
        href={`/faculty`}
      >
        Home
      </Link>
      <Link
        className={`link hover:underline underline-offset-3 ${
          pathname === "/faculty/profile" ? "text-purple-500" : ""
        }`}
        href={`/faculty/profile?facultyId=${facultyId}`}
      >
        Personal Details
      </Link>
      <Link
        className={`link hover:underline underline-offset-3 ${
          pathname === "/faculty/profile/academic-details"
            ? "text-purple-500"
            : ""
        }`}
        href={`/faculty/profile/academic-details?facultyId=${facultyId}`}
      >
        Academic Details
      </Link>
      <Link
        className={`link hover:underline underline-offset-3 ${
          pathname === "/faculty/profile/research-details"
            ? "text-purple-500"
            : ""
        }`}
        href={`/faculty/profile/research-details?facultyId=${facultyId}`}
      >
        Research Details
      </Link>
    </nav>
  );
}
