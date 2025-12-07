"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "./lib/api";
import ProductCard from "./components/ProductCard";

interface Product {
  id: string;
  _id?: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  images?: string[];
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured products (first 4 products)
    api.get("/api/products?limit=4")
      .then((res) => {
        const productsData = res.data.products || res.data || [];
        const mappedProducts = productsData.map((product: any) => ({
          id: product._id || product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          image: product.images?.[0] || product.image,
        }));
        setFeaturedProducts(mappedProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching featured products:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="content-below-navbar overflow-hidden">
      {/* Hero Section with Animation */}
      <section className="hero-section relative bg-gradient-to-br from-luxury-light via-white to-luxury-light py-24 md:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-luxury-gold opacity-5 rounded-full blur-3xl animate-pulse"></div>
          <div className="text-center absolute -bottom-40 -left-40 w-80 h-80 bg-luxury-dark opacity-5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="hero-content relative z-10">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-luxury-dark mb-6 leading-tight animate-slide-up">
            Welcome to E-Shop
          </h1>
          <p className="text-lg md:text-xl text-luxury-gray mb-10 leading-relaxed animate-slide-up-delay">
            Discover luxury products with secure checkout and fast delivery. 
            Experience premium quality at your fingertips.
          </p>
          <div className="hero-buttons animate-slide-up-delay-2">
            <Link
              href="/products"
              className="bg-luxury-dark text-white px-8 py-4 rounded-sm hover:bg-luxury-navy transition-all duration-300 font-medium text-sm uppercase tracking-wider shadow-luxury hover:shadow-luxury-lg transform hover:scale-105"
            >
              Shop Now
            </Link>
            <Link
              href="/products"
              className="border-1 border-luxury-dark text-luxury-dark px-8 py-4 rounded-sm hover:bg-luxury-dark hover:text-white transition-all duration-300 font-medium text-sm uppercase tracking-wider transform hover:scale-105"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Category Showcase Section */}
      <section className="category-showcase py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-luxury-dark mb-4">
              Shop by Category
            </h2>
            <p className="text-luxury-gray text-lg max-w-2xl mx-auto">
              Explore our curated collections for men and women
            </p>
          </div>
          <div className="category-card-container">
            {/* Men Category Card */}
            <Link 
              href="/products?category=Men"
              className="category-card group relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 p-12 pt-16 transform transition-all duration-300 hover:scale-105 hover:shadow-luxury-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-luxury-dark/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-22 h-22 bg-luxury-dark rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-luxury-navy transition-colors duration-300 transform group-hover:rotate-6">
                  <span className="text-4xl font-bold text-white">MEN</span>
                </div>
                <h3 className="font-display text-3xl font-bold text-luxury-dark mb-3 group-hover:text-luxury-navy transition-colors">
                  Men's Collection
                </h3>
                <p className="text-luxury-gray mb-4">
                  Discover premium men's fashion and accessories
                </p>
                <span className="inline-block text-luxury-dark font-semibold uppercase text-sm tracking-wider group-hover:translate-x-2 transition-transform">
                  Shop Men →
                </span>
              </div>
            </Link>

            {/* Women Category Card */}
            <Link 
              href="/products?category=Women"
              className="category-card group relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 p-12 pt-16 transform transition-all duration-300 hover:scale-105 hover:shadow-luxury-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-22 h-22 bg-luxury-dark rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-luxury-navy transition-colors duration-300 transform group-hover:-rotate-6">
                  <span className="text-4xl font-bold text-white">WOMEN</span>
                </div>
                <h3 className="font-display text-3xl font-bold text-luxury-dark mb-3 group-hover:text-luxury-navy transition-colors">
                  Women's Collection
                </h3>
                <p className="text-luxury-gray mb-4">
                  Explore elegant women's fashion and accessories
                </p>
                <span className="inline-block text-luxury-dark font-semibold uppercase text-sm tracking-wider group-hover:translate-x-2 transition-transform">
                  Shop Women →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {!loading && featuredProducts.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-white to-luxury-light">
          <div className="pt-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-luxury-dark mb-4">
                Featured Products
              </h2>
              <p className="text-luxury-gray text-lg max-w-2xl mx-auto">
                Handpicked selections from our premium collection
              </p>
            </div>
            <div className="featured-grid">
              {featuredProducts.map((product) => (
                <div key={product.id} className="animate-fade-in w-full flex justify-center">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/products"
                className="inline-block bg-luxury-dark text-white px-8 py-4 rounded-sm hover:bg-luxury-navy transition-all duration-300 font-medium text-sm uppercase tracking-wider shadow-luxury hover:shadow-luxury-lg transform hover:scale-105"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="features-grid">
            <div className="feature-card group">
              <div className="w-20 h-20 bg-gradient-to-br from-luxury-light to-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-luxury group-hover:shadow-luxury-lg">
                <svg className="w-10 h-10 text-luxury-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3 text-luxury-dark group-hover:text-luxury-navy transition-colors">
                Premium Quality
              </h3>
              <p className="text-luxury-gray leading-relaxed">
                Curated selection of the finest products, carefully chosen for excellence
              </p>
            </div>
            <div className="feature-card group">
              <div className="w-20 h-20 bg-gradient-to-br from-luxury-light to-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 shadow-luxury group-hover:shadow-luxury-lg">
                <svg className="w-10 h-10 text-luxury-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3 text-luxury-dark group-hover:text-luxury-navy transition-colors">
                Fast Delivery
              </h3>
              <p className="text-luxury-gray leading-relaxed">
                Quick and secure shipping to your doorstep, delivered with care
              </p>
            </div>
            <div className="text-center group pt-6">
              <div className="w-20 h-20 bg-gradient-to-br from-luxury-light to-luxury-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-luxury group-hover:shadow-luxury-lg">
                <svg className="w-10 h-10 text-luxury-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3 text-luxury-dark group-hover:text-luxury-navy transition-colors">
                Secure Checkout
              </h3>
              <p className="text-luxury-gray leading-relaxed">
                Your data and payments are always protected with industry-leading security
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-luxury-dark to-luxury-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover your perfect style today
          </p>
          <Link
            href="/products"
            className="inline-block bg-luxury-gold text-luxury-dark px-10 py-4 rounded-sm hover:bg-luxury-gold/90 transition-all duration-300 font-medium text-sm uppercase tracking-wider shadow-luxury-lg hover:shadow-luxury transform hover:scale-105"
          >
            Browse Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
