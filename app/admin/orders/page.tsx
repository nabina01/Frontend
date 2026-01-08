"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2004";

interface Order {
  id: number;
  customerName: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  orderPaymentType: string;
  servedAt?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Edit states
  const [editCustomerName, setEditCustomerName] = useState("");
  const [editTotalAmount, setEditTotalAmount] = useState<number>(0);
  const [editStatus, setEditStatus] = useState("");
  const [editPaymentStatus, setEditPaymentStatus] = useState("");
  const [editPaymentType, setEditPaymentType] = useState("");
  const [editServedAt, setEditServedAt] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [message, setMessage] = useState<string | null>(null);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  if (message || error) {
    const timer = setTimeout(() => {
      setMessage(null);
      setError(null);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }
}, [message, error]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`);
      const data = await res.json();
      setOrders(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setShowView(true);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setEditCustomerName(order.customerName);
    setEditTotalAmount(order.totalAmount);
    setEditStatus(order.status);
    setEditPaymentStatus(order.paymentStatus);
    setEditPaymentType(order.orderPaymentType);
    setEditServedAt(
      order.servedAt ? new Date(order.servedAt).toISOString().slice(0, 16) : ""
    );
    setShowEdit(true);
  };

  const saveEdit = async () => {
    if (!selectedOrder) return;
  
    setMessage(null);
    setError(null);
  
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: editCustomerName,
          totalAmount: editTotalAmount,
          status: editStatus,
          paymentStatus: editPaymentStatus,
          orderPaymentType: editPaymentType,
          servedAt: editServedAt ? new Date(editServedAt).toISOString() : null,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setError(data.message || "Update failed");
        return;
      }
  
      setShowEdit(false);
      await fetchOrders();
  
      setMessage("Order updated successfully");
  
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };
  

  const handleDelete = (order: Order) => {
    setSelectedOrder(order);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!selectedOrder) return;
  
    setMessage(null);
    setError(null);
  
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${selectedOrder.id}`, {
        method: "DELETE",
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setError(data.message || "Delete failed");
        return;
      }
  
      setShowDelete(false);
      await fetchOrders();
  
      setMessage("Order deleted successfully");
  
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };
  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const totalPages = Math.ceil(orders.length / rowsPerPage);
  const currentOrders = orders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-2">Manage customer orders</p>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-700 border border-green-300">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300">
          {error}
        </div>
      )}
      {/* Scrollable Table */}
      <div className="border rounded-lg max-h-[70vh] overflow-auto">
        <table className="min-w-[1000px] w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left">S.N.</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Order Status</th>
              <th className="px-4 py-2 text-left">Payment Status</th>
              <th className="px-4 py-2 text-left">Payment Type</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentOrders.map((order, i) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  {(currentPage - 1) * rowsPerPage + i + 1}
                </td>
                <td className="px-4 py-2">{order.customerName}</td>
                <td className="px-4 py-2">Rs. {order.totalAmount}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      order.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      order.paymentStatus === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-2">{order.orderPaymentType}</td>

                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(order)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(order)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(order)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!orders.length && (
          <p className="text-center text-gray-500 py-3">No orders found</p>
        )}
      </div>

      {/* Pagination */}
      {orders.length > 0 && (
        <div className="mt-4 flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* VIEW MODAL */}
      {showView && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow max-w-md w-full">
            <h2 className="text-xl font-bold mb-3">Order Details</h2>
            <p>
              <b>Customer:</b> {selectedOrder.customerName}
            </p>
            <p>
              <b>Total:</b> Rs. {selectedOrder.totalAmount}
            </p>
            <p>
              <b>Status:</b> {selectedOrder.status}
            </p>
            <p>
              <b>Payment:</b> {selectedOrder.paymentStatus}
            </p>
            <p>
              <b>Payment Type:</b> {selectedOrder.orderPaymentType}
            </p>
            <p>
              <b>Served At:</b> {selectedOrder.servedAt || "-"}
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowView(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEdit && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow max-w-md w-full space-y-2">
            <h2 className="text-xl font-bold mb-3">Edit Order</h2>

            <label>Customer Name</label>
            <input
              className="border p-2 w-full"
              value={editCustomerName}
              onChange={(e) => setEditCustomerName(e.target.value)}
            />

            <label>Total Amount</label>
            <input
              type="number"
              className="border p-2 w-full"
              value={editTotalAmount}
              onChange={(e) => setEditTotalAmount(Number(e.target.value))}
            />

            <label>Status</label>
            <select
              className="border p-2 w-full"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
            >
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>

            <label>Payment Status</label>
            <select
              className="border p-2 w-full"
              value={editPaymentStatus}
              onChange={(e) => setEditPaymentStatus(e.target.value)}
            >
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="FAILED">FAILED</option>
            </select>

            <label>Payment Type</label>
            <select
              className="border p-2 w-full"
              value={editPaymentType}
              onChange={(e) => setEditPaymentType(e.target.value)}
            >
              <option value="CASH">CASH</option>
              <option value="KHALTI">KHALTI</option>
            </select>

            <label>Served At</label>
            <input
              type="datetime-local"
              className="border p-2 w-full"
              value={editServedAt}
              onChange={(e) => setEditServedAt(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowEdit(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={saveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDelete && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow max-w-sm w-full">
            <h2 className="text-lg font-bold text-red-600 mb-3">
              Are you sure you want to delete?
            </h2>
            <p>This action cannot be undone.</p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowDelete(false)}
              >
                No
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
