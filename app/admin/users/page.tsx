"use client"

import { useState, useEffect } from "react"
import { Card } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Loader2 } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2004";

interface User {
  id: number
  name: string
  email: string
  phoneNumber: string
  role: string
  createdAt: string
}

export default function UsersDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showView, setShowView] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null)
        setError(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [message, error])

  let messageTimeout: NodeJS.Timeout

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      
      if (!token) {
        console.error("No access token found")
        showMessage("Please login first")
        setLoading(false)
        return
      }
      
      console.log("Fetching users with token:", token.substring(0, 20) + "...")
      
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
      
      console.log("Response status:", response.status)
      console.log("Response ok:", response.ok)
      
      if (response.status === 401) {
        localStorage.removeItem("accessToken")
        showMessage("Session expired. Please login again.")
        setTimeout(() => {
          window.location.href = "/login"
        }, 2000)
        return
      }
      
      if (response.ok) {
        const result = await response.json()
        console.log("API Response:", result)
        console.log("Users data:", result.data)
        console.log("Is array?", Array.isArray(result.data))
        // The backend returns { success: true, data: [...] }
        const usersData = result.data || []
        console.log("Setting users:", usersData)
        setUsers(usersData)
      } else {
        // Try to get error message from response
        let errorMessage = `Request failed with status ${response.status}`
        try {
          const error = await response.json()
          console.error("API Error:", error)
          errorMessage = error.message || errorMessage
        } catch (e) {
          // Response is not JSON
          const text = await response.text()
          console.error("Response text:", text)
          errorMessage = text || errorMessage
        }
        showMessage(errorMessage)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
      showMessage("Network error. Backend server may not be running on port 2004.")
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (text: string) => {
    setMessage(text)
    if (messageTimeout) clearTimeout(messageTimeout)
    messageTimeout = setTimeout(() => setMessage(null), 3000)
  }

  const handleView = (user: User) => {
    setSelectedUser(user)
    setShowView(true)
  }

  const handleCloseView = () => {
    setShowView(false)
  }
  
  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setShowDelete(true)
  }

  const confirmDelete = async () => {
    if (!selectedUser) return

    setMessage(null)
    setError(null)

    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`${API_BASE_URL}/api/users/${selectedUser.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Delete failed")
        return
      }

      setShowDelete(false)
      await fetchUsers()
      setMessage("User deleted successfully")
    } catch (error) {
      console.error("Delete error:", error)
      setError("Failed to delete user")
    }
  }

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(users.length / usersPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  console.log("Rendering with users:", users)
  console.log("Users count:", users.length)

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Users Information</h1>
        <p className="text-muted-foreground mt-2">Manage all registered users</p>
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



      <Card className="p-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">S.N.</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Phone Number</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-8 text-muted-foreground">
                  No users found. Check console for errors.
                </td>
              </tr>
            ) : (
              currentUsers.map((user, index) => (
                <tr key={user.id} className="border-b">
                  <td className="p-3 font-medium">{indexOfFirstUser + index + 1}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phoneNumber || "-"}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(user)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(user)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {users.length > 0 && (
        <div className="mt-4 flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
        </div>
      )}

      {/* VIEW MODAL */}
      {showView && selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow max-w-md w-full">
            <h2 className="text-xl font-bold mb-3">User Details</h2>
            <p>
              <b>Name:</b> {selectedUser.name}
            </p>
            <p>
              <b>Email:</b> {selectedUser.email}
            </p>
            <p>
              <b>Phone Number:</b> {selectedUser.phoneNumber || "-"}
            </p>
            <p>
              <b>Role:</b> {selectedUser.role}
            </p>
            <p>
              <b>User ID:</b> {selectedUser.id}
            </p>
            <p>
              <b>Created At:</b> {new Date(selectedUser.createdAt).toLocaleDateString()}
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

      {/* DELETE MODAL */}
      {showDelete && selectedUser && (
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
  )
}
