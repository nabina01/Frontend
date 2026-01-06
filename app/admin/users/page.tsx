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
  role: string
  createdAt: string
}

export default function UsersDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  let messageTimeout: NodeJS.Timeout

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
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
        const error = await response.json()
        console.error("API Error:", error)
        showMessage(error.message || "Failed to fetch users")
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
      showMessage("Network error. Please check if backend is running.")
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (text: string) => {
    setMessage(text)
    if (messageTimeout) clearTimeout(messageTimeout)
    messageTimeout = setTimeout(() => setMessage(null), 3000)
  }

  const handleView = (user: User) => showMessage(`Viewing ${user.name}`)
  const handleEdit = (user: User) => showMessage(`Editing ${user.name}`)
  const handleChangePassword = (user: User) =>
    showMessage(`Changing password for ${user.name}`)
  const handleDelete = (user: User) =>
    showMessage(`Deleted ${user.name}`)

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
        <div className="fixed top-6 right-6 bg-black text-white px-4 py-2 rounded-md shadow-lg transition">
          {message}
        </div>
      )}

      <Card className="p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">S.N.</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-8 text-muted-foreground">
                  No users found. Check console for errors.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id} className="border-b">
                  <td className="p-3 font-medium">{index + 1}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(user)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleChangePassword(user)}
                    >
                      Change Password
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(user)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
