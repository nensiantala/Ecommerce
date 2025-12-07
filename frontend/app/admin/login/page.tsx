"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, setAuthToken } from "../../lib/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tokenText, setTokenText] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTokenText(null);
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const res = await api.post('/api/auth/admin-login', { 
        email: email.toLowerCase().trim(), 
        password 
      });
      
      if (res.data && res.data.token) {
        const tok = res.data.token;
        // store token and set auth header
        localStorage.setItem('token', tok);
        setAuthToken(tok);
        // show token to user so they can copy if needed
        setTokenText(tok);
        setError(""); // Clear any previous errors
      } else {
        setError('Login successful but no token received');
      }
    } catch (err: any) {
      console.error('Admin login error:', err);
      // Provide more helpful error messages
      if (!err.response) {
        setError("Cannot connect to server. Please check your internet connection and ensure the backend is running.");
      } else if (err.response?.status === 0) {
        setError(err.response?.data?.message || "Cannot connect to backend API. Please check the server configuration.");
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'Admin login failed';
        // Provide helpful hints
        if (errorMessage.includes('Invalid admin credentials')) {
          setError('Invalid email or password. Make sure you have created an admin account using the createAdmin script.');
        } else {
          setError(errorMessage);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-10 md:p-12">
        <h1 className="text-2xl font-bold text-black mb-10">Admin Login</h1>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black mb-3">Email</label>
            <input 
              type="email" 
              className="w-full border-2 border-gray-300 rounded-lg px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-black focus:border-black hover:border-gray-500 hover:shadow-sm transition-all duration-200" 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-3">Password</label>
            <input 
              type="password" 
              className="w-full border-2 border-gray-300 rounded-lg px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-black focus:border-black hover:border-gray-500 hover:shadow-sm transition-all duration-200" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="flex items-center justify-end pt-2">
            <button 
              type="submit" 
              className="bg-black text-white px-10 py-3.5 rounded-lg font-semibold hover:bg-gray-800 hover:shadow-xl hover:scale-105 transform transition-all duration-200"
            >
              Admin Login
            </button>
          </div>
        </form>

        {tokenText && (
          <div className="mt-6 p-4 bg-gray-50 border rounded">
            <div className="text-sm font-medium mb-2">Admin token (copy/save):</div>
            <textarea readOnly value={tokenText} rows={4} className="w-full p-2 border rounded text-xs" />
            <div className="mt-2 flex space-x-2">
              <button onClick={() => { navigator.clipboard?.writeText(tokenText); }} className="px-3 py-1 bg-blue-600 text-white rounded">Copy Token</button>
              <button onClick={() => { localStorage.setItem('token', tokenText); setAuthToken(tokenText); router.push('/admin'); }} className="px-3 py-1 bg-green-600 text-white rounded">Go to Admin</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
