"use client";

import { useState, useEffect } from "react";
import { Loader2, Pencil, Trash2, Save, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2004";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  quality: string;
  supplier: string;
  minStock: number;
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    category: "",
    currentStock: 0,
  });

  const [addFormData, setAddFormData] = useState({
    name: "",
    category: "BEVERAGE",
    currentStock: 0,
    quality: "",
    supplier: "",
    minStock: 5,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log("Fetching inventory with token:", token ? "exists" : "missing");
      
      if (!token) {
        console.error("No access token found");
        setError("Please log in to view inventory");
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/inventory`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      console.log("Inventory response status:", response.status);
      
      if (response.status === 401) {
        setError("Session expired. Please log in again");
        // Optionally redirect to login
        // window.location.href = "/login";
        setLoading(false);
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        console.log("Inventory data received:", data);
        setItems(data.data || []);
      } else {
        console.error("Failed to fetch inventory:", response.status);
        const errorData = await response.text();
        console.error("Error response:", errorData);
        setError("Failed to fetch inventory data");
      }
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowView(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setEditFormData({
      name: item.name,
      category: item.category,
      currentStock: item.currentStock,
    });
    setShowEdit(true);
  };

  const handleCancel = () => {
    setShowEdit(false);
    setEditFormData({ name: "", category: "", currentStock: 0 });
  };

  const handleSave = async () => {
    if (!selectedItem) return;

    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/api/inventory/${selectedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Update failed");
        return;
      }

      setShowEdit(false);
      await fetchInventory();
      setMessage("Item updated successfully!");
    } catch (error) {
      console.error("Failed to update item:", error);
      setError("Failed to update item");
    }
  };

  const handleDelete = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;

    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/api/inventory/${selectedItem.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Delete failed");
        return;
      }

      setShowDelete(false);
      await fetchInventory();
      setMessage("Item deleted successfully!");
    } catch (error) {
      console.error("Failed to delete item:", error);
      setError("Failed to delete item");
    }
  };

  const handleAdd = () => {
    setAddFormData({
      name: "",
      category: "BEVERAGE",
      currentStock: 0,
      quality: "",
      supplier: "",
      minStock: 5,
    });
    setShowAdd(true);
  };

  const handleAddCancel = () => {
    setShowAdd(false);
    setAddFormData({
      name: "",
      category: "BEVERAGE",
      currentStock: 0,
      quality: "",
      supplier: "",
      minStock: 5,
    });
  };

  const handleAddSave = async () => {
    setMessage(null);
    setError(null);

    if (!addFormData.name.trim()) {
      setError("Product name is required");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/api/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(addFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to add item");
        return;
      }

      setShowAdd(false);
      await fetchInventory();
      setMessage("Item added successfully!");
      setAddFormData({
        name: "",
        category: "BEVERAGE",
        currentStock: 0,
        quality: "",
        supplier: "",
        minStock: 5,
      });
    } catch (error) {
      console.error("Failed to add item:", error);
      setError("Failed to add item");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(items.length / rowsPerPage);
  const currentItems = items.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground mt-2">Manage stock items</p>
        </div>
        <Button onClick={handleAdd} className="bg-amber-700 hover:bg-amber-800 text-white">
          Add Item
        </Button>
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

    
      <div className="overflow-auto border rounded-lg">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left">S.N</th>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-left">Supplier</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                <td className="px-4 py-2 font-medium">{item.name}</td>
                <td className="px-4 py-2">{item.category}</td>
                <td className="px-4 py-2">{item.currentStock}</td>
                <td className="px-4 py-2">{item.supplier || "-"}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(item)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(item)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No inventory items found
          </p>
        )}
      </div>

      {/* Pagination */}
      {items.length > 0 && (
        <div className="mt-4 flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
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
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* VIEW MODAL */}
      {showView && selectedItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow max-w-md w-full">
            <h2 className="text-xl font-bold mb-3">Item Details</h2>
            <p>
              <b>Product Name:</b> {selectedItem.name}
            </p>
            <p>
              <b>Category:</b> {selectedItem.category}
            </p>
            <p>
              <b>Current Stock:</b> {selectedItem.currentStock}
            </p>
            <p>
              <b>Minimum Stock:</b> {selectedItem.minStock}
            </p>
            <p>
              <b>Quality:</b> {selectedItem.quality}
            </p>
            <p>
              <b>Supplier:</b> {selectedItem.supplier || "-"}
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
      {showEdit && selectedItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow max-w-md w-full space-y-2">
            <h2 className="text-xl font-bold mb-3">Edit Item</h2>

            <label>Product Name</label>
            <input
              className="border p-2 w-full"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
            />

            <label>Category</label>
            <select
              className="border p-2 w-full"
              value={editFormData.category}
              onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
            >
              <option value="BEVERAGE">BEVERAGE</option>
              <option value="FOOD">FOOD</option>
              <option value="UTENSILS">UTENSILS</option>
              <option value="CLEANING">CLEANING</option>
              <option value="OTHER">OTHER</option>
            </select>

            <label>Current Stock</label>
            <input
              type="number"
              className="border p-2 w-full"
              value={editFormData.currentStock}
              onChange={(e) => setEditFormData({ ...editFormData, currentStock: Number(e.target.value) })}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDelete && selectedItem && (
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

      {/* ADD MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow max-w-md w-full space-y-2">
            <h2 className="text-xl font-bold mb-3">Add New Item</h2>

            <label>Product Name</label>
            <input
              className="border p-2 w-full"
              value={addFormData.name}
              onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
              placeholder="Enter product name"
            />

            <label>Category</label>
            <select
              className="border p-2 w-full"
              value={addFormData.category}
              onChange={(e) => setAddFormData({ ...addFormData, category: e.target.value })}
            >
              <option value="BEVERAGE">BEVERAGE</option>
              <option value="FOOD">FOOD</option>
              <option value="UTENSILS">UTENSILS</option>
              <option value="CLEANING">CLEANING</option>
              <option value="OTHER">OTHER</option>
            </select>

            <label>Current Stock</label>
            <input
              type="number"
              className="border p-2 w-full"
              value={addFormData.currentStock}
              onChange={(e) => setAddFormData({ ...addFormData, currentStock: Number(e.target.value) })}
              placeholder="Enter stock quantity"
            />

            <label>Quality</label>
            <input
              className="border p-2 w-full"
              value={addFormData.quality}
              onChange={(e) => setAddFormData({ ...addFormData, quality: e.target.value })}
              placeholder="Enter quality grade"
            />

            <label>Supplier</label>
            <input
              className="border p-2 w-full"
              value={addFormData.supplier}
              onChange={(e) => setAddFormData({ ...addFormData, supplier: e.target.value })}
              placeholder="Enter supplier name"
            />

            <label>Minimum Stock</label>
            <input
              type="number"
              className="border p-2 w-full"
              value={addFormData.minStock}
              onChange={(e) => setAddFormData({ ...addFormData, minStock: Number(e.target.value) })}
              placeholder="Enter minimum stock level"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={handleAddCancel}
              >
                Cancel
              </button>
              <button
                className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded"
                onClick={handleAddSave}
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}