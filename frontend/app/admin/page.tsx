"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { initAuth } from "../lib/api";

function parseTokenPayload(token: string | null) {
  try {
    if (!token) return null;
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      initAuth();
      const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const p = parseTokenPayload(t);
      setPayload(p);
      console.log('Admin page - Token payload:', p);
    } catch (err) {
      console.error('Error parsing token:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  if (!mounted || loading) {
    return (
      <div className="cart-page-container">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-dark mx-auto mb-4"></div>
            <p>Checking admin status...</p>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = payload?.isAdmin === true;

  if (!isAdmin) {
    return (
      <div className="cart-page-container">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-2xl font-bold mb-4">Admin access required</h1>
          <p className="mb-4">You are not logged in as an admin. Please log in using an admin account.</p>
          <div className="space-x-2">
            <Link href="/admin/login" className="px-4 py-2 bg-black text-white rounded">Admin Login</Link>
            <Link href="/auth/login" className="px-4 py-2 border rounded">User Login</Link>
          </div>
          <div className="mt-6 p-4 bg-gray-50 border">
            <div className="text-sm text-gray-700">Token payload (debug):</div>
            <pre className="text-xs mt-2 p-2 bg-white border rounded">{JSON.stringify(payload, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold mb-12 text-center">Admin Dashboard</h1>
        
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          <Link 
            href="/admin/products" 
            className="block p-6 border-2 border-gray-200 rounded-lg hover:border-luxury-dark hover:bg-gray-50 transition-all shadow-sm bg-white text-center"
          >
            <div className="mb-3 flex justify-center">
              <svg className="w-8 h-8 text-luxury-dark mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-luxury-dark">Manage Products</h2>
            <p className="text-sm text-gray-600">Add, edit, or delete products</p>
          </Link>
          
          <Link 
            href="/admin/users" 
            className="block p-6 border-2 border-gray-200 rounded-lg hover:border-luxury-dark hover:bg-gray-50 transition-all shadow-sm bg-white text-center"
          >
            <div className="mb-3 flex justify-center">
              <svg className="w-8 h-8 text-luxury-dark mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-luxury-dark">Manage Users</h2>
            <p className="text-sm text-gray-600">View and manage user accounts</p>
          </Link>
          
          <Link 
            href="/admin/orders" 
            className="block p-6 border-2 border-gray-200 rounded-lg hover:border-luxury-dark hover:bg-gray-50 transition-all shadow-sm bg-white text-center"
          >
            <div className="mb-3 flex justify-center">
              <svg className="w-8 h-8 text-luxury-dark mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-luxury-dark">Manage Orders</h2>
            <p className="text-sm text-gray-600">View and update order status</p>
          </Link>
          </div>
        </div>

        {/* Debug info - can be removed later */}
        <div className="flex justify-center mt-8">
          <div className="p-4 bg-gray-50 border rounded text-sm w-full max-w-4xl text-center">
            <p className="font-semibold mb-2">Debug Info:</p>
            <p>Admin Status: {isAdmin ? '✅ Authenticated' : '❌ Not authenticated'}</p>
            <p>Token exists: {payload ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
