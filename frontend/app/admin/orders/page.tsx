"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, initAuth } from "../../lib/api";

function decodeIsAdmin() {
  try {
    const t = localStorage.getItem('token');
    if (!t) return false;
    const payload = JSON.parse(atob(t.split('.')[1]));
    return payload?.isAdmin;
  } catch (e) {
    return false;
  }
}

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize auth and ensure token is set
    initAuth();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const adminStatus = decodeIsAdmin();
    setIsAdmin(adminStatus);
    
    if (!adminStatus) {
      router.push('/admin/login');
      return;
    }
    
    // Only fetch orders if we have a token
    if (token) {
      fetchOrders();
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Ensure token is set before making the request
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        alert('No authentication token found. Please login again.');
        router.push('/admin/login');
        return;
      }
      
      const res = await api.get('/api/orders');
      const ordersData = res.data.orders || res.data || [];
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (e: any) {
      console.error('Error fetching orders:', e);
      const errorMessage = e.response?.data?.message || e.response?.data?.error || e.message || 'Unknown error';
      alert('Failed to load orders: ' + errorMessage);
      setOrders([]);
      
      // If unauthorized, redirect to login
      if (e.response?.status === 401 || e.response?.status === 403) {
        router.push('/admin/login');
      }
    } finally { setLoading(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/api/orders/${id}/status`, { status });
      fetchOrders();
    } catch (e) { console.error(e); }
  };

  if (!mounted) {
    return (
      <div className="cart-page-container">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-dark mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="cart-page-container">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-dark mx-auto mb-4"></div>
            <p>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 border rounded">
            <p className="text-gray-600 mb-4">No orders found.</p>
            <p className="text-sm text-gray-500">Orders will appear here when customers place them.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(o => (
            <div key={o._id || o.id} className="border p-3 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">Order #{o._id || o.id}</div>
                  <div className="text-sm text-gray-600">User: {o.user?.name || o.user?.email || o.user}</div>
                  <div className="text-sm text-gray-600">Total: ₹{o.total}</div>
                  <div className="text-sm text-gray-600">Items: {o.items?.length || 0}</div>
                </div>
                <div className="space-x-2">
                  <select value={o.status} onChange={e=>updateStatus(o._id||o.id, e.target.value)} className="border p-1">
                    <option value="pending">pending</option>
                    <option value="processing">processing</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-700">
                {o.items && o.items.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <div>{it.name} x{it.quantity}</div>
                    <div>₹{it.price}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}
