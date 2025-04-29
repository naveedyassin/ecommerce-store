"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/products?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        // If you have a dedicated /api/products/[id] route, use that instead
        const found = Array.isArray(data) ? data.find((p: Product) => p.id === id) : data;
        setProduct(found || null);
      } catch (err: any) {
        setError(err.message || "Error fetching product");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <main className="p-8">Loading...</main>;
  if (error) return <main className="p-8 text-red-600">{error}</main>;
  if (!product) return <main className="p-8">Product not found.</main>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Store</Link>
      <div className="flex flex-col md:flex-row gap-8 bg-white rounded shadow p-6">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full md:w-80 h-80 object-cover rounded"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="text-xl text-blue-600 font-semibold mb-4">${product.price.toFixed(2)}</div>
          <p className="mb-6 text-gray-700">{product.description}</p>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
            // onClick={...} // Add to cart logic here
          >
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}
