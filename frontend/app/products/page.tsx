"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, setAuthToken } from "../lib/api";
import ProductCard from "../components/ProductCard";

interface Product {
  id: string;
  _id?: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  images?: string[];
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Build API URL with category filter if provided
    const apiUrl = category 
      ? `/api/products?category=${encodeURIComponent(category)}`
      : "/api/products";
    
    api.get(apiUrl)
      .then((res) => {
        console.log("API Response:", res.data);
        // API returns { products, total, page, pages }
        const productsData = res.data.products || res.data || [];
        
        // Map MongoDB _id to id and handle images array
        const mappedProducts = productsData.map((product: any) => ({
          id: product._id || product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          image: product.images?.[0] || product.image,
        }));
        
        console.log("Mapped Products:", mappedProducts);
        setProducts(mappedProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError(err.response?.data?.error || "Failed to load products");
        setLoading(false);
      });
  }, [category]);

  if (loading) {
    return (
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-dark mx-auto mb-4"></div>
              <p className="text-luxury-gray">Loading products...</p>
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

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-luxury-dark mb-4">
            {category ? `${category}'s Products` : "Our Products"}
          </h1>
          <p className="text-luxury-gray text-lg max-w-2xl mx-auto">
            {category 
              ? `Discover our curated collection of ${category.toLowerCase()} products`
              : "Discover our curated collection of premium products"
            }
          </p>
          {category && (
            <Link 
              href="/products" 
              className="inline-block mt-4 text-luxury-dark hover:text-luxury-gold text-sm underline"
            >
              View All Products
            </Link>
          )}
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-luxury-gray text-lg">No products available at the moment.</p>
            <p className="text-luxury-gray text-sm mt-2">Check the console for debugging information.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-dark mx-auto mb-4"></div>
              <p className="text-luxury-gray">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
