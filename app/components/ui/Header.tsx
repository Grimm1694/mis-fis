import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import drait from '@/app/assets/full_logo-wide.png';

interface HeaderProps {
  user: { usno: string; name: string; role: string; department: string; emp_id: string; } | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  // Initialize state from sessionStorage directly
  const [sessionUser, setSessionUser] = useState<{ usno: string; name: string; department: string; role: string; emp_id: string; } | null>(() => {
    const savedUSNO = sessionStorage.getItem('usno');
    const savedUserName = sessionStorage.getItem('userName');
    const savedDepartmentName = sessionStorage.getItem('departmentName');
    const savedRole = sessionStorage.getItem('userRole');
    const savedId = sessionStorage.getItem('emp_id');
    return savedUSNO &&
      savedUserName &&
      savedDepartmentName &&
      savedRole &&
      savedId 
      ? {
          usno: savedUSNO,
          name: savedUserName,
          department: savedDepartmentName,
          role: savedRole,
          emp_id: savedId,
        }
      : null;
  });

  // Sync sessionUser with user prop
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('usno', user.usno);
      sessionStorage.setItem('userName', user.name);
      sessionStorage.setItem('departmentName', user.department);
      sessionStorage.setItem('userRole', user.role);
      sessionStorage.setItem('emp_id', user.emp_id);
      setSessionUser(user);
    }
  }, [user]);

  // Handle logout and clear session storage and state
  const handleLogout = () => {
    sessionStorage.removeItem('usno');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('departmentName');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('emp_id');
    setSessionUser(null); // Clear state on logout
    onLogout(); // Callback to parent for additional logout actions
  };

  return (
    <header className="bg-gradient-to-r fixed from-white from-25% via-blue-500 to-purple-600 flex items-center justify-between px-4 py-2 top-0 left-0 z-50 w-screen">
      <Image src={drait} width={400} height={500} alt="drait logo wide" />
      <div className="flex flex-col items-start text-white ml-4">
        <h1 className="relative z-10 text-3xl font-bold mb-1">
          {sessionUser ? sessionUser.department : 'Department'}
        </h1>
        {sessionUser && (
          <div className="flex items-center text-sm">
            <span>Welcome, {sessionUser.name}</span>
            <Link href="/" passHref>
              <span
                onClick={handleLogout}
                className="ml-2 cursor-pointer text-blue-200 hover:text-blue-400 underline"
              >
                Logout
              </span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;



/* import React from "react";
import Image from "next/image";
import drait from "@/app/assets/full_logo-wide.png";

const Header = () => {
  return (
    <header className="bg-gradient-to-r fixed from-white from-25% via-blue-500 to-purple-600 flex items-center justify-between px-4 py-2 top-0 left-0 z-50 w-screen">
      <Image src={drait} width={400} height={500} alt="drait logo wide" />
      <h1 className="relative z-10 text-3xl font-bold text-white">Admission</h1>  
    </header>
  );
};

export default Header; */

/* import React from 'react';
import Image from 'next/image';
import drait from '@/app/assets/full_logo-wide.png';

interface HeaderProps {
  user: { name: string; role: string; department: string } | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-gradient-to-r fixed from-white from-25% via-blue-500 to-purple-600 flex items-center justify-between px-4 py-2 top-0 left-0 z-50 w-screen">
      <Image src={drait} width={400} height={500} alt="drait logo wide" />
      <div className="flex flex-col items-start text-white ml-4">
        <h1 className="relative z-10 text-3xl font-bold mb-1">
          {user ? user.department : 'Department'}
        </h1>
        {user && (
          <div className="flex items-center text-sm">
            <span>Welcome, {user.name}</span>
            <a
              onClick={onLogout}
              className="ml-2 cursor-pointer text-blue-200 hover:text-blue-400 underline"
            >
              Logout
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; */

/* import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import drait from '@/app/assets/full_logo-wide.png';

interface HeaderProps {
  user: { name: string; role: string; department: string } | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-gradient-to-r fixed from-white from-25% via-blue-500 to-purple-600 flex items-center justify-between px-4 py-2 top-0 left-0 z-50 w-screen">
      <Image src={drait} width={400} height={500} alt="drait logo wide" />
      <div className="flex flex-col items-start text-white ml-4">
        <h1 className="relative z-10 text-3xl font-bold mb-1">
          {user ? user.department : 'Department'}
        </h1>
        {user && (
          <div className="flex items-center text-sm">
            <span>Welcome, {user.name}</span>
            <Link href="/" passHref>
              <span
                onClick={onLogout}
                className="ml-2 cursor-pointer text-blue-200 hover:text-blue-400 underline"
              >
                Logout
              </span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; */



