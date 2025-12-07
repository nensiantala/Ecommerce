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

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
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
    
    // Only fetch users if we have a token
    if (token) {
      fetchUsers();
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Ensure token is set before making the request
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        alert('No authentication token found. Please login again.');
        router.push('/admin/login');
        return;
      }
      
      const res = await api.get('/api/users');
      const usersData = res.data.users || res.data || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (e: any) {
      console.error('Error fetching users:', e);
      const errorMessage = e.response?.data?.message || e.response?.data?.error || e.message || 'Unknown error';
      alert('Failed to load users: ' + errorMessage);
      setUsers([]);
      
      // If unauthorized, redirect to login
      if (e.response?.status === 401 || e.response?.status === 403) {
        router.push('/admin/login');
      }
    } finally { setLoading(false); }
  };

  const toggleAdmin = async (u: any) => {
    try {
      // Ensure token is set before making the request
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        alert('No authentication token found. Please login again.');
        router.push('/admin/login');
        return;
      }

      console.log('Toggling admin status for user:', u._id || u.id, 'New status:', !u.isAdmin);
      const res = await api.put(`/api/users/${u._id || u.id}`, { isAdmin: !u.isAdmin });
      console.log('User updated successfully:', res.data);
      await fetchUsers();
    } catch (e: any) {
      console.error('Error toggling admin status:', e);
      console.error('Error response:', e.response?.data);
      const errorMessage = e.response?.data?.error || e.response?.data?.message || e.message || 'Unknown error';
      alert('Failed to update user: ' + errorMessage);
      
      // If unauthorized, redirect to login
      if (e.response?.status === 401 || e.response?.status === 403) {
        router.push('/admin/login');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete user? This action cannot be undone.')) return;
    try {
      // Ensure token is set before making the request
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        alert('No authentication token found. Please login again.');
        router.push('/admin/login');
        return;
      }

      console.log('Deleting user:', id);
      const res = await api.delete(`/api/users/${id}`);
      console.log('User deleted successfully:', res.data);
      alert('User deleted successfully!');
      await fetchUsers();
    } catch (e: any) {
      console.error('Error deleting user:', e);
      console.error('Error response:', e.response?.data);
      const errorMessage = e.response?.data?.error || e.response?.data?.message || e.message || 'Unknown error';
      alert('Failed to delete user: ' + errorMessage + '\n\nStatus: ' + (e.response?.status || 'N/A'));
      
      // If unauthorized, redirect to login
      if (e.response?.status === 401 || e.response?.status === 403) {
        router.push('/admin/login');
      }
    }
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
        <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-dark mx-auto mb-4"></div>
            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 border rounded">
            <p className="text-gray-600 mb-4">No users found.</p>
            <p className="text-sm text-gray-500">Users will appear here when they register.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map(u => (
            <div key={u._id || u.id} className="border p-3 rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">{u.name} <span className="text-sm text-gray-600">({u.email})</span></div>
                <div className="text-sm text-gray-600">Admin: {u.isAdmin ? 'Yes' : 'No'}</div>
              </div>
              <div className="space-x-2">
                <button onClick={()=>toggleAdmin(u)} className="px-3 py-1 bg-blue-500 text-white rounded">Toggle Admin</button>
                <button onClick={()=>handleDelete(u._id || u.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}
