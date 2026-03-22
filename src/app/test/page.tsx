"use client";

import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

export default function TestPage() {
  const { userData } = useContext(UserContext);

  console.log("USER DATA:", userData);

  return (
    <div>
      <h1>Testing UserContext</h1>

      {userData ? (
        <p>{userData.fullName}</p>
      ) : (
        <p>No user found</p>
      )}
    </div>
  );
}