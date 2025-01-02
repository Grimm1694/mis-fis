"use client"
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaChevronDown, FaChevronUp, FaBars, FaHome } from "react-icons/fa";
import { PiStudentBold, PiLadder } from "react-icons/pi";
import { RiSettings5Line } from "react-icons/ri";
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
    <nav
      ref={menuRef}
      className={`fixed top-20 bg-blue-600 text-white shadow-md transition-all duration-500 ${
        isExpanded ? "w-screen" : "w-12"
      } right-0`}
    >
      <div className="flex justify-between items-center px-4">
        <button
          onClick={toggleMenu}
          className="text-xl pt-2 pb-2 focus:outline-none"
        >
          <FaBars />
        </button>

        {isExpanded && (
          <ul
            className={`flex items-center space-x-4 transition-all ${
              isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Home */}
            <li className="relative border border-gray-300 rounded hover:border-blue-500">
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded">
                <FaHome className="text-sm" />
                <span className="text-sm">Home</span>
              </div>
            </li>

            {/* Course Mapping */}
            <li className="relative border border-gray-300 rounded hover:border-blue-500">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("coursemapping")}
              >
                <PiStudentBold className="text-sm" />
                <span className="text-sm">Course Mapping</span>
                {openMenu === "coursemapping" ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </div>
              {openMenu === "coursemapping" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    { label: "Subject Master Table Preparation", href: "/course/master" },
                    { label: "Subject Allocation to Faculty", href: "/course/allocation" },
                    { label: "Student Mentor Mapping", href: "/course/mentor" },
                    { label: "Course Registration", href: "/course/registration" },
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
                    { label: "Faculty Personal List", href: "/mis_principal/facultypersonallist" },
                    { label: "Faculty Education List", href:  "/mis_principal/facultyedulist" },
                    { label: "Faculty Research List", href: "/mis_principal/facultyresearch" },
                    { label: "Faculty Academics List", href: "/mis_principal/facultyacademics" },
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
                    { label: "Marks Entry", href: "/cie/marks-entry" },
                    { label: "Result Statistics", href: "/cie/statistics" },
                    { label: "Student Academic Details", href: "/cie/academic-details" },
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

            {/* Feedback */}
            <li className="relative border border-gray-300 rounded hover:border-blue-500">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-500 py-2 px-2 rounded"
                onClick={() => toggleSubmenu("Feedback")}
              >
                <GrUpdate className="text-sm" />
                <span className="text-sm">Feedback</span>
                {openMenu === "Feedback" ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {openMenu === "Feedback" && (
                <ul className="absolute left-0 bg-white text-black mt-2 shadow-lg rounded z-50">
                  {[
                    { label: "Report", href: "/feedback/report" },
                    { label: "Schedule", href: "/feedback/schedule" },
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
      </div>
    </nav>
  );
};

export default HorizontalNavbar;
