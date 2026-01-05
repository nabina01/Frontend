"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/src/context/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth() // auth context function to set user & token

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("http://localhost:2004/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        //  Store accessToken in localStorage
        localStorage.setItem("accessToken", data.accessToken)

        // ✅Update your auth context
        login(data.user, data.accessToken)

        // ✅ Redirect based on role
        if (data.user.role === "ADMIN") {
          router.push("/admin/dashboard")
        } else {
          router.push("/customer/menu")
        }
      } else {
        setError(data.message || "Login failed")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Login failed")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-card rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-foreground">Login</h1>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-border rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition"
        >
          Login
        </button>
      </form>
    </div>
  )
}
