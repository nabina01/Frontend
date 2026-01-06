"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Loader2 } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2004"

interface AllReports {
  sales: {
    totalSales: number
    totalOrders: number
    averageOrderValue: number
    paymentMethods: Record<string, number>
  }
  inventory: {
    totalItems: number
    lowStockItems: Array<any>
    expiringItems: Array<any>
    categoryBreakdown: Record<string, number>
  }
  reservations: {
    totalReservations: number
    confirmed: number
    cancelled: number
    completed: number
    averagePartySize: number
  }
}

export default function ReportsPage() {
  const [reports, setReports] = useState<AllReports | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/allreport`)
      if (response.ok) {
        const data = await response.json()
        setReports(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch report:", error)
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
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">Reports</h1>

      {reports && (
        <>
         
          <h2 className="text-2xl font-semibold mb-4">Sales Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader><CardTitle>Total Orders</CardTitle></CardHeader>
              <CardContent>{reports.sales.totalOrders}</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Total Revenue</CardTitle></CardHeader>
              <CardContent>Rs. {reports.sales.totalSales}</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Average Order Value</CardTitle></CardHeader>
              <CardContent>Rs. {reports.sales.averageOrderValue}</CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader><CardTitle>Payment Methods</CardTitle></CardHeader>
            <CardContent>
              {Object.entries(reports.sales.paymentMethods).map(([method, count], idx) => (
                <div key={idx} className="flex justify-between border-b border-border py-2">
                  <span>{method}</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>

        
          <h2 className="text-2xl font-semibold mb-4">Inventory Report</h2>
          <Card className="mb-4">
            <CardHeader><CardTitle>Total Items</CardTitle></CardHeader>
            <CardContent>{reports.inventory.totalItems}</CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader><CardTitle>Expiring Items</CardTitle></CardHeader>
            <CardContent>
              {reports.inventory.expiringItems.length === 0
                ? <p className="text-muted-foreground">None</p>
                : reports.inventory.expiringItems.map(item => (
                  <div key={item.id} className="flex justify-between border-b border-border py-2">
                    <span>{item.name}</span>
                    <span className="text-red-600 font-bold">{item.currentStock}</span>
                  </div>
                ))
              }
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader><CardTitle>Category Breakdown</CardTitle></CardHeader>
            <CardContent>
              {Object.entries(reports.inventory.categoryBreakdown).map(([cat, count], idx) => (
                <div key={idx} className="flex justify-between border-b border-border py-2">
                  <span>{cat}</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          
          <h2 className="text-2xl font-semibold mb-4">Reservation Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader><CardTitle>Total Reservations</CardTitle></CardHeader>
              <CardContent>{reports.reservations.totalReservations}</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Confirmed</CardTitle></CardHeader>
              <CardContent>{reports.reservations.confirmed}</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Average Party Size</CardTitle></CardHeader>
              <CardContent>{reports.reservations.averagePartySize}</CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
