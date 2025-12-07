"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthToken } from "../../lib/api";

export default function SetTokenPage() {
  const [token, setToken] = useState("");
  const router = useRouter();

  const handleSet = () => {
    try {
      localStorage.setItem('token', token.trim());
      setAuthToken(token.trim());
      // navigate to admin dashboard
      router.push('/admin');
    } catch (e) {
      alert('Failed to set token');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white border rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Set Admin Token</h2>
        <p className="text-sm text-gray-600 mb-4">Paste the full JWT token you received from the admin login API, then click <b>Set Token</b>.</p>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={6}
          className="w-full p-3 border rounded mb-4"
          placeholder="paste token here"
        />
        <div className="flex space-x-2">
          <button onClick={handleSet} className="px-4 py-2 bg-black text-white rounded">Set Token</button>
          <button onClick={() => { setToken(''); localStorage.removeItem('token'); setAuthToken(null); }} className="px-4 py-2 border rounded">Clear</button>
        </div>
        <p className="mt-4 text-sm text-gray-500">After setting, you'll be redirected to <code>/admin</code>.</p>
      </div>
    </div>
  );
}
