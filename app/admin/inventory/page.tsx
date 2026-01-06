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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    category: "",
    currentStock: 0,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/api/inventory`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditFormData({
      name: item.name,
      category: item.category,
      currentStock: item.currentStock,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditFormData({ name: "", category: "", currentStock: 0 });
  };

  const handleSave = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/api/inventory/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        alert("Item updated successfully!");
        setEditingId(null);
        fetchInventory();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to update item");
      }
    } catch (error) {
      console.error("Failed to update item:", error);
      alert("Failed to update item");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/api/inventory/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Item deleted successfully!");
        fetchInventory();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to delete item");
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("Failed to delete item");
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="text-gray-500">Manage stock items</p>
      </div>

    
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
                <td className="px-4 py-2 font-medium">
                  {editingId === item.id ? (
                    <Input
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full"
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingId === item.id ? (
                    <select
                      value={editFormData.category}
                      onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                      className="w-full border rounded px-2 py-1"
                    >
                      <option>BEVERAGE</option>
                      <option>FOOD</option>
                      <option>UTENSILS</option>
                      <option>CLEANING</option>
                      <option>OTHER</option>
                    </select>
                  ) : (
                    item.category
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingId === item.id ? (
                    <Input
                      type="number"
                      value={editFormData.currentStock}
                      onChange={(e) => setEditFormData({ ...editFormData, currentStock: Number(e.target.value) })}
                      className="w-20"
                    />
                  ) : (
                    item.currentStock
                  )}
                </td>
                <td className="px-4 py-2">{item.supplier || "-"}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2 justify-center">
                    {editingId === item.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleSave(item.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
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
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            className="px-3 py-1 border rounded"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 border rounded"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}