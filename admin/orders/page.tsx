"use client";
import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then(res => res.json())
      .then(setOrders)
      .catch(err => {
        console.error("Error fetching orders:", err);
        setError("An error occurred while fetching orders.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-lg animate-pulse">Loading...</div>;
  if (error) return <div className="p-8 text-red-600 text-center text-lg">{error}</div>;

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-8 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">Order History</h1>
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full border text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-2 whitespace-nowrap">Order ID</th>
              <th className="border px-2 py-2 whitespace-nowrap">User</th>
              <th className="border px-2 py-2 whitespace-nowrap">Total</th>
              <th className="border px-2 py-2 whitespace-nowrap">Status</th>
              <th className="border px-2 py-2 whitespace-nowrap">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="border px-2 py-2 break-all">{order.id}</td>
                <td className="border px-2 py-2">{order.user?.email || <span className="italic text-gray-400">Guest</span>}</td>
                <td className="border px-2 py-2 font-semibold text-blue-700">${order.total.toFixed(2)}</td>
                <td className="border px-2 py-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${order.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{order.status}</span>
                </td>
                <td className="border px-2 py-2 whitespace-nowrap">{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && (
        <div className="text-center text-gray-500 mt-8">No orders found.</div>
      )}
    </main>
  );
}
