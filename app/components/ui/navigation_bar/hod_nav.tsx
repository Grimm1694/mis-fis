import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaChevronDown, FaChevronUp, FaBars, FaHome } from "react-icons/fa";
import { PiStudentBold, PiLadder } from "react-icons/pi";
import { RiSettings5Line} from "react-icons/ri";
import { GrCertificate, GrUpdate } from "react-icons/gr";
import { FcStatistics } from "react-icons/fc";
import { MdOutlineContactPhone } from "react-icons/md";
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
   
    <nav  ref={menuRef}
      className={`fixed top-20 bg-blue-600 text-white shadow-md transition-all duration-500 ${
        isExpanded ? "w-screen" : "w-12"} right-0`}
    >
      <div className="flex justify-between items-center px-4">
        {/* Menu Toggle Icon */}      
        {isExpanded  && (
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

            {/* Course mapping */}
            <li className="relative border border-gray-300 rounded hover:border-blue-500">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("coursemapping")}
              >
                <PiStudentBold className="text-sm" />
                <span className="text-sm">Course Mapping</span>
                {openMenu === "coursemapping" ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {openMenu === "coursemapping" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    { label: "Subject Master Table preperation", href: "/mis_hod/hod_home" },
                    { label: "Subject allocation to faculty", href: "/mis_hod/hod_home" },
                    { label: "Student Mentor mapping", href: "/mis_hod/hod_home" },
                    { label: "Course Registration", href: "/mis_hod/hod_home" },
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

            {/* Student admission and Fee detail */}
            <li className="relative border border-gray-300 rounded hover:border-blue-500">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("AdmTutionFee")}
              >
                <FcStatistics className="text-sm" />
                <span className="text-sm">Admission and Tution Fee</span>
                {openMenu === "AdmTutionFee" ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {openMenu === "AdmTutionFee" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    { label: "Tution Fee", href: "/mis_hod/accounts/acc_fee_demand_branch" },
                    { label: "Student Admission", href: "/mis_hod/hod_home" },
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
            
            {/* Student Attendence */}
            <li className="relative border border-gray-300 rounded hover:border-blue-500">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("Attendence")}
              >
                <FcStatistics className="text-sm" />
                <span className="text-sm">Attendence</span>
                {openMenu === "Attendence" ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {openMenu === "Attendence" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    { label: "Enabling", href: "/mis_hod/hod_home" },
                    { label: "Attendence Report", href: "/mis_hod/hod_home" },
                    { label: "Condonation", href: "/mis_hod/hod_home" },
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

            {/* Feedback */}
            <li className="relative border border-gray-300 rounded hover:border-blue-500">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("Feedback")}
              >
                <GrUpdate  className="text-sm"/>
                <span className="text-sm">Feedback</span>
                {openMenu === "Feedback" ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {openMenu === "Feedback" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    { label: "Report", href: "/mis_hod/hod_home" },
                    { label: "Schedule", href: "/mis_hod/hod_home" },
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

            {/* CIE */}
            <li className="relative border border-gray-300 rounded hover:border-blue-500">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("CIE")}
              >
                <PiLadder className="text-sm" />
                <span className="text-sm">CIE</span>
                {openMenu === "CIE" ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {openMenu === "CIE" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    { label: "Marks Entry", href: "/mis_hod/hod_home" },
                    { label: "Result statistics", href: "/mis_hod/hod_home" },
                    { label: "Student Academic Detail", href: "/mis_hod/hod_home" },
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
                {openMenu === "AcademicsR&D" ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {openMenu === "AcademicsR&D" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    { label: "Conference", href: "/mis_hod/hod_home" },
                    { label: "Journal", href: "/mis_hod/hod_home" },
                    { label: "Course attended", href: "/mis_hod/hod_home" },
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

            {/* Faculty_Detail */}
            <li className="relative border border-gray-300 rounded hover:border-blue-500">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("Faculty_Detail")}
              >
                <GrCertificate className="text-sm" />
                <span className="text-sm">Faculty Detail</span>
                {openMenu === "Faculty_Detail" ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {openMenu === "Faculty_Detail" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    { label: "Faculty Personal Information", href: "/mis_hod/hod_home" },
                    { label: "Education Detail", href: "/mis_hod/hod_home" },
                    { label: "Faculty LMS", href: "/mis_hod/hod_home" },
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
            
            {/* Consolidation */}
            <li className="relative border border-gray-300 rounded hover:border-blue-500">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("consolidation")}
              >
                <GrCertificate className="text-sm" />
                <span className="text-sm">Consolidation</span>
                {openMenu === "consolidation" ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </div>
              {openMenu === "consolidation" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    { label: "Faculty Personal List", href: "/mis_hod/facultypersonallist" },
                    { label: "Faculty Education List", href:  "/mis_hod/facultyedulist" },
                    { label: "Faculty Research List", href: "/mis_hod/facultyresearch" },
                    { label: "Faculty Academics List", href: "/mis_hod/facultyacademics" },
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
