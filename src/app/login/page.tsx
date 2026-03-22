"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login(){

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleLogin = async(e:any)=>{
    e.preventDefault();

    const res = await fetch("/api/auth/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email,
        password
      })
    });

    const data = await res.json();

    if(res.ok){
      router.push("/dashboard");
    }
    else{
      alert(data.error);
    }
  };

  return(

    <main className="min-h-screen bg-black text-white flex items-center justify-center">

      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-10 rounded-xl w-[400px] space-y-4"
      >

        <h1 className="text-3xl font-bold text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 bg-black border border-gray-700 rounded"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <div className="space-y-1">
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-black border border-gray-700 rounded"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
          <div className="text-right">
            <Link
              href="/forgotpassword"
              className="text-sm text-purple-400 hover:text-purple-300 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          className="w-full bg-purple-600 py-3 rounded-lg hover:bg-purple-700"
        >
          Login
        </button>

      </form>

    </main>
  );
}