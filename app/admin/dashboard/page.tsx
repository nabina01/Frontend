"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Loader2, TrendingUp, TrendingDown, Users, ShoppingCart, Calendar, DollarSign } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2004"

interface DashboardData {
  totalCustomers: number;
  totalOrders: number;
  totalIncome: number;
  totalReservations: number;
}

interface ProfitLossData {
  today: {
    revenue: number;
    cost: number;
    profit: number;
    orders: number;
  };
  month: {
    revenue: number;
    cost: number;
    profit: number;
    orders: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardData | null>(null)
  const [profitLoss, setProfitLoss] = useState<ProfitLossData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        
        // Fetch basic stats
        const statsResponse = await fetch(`${API_BASE_URL}/api/dashboard/counts`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        
        // Fetch profit/loss data
        const profitResponse = await fetch(`${API_BASE_URL}/api/dashboard/profit-loss`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        
        if (statsResponse.ok) {
          const data = await statsResponse.json()
          console.log("Stats data:", data)
          setStats({
            totalCustomers: data.totalCustomers,
            totalOrders: data.totalOrders,
            totalIncome: data.totalIncome,
            totalReservations: data.totalReservations
          })
        }
        
        if (profitResponse.ok) {
          const data = await profitResponse.json()
          console.log("Profit/Loss data:", data)
          setProfitLoss(data)
        } else {
          console.error("Profit/Loss response not OK:", profitResponse.status)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
    
    // Auto-refresh every 5 seconds for real-time updates
    const interval = setInterval(fetchDashboard, 5000)
    
    return () => clearInterval(interval)
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

  // Prepare data for bar chart
  const chartData = [
    {
      name: "Today",
      Revenue: profitLoss?.today.revenue || 0,
      Cost: profitLoss?.today.cost || 0,
      Profit: profitLoss?.today.profit || 0,
    },
    {
      name: "This Month",
      Revenue: profitLoss?.month.revenue || 0,
      Cost: profitLoss?.month.cost || 0,
      Profit: profitLoss?.month.profit || 0,
    },
  ]

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of cafe management statistics (Updates every 5 seconds)</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {/* Profit & Loss Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Profit & Loss Analysis</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Today's P&L Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Today's Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Revenue</span>
              <span className="text-lg font-semibold text-green-600">
                Rs. {profitLoss?.today.revenue.toFixed(2) || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cost (40%)</span>
              <span className="text-lg font-semibold text-red-600">
                Rs. {profitLoss?.today.cost.toFixed(2) || 0}
              </span>
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-sm font-medium">Net Profit</span>
              <span className={`text-xl font-bold ${(profitLoss?.today.profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(profitLoss?.today.profit || 0) >= 0 ? (
                  <TrendingUp className="inline w-5 h-5 mr-1" />
                ) : (
                  <TrendingDown className="inline w-5 h-5 mr-1" />
                )}
                Rs. {Math.abs(profitLoss?.today.profit || 0).toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              {profitLoss?.today.orders || 0} orders today
            </div>
          </CardContent>
        </Card>

        {/* This Month's P&L Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              This Month's Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Revenue</span>
              <span className="text-lg font-semibold text-green-600">
                Rs. {profitLoss?.month.revenue.toFixed(2) || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cost (40%)</span>
              <span className="text-lg font-semibold text-red-600">
                Rs. {profitLoss?.month.cost.toFixed(2) || 0}
              </span>
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-sm font-medium">Net Profit</span>
              <span className={`text-xl font-bold ${(profitLoss?.month.profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(profitLoss?.month.profit || 0) >= 0 ? (
                  <TrendingUp className="inline w-5 h-5 mr-1" />
                ) : (
                  <TrendingDown className="inline w-5 h-5 mr-1" />
                )}
                Rs. {Math.abs(profitLoss?.month.profit || 0).toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              {profitLoss?.month.orders || 0} orders this month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue, Cost & Profit Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `Rs. ${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              />
              <Legend />
              <Bar dataKey="Revenue" fill="#10b981" />
              <Bar dataKey="Cost" fill="#ef4444" />
              <Bar dataKey="Profit" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
