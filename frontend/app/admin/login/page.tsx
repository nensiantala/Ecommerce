"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, setAuthToken } from "../../lib/api";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setAuthToken(res.data.token);
      // Redirect admins to the admin dashboard, others to products
      const isAdmin = res.data.user?.isAdmin;
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/products');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      // Provide more helpful error messages
      if (!err.response) {
        setError("Cannot connect to server. Please check your internet connection and ensure the backend is running.");
      } else if (err.response?.status === 0) {
        setError(err.response?.data?.message || "Cannot connect to backend API. Please check the server configuration.");
      } else {
        setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-10 md:p-12">
        <h1 className="text-2xl font-bold text-black mb-10">Login</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="flex items-center justify-between pt-2">
            <Link href="#" className="text-sm text-black hover:text-gray-700 hover:underline transition-colors duration-200">
              Forgot Password?
            </Link>
            <button
              type="submit"
              className="bg-black text-white px-10 py-3.5 rounded-lg font-semibold hover:bg-gray-800 hover:shadow-xl hover:scale-105 transform transition-all duration-200"
            >
              Login
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-black">
          New user?{" "}
          <Link href="/auth/register" className="text-black hover:text-gray-700 hover:underline font-medium transition-colors duration-200">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
