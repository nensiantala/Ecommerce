"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, setAuthToken } from "../../lib/api";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/api/auth/register", { name, email, password });
      router.push("/auth/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-10 md:p-12">
        <h1 className="text-2xl font-bold text-black mb-10">Register</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black mb-3">Full Name</label>
            <input
              type="text"
              className="w-full border-2 border-gray-300 rounded-lg px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-black focus:border-black hover:border-gray-500 hover:shadow-sm transition-all duration-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-3">Email</label>
            <input
              type="email"
              className="w-full border-2 border-gray-300 rounded-lg px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-black focus:border-black hover:border-gray-500 hover:shadow-sm transition-all duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-3">Password</label>
            <input
              type="password"
              className="w-full border-2 border-gray-300 rounded-lg px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-black focus:border-black hover:border-gray-500 hover:shadow-sm transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-800 hover:shadow-xl hover:scale-105 transform transition-all duration-200 mt-4"
          >
            Register
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-black">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-black hover:text-gray-700 hover:underline font-medium transition-colors duration-200">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
