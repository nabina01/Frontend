"use client"

import { useAuth } from "@/src/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { Loader2 } from "lucide-react"
import LoginPage from "@/src/components/auth/login-page"

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const hasRedirected = useRef(false)

  useEffect(() => {
    // Reset redirect flag when user becomes unauthenticated
    if (!isAuthenticated) {
      hasRedirected.current = false
      return
    }
    

    if (!isLoading && isAuthenticated && user && !hasRedirected.current) {
      hasRedirected.current = true
      // Only redirect once when user becomes authenticated
      if ((user.role as string) === "ADMIN") {
        router.push("/admin/dashboard")
      } else {
        router.push("/customer/home")
      }
    }
  }, [isLoading, isAuthenticated, user?.role, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return <LoginPage />
}
