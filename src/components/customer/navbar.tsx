"use client"

import { useAuth } from "@/src/context/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Coffee, LogOut, ShoppingCart, Home, Calendar } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/src/context/cart-context"

export default function CustomerNavbar() {
  const { logout, user } = useAuth()
  const { items } = useCart()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/customer/menu")}>
            <Coffee className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg text-foreground">Aromalaya</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/customer/home"
              className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/customer/menu"
              className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Menu
            </Link>
            <Link
              href="/customer/reservations"
              className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Reservations
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link href="/customer/cart" className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">{user?.name}</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
