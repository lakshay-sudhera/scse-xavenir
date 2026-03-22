"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface UserData {
  email: string;
  role: string;
  userID: string;
  fullName: string;
  collegeName: string;
  isPrime: boolean;
  isNitian: boolean;
  isFromCse: boolean;
  b1: boolean;
  b2: boolean;
  x: boolean;
}

interface UserContextValue {
  userData: UserData | null;
  setUserData: (userData: UserData | null) => void;
}

export const UserContext = createContext<UserContextValue>({
  userData: null,
  setUserData: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/users/getCurrent");
        setUserData(response.data.data);
      }
       catch (error) {
        setUserData(null);
      }
    };
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}


// "use client";

// import {
//   createContext,
//   useState,
//   useEffect,
//   ReactNode,
//   useContext,
//   useMemo,
// } from "react";
// import axios from "axios";

// interface UserData {
//   email: string;
//   role: string;
//   userID: string;
//   fullName: string;
//   collegeName: string;
//   isPrime: boolean;
//   isNitian: boolean;
//   isFromCse: boolean;
//   b1: boolean;
//   b2: boolean;
//   x: boolean;
// }

// interface UserContextValue {
//   userData: UserData | null;
//   setUserData: (userData: UserData | null) => void;
//   loading: boolean;
// }

// export const UserContext = createContext<UserContextValue | null>(null);

// export function UserProvider({ children }: { children: ReactNode }) {
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get("/api/users/getCurrent");
//         setUserData(response.data.data);
//       } catch {
//         setUserData(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserData();
//   }, []);

//   const value = useMemo(
//     () => ({ userData, setUserData, loading }),
//     [userData, loading]
//   );

//   return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
// }

// // safer usage
// export function useUser() {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error("useUser must be used inside UserProvider");
//   }
//   return context;
// }