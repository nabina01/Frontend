"use client"

import { useEffect, useState } from "react"
import { Loader2, Coffee, UtensilsCrossed, Clock, User as UserIcon, Mail, Shield, ChevronLeft, ChevronRight, ShoppingCart, Calendar, Heart, Bell, Star, Gift, Phone, MapPin } from "lucide-react"
import { Card } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2004"

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface Reservation {
  id: number
  customerName: string
  tableNumber: number
  partySize: number
  reservationTime: string
  status: string
}

interface Order {
  id: number
  totalAmount: number
  status: string
  createdAt: string
  orderItems?: Array<{
    menuItem: {
      name: string
    }
    quantity: number
  }>
}

export default function UserHomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetchUser()
    fetchReservations()
    fetchOrders()
  }, [])

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        window.location.href = "/login"
        return
      }
      
      const response = await fetch(`${API_BASE_URL}/api/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      
      if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem("accessToken")
        window.location.href = "/login"
        return
      }
      
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) return
      
      const response = await fetch(`${API_BASE_URL}/api/reservations`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      
      console.log("Reservations response status:", response.status)
      
      if (response.status === 401) {
        localStorage.removeItem("accessToken")
        window.location.href = "/login"
        return
      }
      
      if (response.ok) {
        const data = await response.json()
        console.log("Reservations data:", data)
        
        // Handle both array and object responses
        const reservationsList = Array.isArray(data) ? data : (data.data || data.reservations || [])
        
        // Filter to show only upcoming/confirmed reservations for the logged-in user
        const userReservations = reservationsList.filter((r: Reservation) => 
          r.status === 'confirmed' || r.status === 'pending'
        )
        setReservations(userReservations)
      } else {
        console.error("Failed to fetch reservations:", response.status, response.statusText)
        setReservations([])
      }
    } catch (err) {
      console.error("Error fetching reservations:", err instanceof Error ? err.message : String(err))
      setReservations([])
    }
  }

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) return
      
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      
      console.log("Orders response status:", response.status)
      
      if (response.status === 401) {
        localStorage.removeItem("accessToken")
        window.location.href = "/login"
        return
      }
      
      if (response.ok) {
        const data = await response.json()
        console.log("Orders data:", data)
        
        // Handle both array and object responses
        const ordersList = Array.isArray(data) ? data : (data.data || data.orders || [])
        
        // Get recent orders (last 5)
        const recentOrders = ordersList.slice(0, 5)
        setOrders(recentOrders)
      } else {
        console.error("Failed to fetch orders:", response.status, response.statusText)
        setOrders([])
      }
    } catch (err) {
      console.error("Error fetching orders:", err instanceof Error ? err.message : String(err))
      setOrders([])
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-stone-100 to-amber-100">
        <Loader2 className="w-12 h-12 animate-spin text-amber-800" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-stone-50 flex relative overflow-x-hidden">
      {/* Left Side - Main Content */}
      <div className="flex-1 p-8 lg:p-12 mr-16 overflow-y-auto">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-amber-950 mb-2 flex items-center gap-3">
            <Coffee className="w-12 h-12 text-amber-800" />
            Welcome Back, Customer!
          </h1>
          <p className="text-xl text-stone-700">Your daily dose of happiness awaits ☕</p>
        </div>

      {/* Menu Highlights */}
        <Card className="p-6 mb-8 bg-white/90 backdrop-blur shadow-xl">
          <h2 className="text-3xl font-bold text-amber-950 mb-6 flex items-center gap-2">
            <UtensilsCrossed className="w-8 h-8 text-amber-800" />
            Today's Menu Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-amber-100 to-stone-200 p-4 rounded-lg">
                <div className="text-4xl mb-2">☕</div>
                <h4 className="text-lg font-bold text-amber-950 mb-1">Espresso</h4>
                <p className="text-sm text-stone-700 mb-2">Rich and bold</p>
                <p className="text-xl font-bold text-amber-800">Rs 100</p>
              </div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-stone-200 to-amber-100 p-4 rounded-lg">
                <div className="text-4xl mb-2">🥐</div>
                <h4 className="text-lg font-bold text-amber-950 mb-1">Croissant</h4>
                <p className="text-sm text-stone-700 mb-2">Fresh baked</p>
                <p className="text-xl font-bold text-amber-800">Rs 120</p>
              </div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-amber-100 to-yellow-100 p-4 rounded-lg">
                <div className="text-4xl mb-2">🥤</div>
                <h4 className="text-lg font-bold text-amber-950 mb-1">Chocolate MilkShake</h4>
                <p className="text-sm text-stone-700 mb-2">Chocolate delight</p>
                <p className="text-xl font-bold text-amber-800">Rs 200</p>
              </div>
            </div>
          </div>
        </Card>
       

        {/* Offers & Loyalty Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-amber-700 to-amber-800 text-white shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Your Rewards</h3>
                <p className="text-4xl font-bold mb-2">350 <span className="text-lg">Points</span></p>
                <p className="text-sm opacity-90">50 points away from a free coffee!</p>
              </div>
              <Star className="w-12 h-12 text-yellow-300" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-800 to-yellow-900 text-white shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Special Offer</h3>
                <p className="text-lg mb-2">Buy 1 Get 1 Free</p>
                <p className="text-sm opacity-90">On all beverages until 5 PM</p>
              </div>
              <Gift className="w-12 h-12 text-amber-200" />
            </div>
          </Card>
        </div>

        {/* Cafe Info and Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-yellow-800 to-amber-800 text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Bell className="w-6 h-6" />
              Notifications
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-white/20 backdrop-blur rounded-lg">
                <p className="text-sm font-semibold">🎉 New Menu Item!</p>
                <p className="text-xs opacity-90">Try our new Caramel Macchiato</p>
              </div>
              <div className="p-3 bg-white/20 backdrop-blur rounded-lg">
                <p className="text-sm font-semibold">⏰ Happy Hour Alert</p>
                <p className="text-xs opacity-90">20% off from 3-5 PM today</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-800 to-amber-900 text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              Cafe Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <div>
                  <p className="text-sm font-semibold">Opening Hours</p>
                  <p className="text-xs opacity-90">Mon-Fri: 7AM - 9PM</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <div>
                  <p className="text-sm font-semibold">Contact</p>
                  <p className="text-xs opacity-90">(+977)9813487800 </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <div>
                  <p className="text-sm font-semibold">Location</p>
                  <p className="text-xs opacity-90">Banepa, Kavrepalanchok, Nepal</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Right Sidebar - User Profile (Collapsible) */}
      <div 
        className={`fixed right-0 top-0 h-full bg-gradient-to-b from-amber-900 to-stone-900 shadow-2xl transition-all duration-300 ease-in-out z-50 ${
          sidebarOpen ? 'w-80' : 'w-16'
        }`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        {/* Toggle Indicator */}
        <div className="absolute left-4 top-6">
          {sidebarOpen ? (
            <ChevronRight className="w-6 h-6 text-white/70" />
          ) : (
            <ChevronLeft className="w-6 h-6 text-white/70" />
          )}
        </div>

        <div className={`p-6 flex flex-col h-full transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="text-center mb-6 mt-8">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full mx-auto flex items-center justify-center shadow-lg mb-4 border-4 border-white/20">
              <UserIcon className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">My Profile</h2>
            <p className="text-xs text-amber-200 mt-1">Logged in as {user?.role}</p>
          </div>

          {user ? (
            <div className="space-y-4 flex-1 overflow-y-auto">
              <Card className="p-4 bg-white/10 backdrop-blur border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <UserIcon className="w-5 h-5 text-amber-300" />
                  <span className="text-sm font-medium text-amber-200">Full Name</span>
                </div>
                <p className="text-lg font-semibold text-white ml-8">{user.name}</p>
              </Card>

              <Card className="p-4 bg-white/10 backdrop-blur border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-amber-300" />
                  <span className="text-sm font-medium text-amber-200">Email Address</span>
                </div>
                <p className="text-sm font-medium text-white ml-8 break-all">{user.email}</p>
              </Card>

              <Card className="p-4 bg-white/10 backdrop-blur border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-amber-300" />
                  <span className="text-sm font-medium text-amber-200">Account Type</span>
                </div>
                <p className="text-lg font-semibold text-white ml-8 uppercase">{user.role}</p>
              </Card>

              <Card className="p-4 bg-white/10 backdrop-blur border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-5 h-5 text-amber-300" />
                  <span className="text-sm font-medium text-amber-200">Loyalty Points</span>
                </div>
                <p className="text-2xl font-bold text-white ml-8">350</p>
              </Card>

              <div className="pt-4 mt-auto">
                <div className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20">
                  <p className="text-xs text-amber-200 text-center">
                    ☕ Member since {new Date().getFullYear()}
                  </p>
                  <p className="text-xs text-amber-300 text-center mt-2 font-semibold">
                    Welcome, {user.name.split(' ')[0]}!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-white/70">No user info available</p>
            </div>
          )}
        </div>

        {/* Collapsed State - Icon Only */}
        {!sidebarOpen && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center shadow-lg">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
