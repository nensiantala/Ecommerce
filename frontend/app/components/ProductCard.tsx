"use client";

import Link from "next/link";
import { useState } from "react";
import { api, setAuthToken } from "../lib/api";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const router = useRouter();

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    
    // Get existing cart from localStorage
    const existingCart = localStorage.getItem("cart");
    const cart = existingCart ? JSON.parse(existingCart) : [];
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex((item: any) => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // Increase quantity if product exists
      cart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
    }
    
    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    setIsAdding(false);
    setAdded(true);
    
    // Reset added state after 2 seconds
    setTimeout(() => setAdded(false), 2000);
    
    // Dispatch custom event to update cart count in navbar
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleOrderNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to place an order");
      router.push("/auth/login");
      return;
    }

    setIsOrdering(true);
    setAuthToken(token);

    try {
      const response = await api.post("/api/orders", {
        items: [{
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        }]
      });

      setOrderSuccess(true);
      setTimeout(() => {
        router.push("/orders");
      }, 2000);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to place order");
      setIsOrdering(false);
    }
  };

  return (
    <div className="group w-full flex justify-center">
      <Link href={`/products/${product.id}`}>
        <div className="w-full max-w-sm bg-white overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-all duration-300 h-full flex flex-col">
          {/* Product Image Placeholder */}
          <div className="relative bg-luxury-light aspect-square overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-24 h-24 text-luxury-gray opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            {product.image && (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                style={{ minHeight: '100%', minWidth: '100%' }}
              />
            )}
          </div>
          
          {/* Product Info */}
          <div className="p-5 flex-1 flex flex-col">
            <p className="text-xs uppercase tracking-wider text-luxury-gray mb-2">{product.category}</p>
            <h3 className="font-display text-lg font-semibold text-luxury-dark mb-3 group-hover:text-luxury-gold transition-colors">
              {product.name}
            </h3>
            <div className="mt-auto pt-3 border-t border-luxury-light">
              <p className="text-xl font-bold text-luxury-dark mb-3">₹{product.price.toLocaleString()}</p>
              
              <div className="space-y-2">
                {/* Order Now Button */}
                <button
                  onClick={handleOrderNow}
                  disabled={isOrdering || orderSuccess}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                    orderSuccess
                      ? "bg-green-600 text-white"
                      : "bg-luxury-dark text-white hover:bg-luxury-navy hover:shadow-lg transform hover:scale-105"
                  } ${isOrdering ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isOrdering ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Ordering...
                    </span>
                  ) : orderSuccess ? (
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Ordered!
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Order Now
                    </span>
                  )}
                </button>

                {/* Add to Cart Button */}
                <button
                  onClick={addToCart}
                  disabled={isAdding || added || isOrdering || orderSuccess}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                    added
                      ? "bg-green-600 text-white"
                      : "bg-black text-white hover:bg-gray-800 hover:shadow-lg transform hover:scale-105"
                  } ${isAdding || isOrdering || orderSuccess ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isAdding ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </span>
                  ) : added ? (
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Added!
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
