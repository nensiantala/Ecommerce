"use client";

import { useEffect, useState } from "react";
import { api, setAuthToken } from "../lib/api";
import CartItem from "../components/CartItem";
import Link from "next/link";

interface CartItemType {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    // Load cart from localStorage
    const loadCart = () => {
      try {
        const cartData = localStorage.getItem("cart");
        if (cartData) {
          const items = JSON.parse(cartData);
          setCartItems(Array.isArray(items) ? items : []);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error("Error loading cart:", err);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadCart();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to place an order");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setIsPlacingOrder(true);
    setError("");

    // Set auth token
    setAuthToken(token);

    try {
      // Map cart items to order format
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      const response = await api.post("/api/orders", {
        items: orderItems
      });

      // Clear cart after successful order
      localStorage.removeItem("cart");
      setCartItems([]);
      window.dispatchEvent(new Event("cartUpdated"));
      
      setOrderSuccess(true);
      
      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        window.location.href = "/orders";
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || "Failed to place order");
      setIsPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="cart-page-container pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-dark mx-auto mb-4"></div>
              <p className="text-luxury-gray">Loading cart...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page-container pb-20">
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
    <div className="cart-page-container pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-luxury-dark mb-12">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <svg className="w-24 h-24 text-luxury-gray mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-luxury-gray text-lg mb-6">Your cart is empty</p>
            <Link
              href="/products"
              className="bg-luxury-dark text-white px-8 py-4 rounded-sm hover:bg-luxury-navy transition-all duration-300 font-medium text-sm uppercase tracking-wider inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <CartItem 
                  key={item.productId || index} 
                  item={item}
                  onUpdate={() => {
                    const cartData = localStorage.getItem("cart");
                    if (cartData) {
                      const items = JSON.parse(cartData);
                      setCartItems(items);
                    }
                  }}
                />
              ))}
              
              {/* Place Order Button - Mobile/Tablet View */}
              <div className="lg:hidden mt-6">
                {orderSuccess ? (
                  <div className="w-full bg-green-600 text-white py-4 rounded-sm text-center font-medium text-sm uppercase tracking-wider">
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Order Placed Successfully!
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleCheckout}
                    disabled={isPlacingOrder || cartItems.length === 0}
                    className={`w-full bg-black text-white py-4 px-6 rounded-sm font-semibold text-base uppercase tracking-wider ${
                      isPlacingOrder || cartItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    style={{ minHeight: '48px' }}
                  >
                    {isPlacingOrder ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Placing Order...
                      </span>
                    ) : (
                      <span className="flex text-white items-center justify-center">
                        PLACE ORDER
                      </span>
                    )}
                  </button>
                )}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm mt-4 text-sm">
                    {error}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-sm shadow-luxury border border-luxury-light sticky top-24">
                <h2 className="font-display text-xl font-semibold text-luxury-dark mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-luxury-gray">
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-luxury-gray">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-luxury-light pt-4 flex justify-between">
                    <span className="font-display text-lg font-semibold text-luxury-dark">Total</span>
                    <span className="font-display text-xl font-bold text-luxury-dark">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Place Order Button - Always visible when cart has items */}
                {orderSuccess ? (
                  <div className="w-full bg-green-600 text-white py-4 rounded-sm text-center font-medium text-sm uppercase tracking-wider mb-4">
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Order Placed Successfully!
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleCheckout}
                    disabled={isPlacingOrder || cartItems.length === 0}
                    className={`w-full bg-black text-white py-4 px-6 rounded-sm font-semibold text-base uppercase tracking-wider mb-4 ${
                      isPlacingOrder || cartItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    style={{ minHeight: '48px' }}
                  >
                    {isPlacingOrder ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Placing Order...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        PLACE ORDER
                      </span>
                    )}
                  </button>
                )}
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm mb-4 text-sm">
                    {error}
                  </div>
                )}
                
                <Link
                  href="/products"
                  className="block text-center text-luxury-dark hover:text-luxury-gold transition-colors text-sm uppercase tracking-wider mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

