"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartContext";
import { FiShoppingCart } from "react-icons/fi";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { cart, openCart } = useCart();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);
        if (!prodRes.ok || !catRes.ok) throw new Error("Failed to fetch data");
        const products = await prodRes.json();
        const categories = await catRes.json();
        setProducts(products);
        setCategories(categories);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const inCategory = selectedCategory ? product.categoryId === selectedCategory : true;
    const aboveMin = minPrice ? product.price >= parseFloat(minPrice) : true;
    const belowMax = maxPrice ? product.price <= parseFloat(maxPrice) : true;
    return inCategory && aboveMin && belowMax;
  });

  return (
    <main className="max-w-6xl mx-auto p-6">
      <nav className="w-full bg-white shadow sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold text-blue-700">E-Shop</Link>
            <Link href="/admin/orders" className="text-gray-700 hover:text-blue-600 font-medium">Admin Orders</Link>
            <Link
               href="/admin/login"
               className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
            >
              Login
            </Link>
          </div>
          <button
            className="relative flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold"
            onClick={openCart}
            aria-label="Open cart"
          >
            <FiShoppingCart className="text-2xl" />
            <span className="hidden sm:inline">Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>
      <h1 className="text-3xl font-bold mb-8">Store</h1>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            value={selectedCategory || ""}
            onChange={e => setSelectedCategory(e.target.value || null)}
            className="border rounded px-3 py-2"
          >
            <option value="">All</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Min Price</label>
          <input
            type="number"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="border rounded px-3 py-2 w-24"
            min={0}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Max Price</label>
          <input
            type="number"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="border rounded px-3 py-2 w-24"
            min={0}
          />
        </div>
      </div>
      {/* Product grid */}
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="block bg-white rounded shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="font-semibold text-lg mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <div className="font-bold text-blue-600 text-xl">${product.price.toFixed(2)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
