"use client";

import { useEffect, useState } from "react";
import { api, setAuthToken } from "../lib/api";
import Link from "next/link";

interface OrderItem {
  product?: string;
  productId?: string;
  name?: string;
  productName?: string;
  quantity: number;
  priceAtPurchase: number;
}

interface Order {
  _id?: string;
  id?: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to view your orders");
      setLoading(false);
      return;
    }

    // Set auth token
    setAuthToken(token);

    api.get("/api/orders")
      .then((res) => {
        console.log("Orders response:", res.data);
        const ordersData = Array.isArray(res.data) ? res.data : res.data.orders || [];
        // Map MongoDB _id to id for consistency
        const mappedOrders = ordersData.map((order: any) => ({
          ...order,
          id: order._id || order.id
        }));
        setOrders(mappedOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setError(err.response?.data?.error || err.response?.data?.message || "Failed to load orders");
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-dark mx-auto mb-4"></div>
              <p className="text-luxury-gray">Loading orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <Link href="/auth/login" className="text-luxury-dark hover:text-luxury-gold underline">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-luxury-dark mb-12">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <svg className="w-24 h-24 text-luxury-gray mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-luxury-gray text-lg mb-6">You haven't placed any orders yet</p>
            <Link
              href="/products"
              className="bg-luxury-dark text-white px-8 py-4 rounded-sm hover:bg-luxury-navy transition-all duration-300 font-medium text-sm uppercase tracking-wider inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              return (
                <div key={order.id} className="bg-white p-6 rounded-sm shadow-luxury hover:shadow-luxury-lg transition-all duration-300 border border-luxury-light">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 pb-4 border-b border-luxury-light">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-display text-xl font-semibold text-luxury-dark">
                          Order #{order.id}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "completed" 
                            ? "bg-green-100 text-green-800" 
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {order.status?.toUpperCase() || "PENDING"}
                        </span>
                      </div>
                      <p className="text-luxury-gray text-sm">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 text-left md:text-right">
                      <p className="font-display text-2xl font-bold text-luxury-dark">
                        ₹{order.total.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-luxury-dark text-sm uppercase tracking-wider mb-3">
                        Items
                      </h4>
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <div className="flex-1">
                            <p className="text-luxury-dark font-medium">
                              {item.name || item.productName || `Product ${item.productId || item.product}`}
                            </p>
                            <p className="text-luxury-gray">
                              Quantity: {item.quantity} × ₹{item.priceAtPurchase.toLocaleString()}
                            </p>
                          </div>
                          <p className="font-semibold text-luxury-dark">
                            ₹{(item.quantity * item.priceAtPurchase).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

