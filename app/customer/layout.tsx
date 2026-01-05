"use client"

import { ProtectedRoute } from "@/src/components/auth/protected-route"
import CustomerNavbar from "@/src/components/customer/navbar"
import type { ReactNode } from "react"

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="USER">
      <div className="min-h-screen bg-background">
        <CustomerNavbar />
        <main className="pt-16">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
