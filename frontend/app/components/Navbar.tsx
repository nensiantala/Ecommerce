"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { setAuthToken } from "../lib/api";

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    setAuthToken(t);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Load cart count
    const updateCartCount = () => {
      try {
        const cartData = localStorage.getItem("cart");
        if (cartData) {
          const cart = JSON.parse(cartData);
          const totalItems = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
          setCartCount(totalItems);
        } else {
          setCartCount(0);
        }
      } catch (err) {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    window.location.href = "/auth/login";
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-luxury' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="font-display text-2xl font-bold text-luxury-dark tracking-tight">
            E-Shop
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            {/* Men Category Filter */}
            <Link 
              href="/products?category=Men" 
              className="flex flex-col items-center justify-center text-luxury-dark hover:text-luxury-gold font-medium text-sm uppercase tracking-wider transition-all group"
            >
              <div className="w-16 h-16 bg-gray-100 group-hover:bg-gray-200 rounded-full flex items-center justify-center mb-1 transition-colors border-2 border-transparent group-hover:border-luxury-gold">
                <span className="text-xl font-bold">MEN</span>
              </div>
              <span className="text-xs">Men</span>
            </Link>
            
            {/* Women Category Filter */}
            <Link 
              href="/products?category=Women" 
              className="flex flex-col items-center justify-center text-luxury-dark hover:text-luxury-gold font-medium text-sm uppercase tracking-wider transition-all group"
            >
              <div className="w-16 h-16 bg-gray-100 group-hover:bg-gray-200 rounded-full flex items-center justify-center mb-1 transition-colors border-2 border-transparent group-hover:border-luxury-gold">
                <span className="text-xl font-bold">WOMEN</span>
              </div>
              <span className="text-xs">Women</span>
            </Link>
            
            <Link href="/products" className="text-luxury-dark hover:text-luxury-gold font-medium text-sm uppercase tracking-wider transition-colors px-2">
              Products
            </Link>
            <Link href="/cart" className="text-luxury-dark hover:text-luxury-gold font-medium text-sm uppercase tracking-wider transition-colors relative px-2">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-luxury-gold text-luxury-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            {token ? (
              <>
                <Link href="/orders" className="text-luxury-dark hover:text-luxury-gold font-medium text-sm uppercase tracking-wider transition-colors px-2">
                  Orders
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-luxury-dark hover:text-luxury-gold font-medium text-sm uppercase tracking-wider transition-colors px-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-luxury-dark hover:text-luxury-gold font-medium text-sm uppercase tracking-wider transition-colors px-2">
                  Login
                </Link>
                <Link 
                  href="/auth/register" 
                  className="bg-luxury-dark text-white px-6 py-2 rounded-sm hover:bg-luxury-navy transition-colors font-medium text-sm uppercase tracking-wider"
                >
                  Register
                </Link>
              </>
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
            <div className="flex flex-col space-y-4">
              {/* Men Category Filter - Mobile */}
              <Link 
                href="/products?category=Men"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-2 text-luxury-dark hover:bg-gray-50 rounded"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">MEN</span>
                </div>
                <span className="font-medium uppercase tracking-wider">Men</span>
              </Link>
              
              {/* Women Category Filter - Mobile */}
              <Link 
                href="/products?category=Women"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-2 text-luxury-dark hover:bg-gray-50 rounded"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">WOMEN</span>
                </div>
                <span className="font-medium uppercase tracking-wider">Women</span>
              </Link>

              <Link 
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-luxury-dark hover:bg-gray-50 rounded font-medium uppercase tracking-wider"
              >
                Products
              </Link>
              <Link 
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-luxury-dark hover:bg-gray-50 rounded font-medium uppercase tracking-wider relative"
              >
                Cart
                {cartCount > 0 && (
                  <span className="absolute left-20 top-2 bg-luxury-gold text-luxury-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
              {token ? (
                <>
                  <Link 
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-luxury-dark hover:bg-gray-50 rounded font-medium uppercase tracking-wider"
                  >
                    Orders
                  </Link>
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="px-4 py-2 text-left text-luxury-dark hover:bg-gray-50 rounded font-medium uppercase tracking-wider"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-luxury-dark hover:bg-gray-50 rounded font-medium uppercase tracking-wider"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 bg-luxury-dark text-white rounded hover:bg-luxury-navy font-medium uppercase tracking-wider text-center"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
