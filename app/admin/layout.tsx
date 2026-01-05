"use client"

import { ProtectedRoute } from "@/src/components/auth/protected-route"
import AdminSidebar from "@/src/components/admin/sidebar"
import type { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
