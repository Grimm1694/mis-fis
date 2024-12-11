import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaChevronDown, FaChevronUp, FaBars, FaHome } from "react-icons/fa";
import { PiStudentBold, PiLadder } from "react-icons/pi";
import { RiSettings5Line} from "react-icons/ri";
import { GrCertificate, GrUpdate } from "react-icons/gr";
import { FcStatistics } from "react-icons/fc";
import { MdOutlineContactPhone } from "react-icons/md";
import { useUser } from "../../../context/usercontext";
import { Router, useRouter } from "next/navigation";

const HorizontalNavbar: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
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
            <li className="relative">
              <Link href="/mis_admission/adm_home">
                <div className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded">
                  <FaHome className="text-sm" />
                  <span className="text-sm">Home</span>
                </div>
              </Link>
            </li>

            {/* Student Information */}
            <li className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("Student_Information")}
              >
                <PiStudentBold className="text-sm" />
                <span className="text-sm">Student Information</span>
                {openMenu === "Student_Information" ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </div>
              {openMenu === "Student_Information" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    {
                      label: "View Master Data",
                      href: "/mis_admission/adm_master_data_fetch",
                    },
                    {
                      label: "Import From Excel",
                      href: "/mis_admission/adm_import_excel",
                    },
                    {
                      label: "Student Information (UG)",
                      href: "/mis_admission/adm_student_information/ug",
                    },
                    {
                      label: "Student Information (PG)",
                      href: "/mis_admission/adm_student_information/pg",
                    },
                    {
                      label: "Student Information (WP)",
                      href: "/mis_admission/adm_student_information/wp",
                    },
                    {
                      label: "Student Information (PhD)",
                      href: "/mis_admission/adm_student_information/phd",
                    },
                    {
                      label: "Scan Photo",
                      href: "/mis_admission/adm_scan_photo",
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

            {/* Admission Statistics */}
            <li className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("Admission_Statistics")}
              >
                <FcStatistics className="text-sm" />
                <span className="text-sm">Admission Statistics</span>
                {openMenu === "Admission_Statistics" ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </div>
              {openMenu === "Admission_Statistics" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    {
                      label: "Branch wise Admissions",
                      href: "/mis_admission/adm_statistics_branch",
                    },
                    {
                      label: "Category wise Admissions",
                      href: "/mis_admission/adm_statistics_category",
                    },
                    {
                      label: "Quota wise Statistics",
                      href: "/mis_admission/adm_statistics_quota",
                    },
                    {
                      label: "Rank Statistics",
                      href: "/mis_admission/adm_rank_statistics",
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

            {/* VTU usno update */}
            <li className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("VTUUsnoUpdate")}
              >
                <GrUpdate className="text-sm" />
                <span className="text-sm">COB/VTU USN Update</span>
                {openMenu === "VTUUsnoUpdate" ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </div>
              {openMenu === "VTUUsnoUpdate" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    {
                      label: "Update COB Branch/USNO",
                      href: "/mis_admission/adm_cob_usno_brcode",
                    },
                    {
                      label: "Update New USNO",
                      href: "/mis_admission/adm_vtu_usno_update",
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

            {/* Vertical Progression and Eligibility */}
            <li className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("VerticalProgression")}
              >
                <PiLadder className="text-sm" />
                <span className="text-sm">Vertical Progression</span>
                {openMenu === "VerticalProgression" ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </div>
              {openMenu === "VerticalProgression" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    {
                      label: "Mark Dropout",
                      href: "/mis_admission/adm_dropout_mark",
                    },
                    {
                      label: "Eligibility Update",
                      href: "/mis_admission/adm_eligibility_update",
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

            {/* Admission Certificates */}
            <li className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("Admission_Certificates")}
              >
                <GrCertificate className="text-sm" />
                <span className="text-sm">Certificates</span>
                {openMenu === "Admission_Certificates" ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </div>
              {openMenu === "Admission_Certificates" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    {
                      label: "Bonafied Certificate",
                      href: "/mis_admission/adm_certificate_bonafied",
                    },
                    {
                      label: "Study Certificate",
                      href: "/mis_admission/adm_study_certificate",
                    },
                    {
                      label: "Transfer Certificate",
                      href: "/mis_admission/adm_certificate_tc",
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
            {/* Contact */}
            <li className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("Contact")}
              >
                <MdOutlineContactPhone className="text-sm" />
                <span className="text-sm">Contact</span>
                {openMenu === "Contact" ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {openMenu === "Contact" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    { label: "E-mail", href: "/mis_admission/adm_sendEmail" },
                    {
                      label: "Message",
                      href: "/mis_admission/adm_sendMessage",
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

            {/* Actions */}
            <li className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => router.push("/mis_est/actions")}
              >
                <MdOutlineContactPhone className="text-sm" />
                <span className="text-sm">Actions</span>
              </div>
            </li>

            {/* Faculty Registration */}
            <li className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => router.push("/faculty")}
              >
                <MdOutlineContactPhone className="text-sm" />
                <span className="text-sm">Faculty Registration</span>
              </div>
            </li>

            {/* Settings */}
            {user?.role === "adm_admin" && ( // Conditionally render the menu for Admin role
              <li className="relative">
                <div
                  className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                  onClick={() => toggleSubmenu("Settings")}
                >
                  <RiSettings5Line className="text-sm" />
                  <span className="text-sm">Settings</span>
                  {openMenu === "Settings" ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </div>
                {openMenu === "Settings" && (
                  <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                    {[
                      {
                        label: "User Management",
                        href: "/mis_admission/adm_user_mgmt",
                      },
                      {
                        label: "Student Intake Management",
                        href: "/mis_admission/adm_intake_fetch",
                      },
                      {
                        label: "Branch Management",
                        href: "/mis_admission/adm_branch",
                      },
                      {
                        label: "Save Old USNO",
                        href: "/mis_admission/adm_save_oldusno",
                      },
                      {
                        label: "Mark Change of Branch",
                        href: "/mis_admission/adm_cob_mark",
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
