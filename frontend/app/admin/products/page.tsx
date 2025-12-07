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

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', description: '', price: 0, stock: 0, category: '', images: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    
    // Only fetch products if we have a token
    if (token) {
      fetchProducts();
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Ensure token is set before making the request
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setError('No authentication token found. Please login again.');
        router.push('/admin/login');
        return;
      }
      
      const res = await api.get('/api/products?page=1&limit=100');
      const productsData = res.data.products || res.data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
      console.log('Products loaded:', productsData.length);
    } catch (e: any) {
      console.error('Error fetching products:', e);
      const errorMsg = e.response?.data?.message || e.response?.data?.error || e.message || 'Failed to load products';
      setError(errorMsg);
      setProducts([]);
      
      // If unauthorized, redirect to login
      if (e.response?.status === 401 || e.response?.status === 403) {
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, images: form.images ? [form.images] : [] };
    try {
      // Ensure token is set before making the request
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        alert('No authentication token found. Please login again.');
        router.push('/admin/login');
        return;
      }

      console.log('Submitting product:', { editingId, payload });
      
      if (editingId) {
        const res = await api.put(`/api/products/${editingId}`, payload);
        console.log('Product updated successfully:', res.data);
        alert('Product updated successfully!');
      } else {
        const res = await api.post('/api/products', payload);
        console.log('Product created successfully:', res.data);
        alert('Product created successfully!');
      }
      setForm({ name: '', description: '', price: 0, stock: 0, category: '', images: '' });
      setEditingId(null);
      await fetchProducts();
    } catch (err: any) {
      console.error('Error saving product:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Unknown error';
      alert('Failed to save product: ' + errorMessage + '\n\nStatus: ' + (err.response?.status || 'N/A'));
      
      // If unauthorized, redirect to login
      if (err.response?.status === 401 || err.response?.status === 403) {
        router.push('/admin/login');
      }
    }
  };

  const handleEdit = (p: any) => {
    setEditingId(p._id || p.id);
    setForm({ name: p.name, description: p.description || '', price: p.price || 0, stock: p.stock || 0, category: p.category || '', images: (p.images && p.images[0]) || '' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete product?')) return;
    try {
      // Ensure token is set before making the request
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        alert('No authentication token found. Please login again.');
        router.push('/admin/login');
        return;
      }

      console.log('Deleting product:', id);
      const res = await api.delete(`/api/products/${id}`);
      console.log('Product deleted successfully:', res.data);
      alert('Product deleted successfully!');
      await fetchProducts();
    } catch (e: any) {
      console.error('Error deleting product:', e);
      console.error('Error response:', e.response?.data);
      const errorMessage = e.response?.data?.error || e.response?.data?.message || e.message || 'Unknown error';
      alert('Failed to delete product: ' + errorMessage + '\n\nStatus: ' + (e.response?.status || 'N/A'));
      
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
    <div className="cart-page-container justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Products</h1>
            {!loading && !error && (
              <div className="text-sm text-gray-600">
                Found {products.length} product{products.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          <button 
            onClick={fetchProducts} 
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
            <button onClick={fetchProducts} className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm">
              Retry
            </button>
          </div>
        )}

        <div className="flex justify-center mb-8">
          <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-6 border rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Name" className="border p-3 rounded" />
              <input value={form.category} onChange={e=>setForm({...form, category:e.target.value})} placeholder="Category" className="border p-3 rounded" />
              <input type="number" value={form.price} onChange={e=>setForm({...form, price: Number(e.target.value)})} placeholder="Price" className="border p-3 rounded" />
              <input type="number" value={form.stock} onChange={e=>setForm({...form, stock: Number(e.target.value)})} placeholder="Stock" className="border p-3 rounded" />
              <input value={form.images} onChange={e=>setForm({...form, images: e.target.value})} placeholder="Image URL" className="border p-3 rounded col-span-2" />
              <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} placeholder="Description" className="border p-3 rounded col-span-2" rows={4} />
              <div className="col-span-2 flex gap-2">
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">{editingId? 'Save' : 'Add Product'}</button>
                {editingId && <button type="button" onClick={()=>{setEditingId(null); setForm({ name: '', description: '', price: 0, stock: 0, category: '', images: '' })}} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>}
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-dark mx-auto mb-4"></div>
                <p>Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 border rounded">
                <p className="text-gray-600 mb-4">No products found.</p>
                <p className="text-sm text-gray-500">Add your first product using the form above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map(p=> (
                <div key={p._id || p.id} className="border p-4 rounded flex justify-between items-center hover:shadow-md transition-shadow">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-gray-600">{p.category} — ₹{p.price}</div>
                  </div>
                  <div className="space-x-2">
                    <button onClick={()=>handleEdit(p)} className="px-3 py-1 bg-yellow-400 rounded">Edit</button>
                    <button onClick={()=>handleDelete(p._id || p.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
