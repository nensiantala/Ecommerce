"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { setAuthToken } from "../lib/api";

export default function AdminNavbar() {
  const [token, setToken] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    setAuthToken(t);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    window.location.href = "/auth/login";
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-luxury">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/admin" className="font-display text-2xl font-bold text-luxury-dark tracking-tight">
            Admin Panel
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/admin" 
              className={`font-medium text-sm uppercase tracking-wider transition-colors px-4 py-2 rounded ${
                isActive("/admin") && pathname !== "/admin/login" && pathname !== "/admin/set-token"
                  ? "bg-luxury-dark text-white"
                  : "text-luxury-dark hover:text-luxury-gold hover:bg-gray-50"
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/admin/products" 
              className={`font-medium text-sm uppercase tracking-wider transition-colors px-4 py-2 rounded ${
                isActive("/admin/products")
                  ? "bg-luxury-dark text-white"
                  : "text-luxury-dark hover:text-luxury-gold hover:bg-gray-50"
              }`}
            >
              Manage Products
            </Link>
            <Link 
              href="/admin/users" 
              className={`font-medium text-sm uppercase tracking-wider transition-colors px-4 py-2 rounded ${
                isActive("/admin/users")
                  ? "bg-luxury-dark text-white"
                  : "text-luxury-dark hover:text-luxury-gold hover:bg-gray-50"
              }`}
            >
              Manage Users
            </Link>
            <Link 
              href="/admin/orders" 
              className={`font-medium text-sm uppercase tracking-wider transition-colors px-4 py-2 rounded ${
                isActive("/admin/orders")
                  ? "bg-luxury-dark text-white"
                  : "text-luxury-dark hover:text-luxury-gold hover:bg-gray-50"
              }`}
            >
              Manage Orders
            </Link>
            {token && (
              <button 
                onClick={handleLogout} 
                className="text-luxury-dark hover:text-luxury-gold font-medium text-sm uppercase tracking-wider transition-colors px-4 py-2 rounded hover:bg-gray-50"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-luxury-dark"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded font-medium uppercase tracking-wider ${
                  isActive("/admin") && pathname !== "/admin/login" && pathname !== "/admin/set-token"
                    ? "bg-luxury-dark text-white"
                    : "text-luxury-dark hover:bg-gray-50"
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/admin/products"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded font-medium uppercase tracking-wider ${
                  isActive("/admin/products")
                    ? "bg-luxury-dark text-white"
                    : "text-luxury-dark hover:bg-gray-50"
                }`}
              >
                Manage Products
              </Link>
              <Link 
                href="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded font-medium uppercase tracking-wider ${
                  isActive("/admin/users")
                    ? "bg-luxury-dark text-white"
                    : "text-luxury-dark hover:bg-gray-50"
                }`}
              >
                Manage Users
              </Link>
              <Link 
                href="/admin/orders"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded font-medium uppercase tracking-wider ${
                  isActive("/admin/orders")
                    ? "bg-luxury-dark text-white"
                    : "text-luxury-dark hover:bg-gray-50"
                }`}
              >
                Manage Orders
              </Link>
              {token && (
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="px-4 py-2 text-left text-luxury-dark hover:bg-gray-50 rounded font-medium uppercase tracking-wider"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

