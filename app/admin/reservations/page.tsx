"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2004";

interface Reservation {
  id: number;
  customerName: string;
  numberOfPeople: number;
  reservationTime: string;
  tableNumber: number; 
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations`);
      if (!response.ok) return;
      const data = await response.json();
      setReservations(data.data || []);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update status and immediately update UI
  const updateStatus = async (id: number, status: "CONFIRMED" | "CANCELLED") => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/api/reservations/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // Update local state without re-fetching everything
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
        setMessage(`Reservation ${status.toLowerCase()} successfully`);
        setTimeout(() => setMessage(null), 3000);
      } else {
        const error = await response.json();
        setMessage(error.message || "Failed to update reservation");
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Failed to update reservation:", error);
      setMessage("Failed to update reservation. Please try again.");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalPages = Math.ceil(reservations.length / rowsPerPage);
  const currentReservations = reservations.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));

  // Horizontal scroll triggers pagination
  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.currentTarget;
    if (target.scrollLeft + target.clientWidth >= target.scrollWidth - 5) {
      handleNextPage();
    } else if (target.scrollLeft === 0) {
      handlePrevPage();
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Table Reservations</h1>
        <p className="text-muted-foreground mt-2">Manage customer reservations</p>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-700 border border-green-300">
          {message}
        </div>
      )}

      <div
        className="overflow-x-auto border rounded-lg"
        onScroll={handleScroll}
      >
        <table className="w-full table-auto border border-gray-200 rounded-lg min-w-[900px]">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left">S.N.</th>
              <th className="px-4 py-2 text-left">Customer Name</th>
              <th className="px-4 py-2 text-left">Table Number</th>
              <th className="px-4 py-2 text-left">Reservation Time</th>
              <th className="px-4 py-2 text-left">No. of People</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentReservations.map((r, index) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                <td className="px-4 py-2 font-medium">{r.customerName}</td>
                <td className="px-4 py-2">{r.tableNumber}</td>
                <td className="px-4 py-2">
                  {new Date(r.reservationTime).toLocaleString([], {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </td>
                <td className="px-4 py-2">{r.numberOfPeople}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      r.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : r.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {r.status === "PENDING" ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(r.id, "CONFIRMED")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(r.id, "CANCELLED")}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reservations.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No reservations found</p>
        )}
      </div>

      {/* Pagination */}
      {reservations.length > 0 && (
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
    </div>
  );
}
