"use client"

import { useCart } from "@/src/context/cart-context"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { ArrowLeft, Trash2, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useKhaltiPayment } from "@/src/hooks/useEsewaPayment"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog"
import { useToast } from "@/src/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2004";

export default function CartPage() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "KHALTI">("CASH")
  const { initiateKhaltiPayment, isProcessing } = useKhaltiPayment()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const { toast } = useToast()

  const handleCheckoutClick = () => {
    if (items.length === 0) return
    setShowConfirmDialog(true)
  }

  const handleCheckout = async () => {
    setShowConfirmDialog(false)
    if (items.length === 0) return

    // Handle Khalti payment
    if (paymentMethod === "KHALTI") {
      // Store cart data in localStorage before redirecting to payment
      const userData = localStorage.getItem("user")
      const user = userData ? JSON.parse(userData) : null
      const userId = user?.id
      
      if (userId) {
        const cartData = {
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          total: total,
          customerName: user?.name || "Customer"
        }
        localStorage.setItem(`khalti-pending-cart-${userId}`, JSON.stringify(cartData))
      }

      await initiateKhaltiPayment(
        total,
        undefined, // reservationId
        "Cafe Order",
        () => {
          // On success - don't clear cart here, let payment-success page handle it
          toast({
            title: "Redirecting to Payment...",
            description: "Please complete your payment.",
            variant: "default",
          })
        },
        (error) => {
          // On error
          console.error("Payment failed:", error)
          toast({
            title: "Payment Failed",
            description: "Please try again.",
            variant: "destructive",
          })
        }
      )
      return
    }

    // Handle Cash payment
    try {
      const token = localStorage.getItem("accessToken")
      const userData = localStorage.getItem("user")
      const user = userData ? JSON.parse(userData) : null
      const customerName = user?.name || "Customer"
      
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          customerName: customerName,
          items: items.map((item) => ({
            itemId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: total,
          orderPaymentType: paymentMethod,
        }),
      })

      if (response.ok) {
        clearCart()
        // Redirect to success page
        window.location.href = `/payment-success?status=success&method=cash&amount=${total.toFixed(2)}`
      } else {
        const errorData = await response.json()
        toast({
          title: "Order Failed",
          description: errorData.message || "Failed to place order",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Checkout failed:", error)
      toast({
        title: "Checkout Failed",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/customer/menu">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Your Cart</h1>
      </div>

      {items.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-muted-foreground text-lg">Your cart is empty</p>
          <Link href="/customer/menu">
            <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">Continue Shopping</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-primary font-bold">Rs. {item.price}</p>
                    </div>
                  
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mx-4">
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Subtotal & Delete */}
                    <div className="text-right min-w-[120px]">
                      <p className="font-bold text-foreground">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="mt-2 text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items Count */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items ({items.length})</span>
                  <span className="text-foreground">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>

                {/* Total */}
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">Rs. {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2 border-t border-border pt-4">
                  <p className="text-sm font-semibold text-foreground">Payment Method</p>
                  <div className="space-y-2">
                    <label
                      className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors"
                      style={{ borderColor: paymentMethod === "CASH" ? "var(--primary)" : undefined }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="CASH"
                        checked={paymentMethod === "CASH"}
                        onChange={(e) => setPaymentMethod(e.target.value as "CASH" | "KHALTI" )}
                        className="mr-3"
                      />
                      <span className="text-sm text-foreground">Cash</span>
                    </label>
                   
                    <label
                      className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors"
                      style={{ borderColor: paymentMethod === "KHALTI" ? "var(--primary)" : undefined }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="KHALTI"
                        checked={paymentMethod === "KHALTI"}
                        onChange={(e) => setPaymentMethod(e.target.value as "CASH" | "KHALTI")}
                        className="mr-3"
                      />
                      <span className="text-sm text-foreground">Khalti Payment</span>
                    </label>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckoutClick}
                  disabled={isProcessing}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10"
                >
                  {isProcessing ? "Processing..." : "Proceed to Checkout"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to place this order with {paymentMethod === "CASH" ? "Cash" : "Khalti"} payment?
              <br />
              <span className="font-semibold mt-2 block">Total Amount: Rs. {total.toFixed(2)}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCheckout}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
