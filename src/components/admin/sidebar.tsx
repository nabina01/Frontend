"use client"

import type React from "react"

import { useAuth } from "@/src/context/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import {
  Coffee,
  LogOut,
  LayoutDashboard,
  ShoppingCart,
  Utensils,
  BarChart3,
  Calendar,
  Clock,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: <ShoppingCart className="w-5 h-5" />,
  },
  {
    href: "/admin/inventory",
    label: "Inventory",
    icon: <Utensils className="w-5 h-5" />,
  },
  {
    href: "/admin/reservations",
    label: "Reservations",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    href: "/admin/reports",
    label: "Reports",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: <Clock className="w-5 h-5" />,
  },
]

export default function AdminSidebar() {
  const { logout, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-card border border-border"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } z-40`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="bg-sidebar-primary rounded-lg p-2">
                <Coffee className="w-6 h-6 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-sidebar-foreground">Aromalaya</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    onClick={() => setOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </button>
                </Link>
              )
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-sidebar-border space-y-3">
            <div className="px-4 py-2">
              <p className="text-sm text-sidebar-foreground font-semibold">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
            <Button
              onClick={handleLogout}
              className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setOpen(false)} />}
    </>
  )
}
