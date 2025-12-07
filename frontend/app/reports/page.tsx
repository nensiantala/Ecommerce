"use client";

import { useEffect, useState } from "react";
import { api, initAuth } from "../lib/api";
import { useRouter } from "next/navigation";

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

export default function ReportsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [dailyRevenue, setDailyRevenue] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [categorySales, setCategorySales] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);

    initAuth();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const adminStatus = decodeIsAdmin();
    setIsAdmin(adminStatus);

    if (!adminStatus) {
      router.push("/admin/login");
      return;
    }

    if (token) {
      fetchReports();
    } else {
      router.push("/admin/login");
    }
  }, [router]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        alert("No authentication token found. Please login again.");
        router.push("/admin/login");
        return;
      }

      const res = await api.get("/api/reports/all");

      setDailyRevenue(res.data.dailyRevenue || []);
      setTopCustomers(res.data.topCustomers || []);
      setCategorySales(res.data.categorySales || []);
    } catch (err: any) {
      console.error("Error fetching reports:", err);
      const msg = err.response?.data?.error || err.message || "Failed to load reports";
      setError(msg);

      if (err.response?.status === 401 || err.response?.status === 403) {
        router.push("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------
  // SAME LOADING SCREEN AS AdminOrders
  // -------------------------------------------
  if (!mounted) {
    return (
      <div className="cart-page-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // -------------------------------------------
  // MAIN REPORT UI (Same login flow as AdminOrders)
  // -------------------------------------------

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-dark mx-auto mb-4"></div>
            <p className="text-luxury-gray">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-32 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-luxury-dark text-white px-6 py-2 rounded-lg hover:bg-luxury-navy transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalRevenue = dailyRevenue.reduce((sum, day) => sum + day.totalRevenue, 0);
  const totalOrders = dailyRevenue.reduce((sum, day) => sum + day.orderCount, 0);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-luxury-dark mb-8">Sales Reports</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">
              Total Revenue (30 days)
            </h3>
            <p className="text-3xl font-bold text-luxury-dark">
              ₹{totalRevenue.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">
              Total Orders (30 days)
            </h3>
            <p className="text-3xl font-bold text-luxury-dark">{totalOrders}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Average Order Value</h3>
            <p className="text-3xl font-bold text-luxury-dark">
              ₹{totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00"}
            </p>
          </div>
        </div>

        {/* Daily Revenue Table */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-luxury-dark mb-4">
            Daily Revenue (Last 30 Days)
          </h2>

          {dailyRevenue.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Order Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dailyRevenue.map((day, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {day.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{day.totalRevenue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {day.orderCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{day.averageOrderValue.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No revenue data available</p>
          )}
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-luxury-dark mb-4">Top Customers</h2>

          {topCustomers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Order Value
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {topCustomers.map((customer, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.userName || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.userEmail || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{customer.totalSpent.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.orderCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{customer.averageOrderValue.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No customer data available</p>
          )}
        </div>

        {/* Category Sales */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-luxury-dark mb-4">Category-wise Sales</h2>

          {categorySales.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Item Price
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {categorySales.map((cat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cat.category || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{cat.totalRevenue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cat.totalQuantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cat.orderCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{cat.averageItemPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No category sales data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
