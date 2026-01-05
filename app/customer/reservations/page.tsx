"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Loader2, Calendar, Users, Clock } from "lucide-react"
import { useAuth } from "@/src/context/auth-context"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2004"

interface Reservation {
  id: string
  numberOfPeople: number
  reservationTime: string
  tableNumber: number
  status: string
}

export default function ReservationsPage() {
  const { user, isAuthenticated } = useAuth()

  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [people, setPeople] = useState("2")
  const [notes, setNotes] = useState("")
  const [tableNumber, setTableNumber] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  //  Get token and userId from localStorage 
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null
  const currentUser = user || (storedUser ? JSON.parse(storedUser) : null)
  const userId = currentUser?.id

  useEffect(() => {
    if (isAuthenticated && userId) fetchReservations()
  }, [isAuthenticated, userId])

  const fetchReservations = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/reservations/userid/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      let data
      try {
        data = await res.json()
      } catch (err) {
        const text = await res.text()
        console.error("Expected JSON but got:", text)
        setLoading(false)
        return
      }

      if (res.ok) {
        setReservations(data.data)
      } else {
        console.error("Fetch reservations failed:", data)
      }
    } catch (err) {
      console.error("Fetch reservations error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleBookTable = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser || !token) {
      setSuccessMessage("You must be logged in to book a table")
      return
    }

    // Debug log
    console.log({
      customerName: currentUser.name,
      email: currentUser.email,
      userId,
      reservationTime: `${date}T${time}`,
      numberOfPeople: Number.parseInt(people),
      tableNumber: Number.parseInt(tableNumber),
      specialRequests: notes,
      token,
    })

    try {
      const res = await fetch(`${API_BASE_URL}/api/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName: currentUser.name,
          email: currentUser.email,
          phone: "", // optional
          reservationTime: `${date}T${time}`,
          numberOfPeople: Number.parseInt(people),
          tableNumber: Number.parseInt(tableNumber),
          specialRequests: notes,
          userId,
        }),
      })

      let data
      try {
        data = await res.json()
      } catch (err) {
        const text = await res.text()
        console.error("Booking response is not JSON:", text)
        setSuccessMessage("Booking failed (non-JSON response)")
        setTimeout(() => setSuccessMessage(""), 3000)
        return
      }

      if (res.ok) {
        setSuccessMessage("Reservation booked successfully!")
        setTimeout(() => setSuccessMessage(""), 3000)
        setDate("")
        setTime("")
        setPeople("2")
        setNotes("")
        setTableNumber("")
        fetchReservations()
      } else {
        console.error("Booking failed:", data)
        setSuccessMessage(data.message || "Failed to book reservation")
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    } catch (err) {
      console.error("Booking failed:", err)
      setSuccessMessage("Booking failed")
      setTimeout(() => setSuccessMessage(""), 3000)
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-4">Table Reservations</h1>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{successMessage}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Book a Table</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBookTable} className="space-y-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="people">Number of People</Label>
                  <Input
                    id="people"
                    type="number"
                    min="1"
                    max="7"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tableNumber">Table Number</Label>
                  <Input
                    id="tableNumber"
                    type="number"
                    min="1"
                    max="10"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Special Requests</Label>
                  <textarea
                    id="notes"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
                    rows={3}
                    placeholder="Any special requests?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Book Table
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Reservations List */}
        <div className="lg:col-span-2">
          {reservations.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No reservations yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <Card key={reservation.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">
                        Reservation (Table {reservation.tableNumber})
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          reservation.status === "CONFIRMED"
                            ? "bg-green-100 text-green-800"
                            : reservation.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(reservation.reservationTime).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {new Date(reservation.reservationTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {reservation.numberOfPeople} people
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
