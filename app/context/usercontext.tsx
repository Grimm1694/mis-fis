/* // context/UserContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextProps {
  user: { name: string; role: string; department: string;} | null;
  setUser: (user: { name: string; role: string, department: string }) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ name: string; role: string; department: string } | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}; */

// usercontext.tsx or wherever your user context is defined
//import React, { createContext, useContext, useState } from 'react';

"use client"
import { createContext, useContext, useState, ReactNode } from "react";
interface User {
  usno: string;
  name: string;
  role: string;
  department: string;
  emp_id: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
