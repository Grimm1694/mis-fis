import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaChevronDown, FaChevronUp, FaBars, FaHome } from "react-icons/fa";
import { PiStudentBold, PiLadder } from "react-icons/pi";
import { GrCertificate, GrUpdate } from "react-icons/gr";
import { FcStatistics } from "react-icons/fc";
import { useUser } from "../../../context/usercontext";

const HorizontalNavbar: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();

  const toggleMenu = () => {
    setIsExpanded((prev) => !prev);
  };


  const toggleSubmenu = (menu: string) => {
    setOpenMenu((prevMenu) => (prevMenu === menu ? null : menu));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  

  return (
    <nav
      ref={menuRef}
      className={`fixed top-20 bg-blue-600 text-white shadow-md transition-all duration-500 ${
        isExpanded ? "w-screen" : "w-12"
      } right-0`}
    >
      <div className="flex justify-between items-center px-4">
        {/* Menu Toggle Icon */}
        {isExpanded && (
          <ul
            className={`flex items-center  transition-all ${
              isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Home */}
            <li className="relative border border-gray-300 rounded hover:border-blue-500">
              {/* <Link href="/admission/adm_home"> */}
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded">
                <FaHome className="text-sm" />
                <span className="text-sm">Home</span>
              </div>
              {/* </Link> */}
            </li>

            {/* my courses */}
            <li className="relative border border-gray-300 rounded hover:border-blue-500">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("myCourses")}
              >
                <PiStudentBold className="text-sm" />
                <span className="text-sm">My Courses</span>
                {openMenu === "myCourses" ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {openMenu === "myCourses" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    {
                      label: "Subjects Hadling",
                      href: "/admission/adm_master_data_fetch",
                    },
                    {
                      label: "List of Students",
                      href: "/admission/adm_import_excel",
                    },
                  ].map((item) => (
                    <li
                      key={item.label}
                      className="hover:bg-gray-200 px-2 py-2 whitespace-nowrap"
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Student Attendence */}
            <li className="relative border border-gray-300 rounded hover:border-blue-500">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("Student_Attendence")}
              >
                <FcStatistics className="text-sm" />
                <span className="text-sm">Student Attendence</span>
                {openMenu === "Student_Attendence" ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </div>
              {openMenu === "Student_Attendence" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    {
                      label: "Mark Daily Attendence",
                      href: "/admission/adm_statistics_branch",
                    },
                    {
                      label: "Attendence Report",
                      href: "/admission/adm_statistics_category",
                    },
                    {
                      label: "Individual Attendence",
                      href: "/admission/adm_statistics_quota",
                    },
                  ].map((item) => (
                    <li
                      key={item.label}
                      className="hover:bg-gray-200 px-4 py-2 whitespace-nowrap"
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* CIE marks entry */}
            <li className="relative border border-gray-300 rounded hover:border-blue-500">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("CIE")}
              >
                <GrUpdate className="text-sm" />
                <span className="text-sm">CIE</span>
                {openMenu === "CIE" ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {openMenu === "CIE" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    {
                      label: "Update COB Branch/USNO",
                      href: "/admission/adm_cob_usno_brcode",
                    },
                    {
                      label: "Update New USNO",
                      href: "/admission/adm_vtu_usno_update",
                    },
                  ].map((item) => (
                    <li
                      key={item.label}
                      className="hover:bg-gray-200 px-4 py-2 whitespace-nowrap"
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Mentee */}
            <li className="relative border border-gray-300 rounded hover:border-blue-500">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("Mentee")}
              >
                <PiLadder className="text-sm" />
                <span className="text-sm">Mentee</span>
                {openMenu === "Mentee" ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {openMenu === "Mentee" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    {
                      label: "Mark Dropout",
                      href: "/admission/adm_dropout_mark",
                    },
                    {
                      label: "Eligibility Update",
                      href: "/admission/adm_eligibility_update",
                    },
                  ].map((item) => (
                    <li
                      key={item.label}
                      className="hover:bg-gray-200 px-4 py-2 whitespace-nowrap"
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Academics and R&D */}
            <li className="relative border border-gray-300 rounded hover:border-blue-500">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("AcademicsR&D")}
              >
                <GrCertificate className="text-sm" />
                <span className="text-sm">Academics and R&D</span>
                {openMenu === "AcademicsR&D" ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </div>
              {openMenu === "AcademicsR&D" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    {
                      label: "Bonafied Certificate",
                      href: "/admission/adm_certificate_bonafied",
                    },
                    {
                      label: "Study Certificate",
                      href: "/admission/adm_study_certificate",
                    },
                    {
                      label: "Transfer Certificate",
                      href: "/admission/adm_certificate_tc",
                    },
                  ].map((item) => (
                    <li
                      key={item.label}
                      className="hover:bg-gray-200 px-4 py-2 whitespace-nowrap"
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Profile */}
            <li className="relative border border-gray-300 rounded hover:border-blue-500">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("Profile")}
              >
                <GrCertificate className="text-sm" />
                <span className="text-sm">Profile</span>
                {openMenu === "Profile" ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {openMenu === "Profile" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    {
                      label: "Personal",
                      href: "/mis_faculty/profile",
                    },
                    {
                      label: "Academics",
                      href: "/mis_faculty/profile/academics-details",
                    },
                    {
                      label: "Research",
                      href: "/mis_faculty/profile/research-details",
                    },
                  ].map((item) => (
                    <li
                      key={item.label}
                      className="hover:bg-gray-200 px-4 py-2 whitespace-nowrap"
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* HoD role */}
            {user?.role === "hod" && ( // Conditionally render the menu for Admin role
              <li className="relative border border-gray-300 rounded hover:border-blue-500">
                <Link href="/mis_hod/hod_home">
                  <div className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded">
                    <FaHome className="text-sm" />
                    <span className="text-sm">HoD</span>
                  </div>
                </Link>
              </li>
            )}
          </ul>
        )}
        <button
          onClick={toggleMenu}
          className="text-xl pt-2 pb-2 focus:outline-none"
        >
          <FaBars />
        </button>
      </div>
    </nav>
  );
};

export default HorizontalNavbar;
