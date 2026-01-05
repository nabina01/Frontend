"use client";

import { useState, useEffect, Fragment } from "react";
import { Loader2, MoreHorizontal, Check, X } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
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
      const response = await fetch(`${API_BASE_URL}/api/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // Update local state without re-fetching everything
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
      }
    } catch (error) {
      console.error("Failed to update reservation:", error);
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Table Reservations</h1>

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
                  {r.status === "PENDING" && (
                    <Menu as="div" className="relative inline-block text-left">
                      <Menu.Button className="p-2 rounded hover:bg-gray-100">
                        <MoreHorizontal className="w-5 h-5" />
                      </Menu.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-10">
                          <div className="p-1 flex flex-col">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={`${
                                    active ? "bg-gray-100" : ""
                                  } group flex items-center px-2 py-2 text-sm text-green-700 rounded-md`}
                                  onClick={async () => await updateStatus(r.id, "CONFIRMED")}
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Approve
                                </button>
                              )}
                            </Menu.Item>

                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={`${
                                    active ? "bg-gray-100" : ""
                                  } group flex items-center px-2 py-2 text-sm text-red-700 rounded-md`}
                                  onClick={async () => await updateStatus(r.id, "CANCELLED")}
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Reject
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
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
