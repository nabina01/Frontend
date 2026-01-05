"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Loader2, TrendingUp, Users, ShoppingCart, Calendar } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2004"

interface DashboardData {
  totalCustomers: number;
  totalOrders: number;
  totalIncome: number;
  totalReservations: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/counts`)
        if (response.ok) {
          const data = await response.json()
          setStats({
            totalCustomers: data.totalCustomers,
            totalOrders: data.totalOrders,
            totalIncome: data.totalIncome,
            totalReservations: data.totalReservations
          })
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: "text-blue-600",
    },
    {
      title: "Total Revenue",
      value: `Rs. ${stats?.totalIncome || 0}`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-green-600",
    },
    {
      title: "Total Customers",
      value: stats?.totalCustomers || 0,
      icon: <Users className="w-6 h-6" />,
      color: "text-purple-600",
    },
    {
      title: "Total Reservations",
      value: stats?.totalReservations || 0,
      icon: <Calendar className="w-6 h-6" />,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={card.color}>{card.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
