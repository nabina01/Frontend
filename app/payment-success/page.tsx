"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2004";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState<"success" | "failed" | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      const statusParam = searchParams.get("status");
      const method = searchParams.get("method");
      const amount = searchParams.get("amount");
      const token = searchParams.get("token"); // Khalti payment token
      const transactionUuid = searchParams.get("transactionUuid"); // Transaction UUID

      // Handle cash payment success
      if (statusParam === "success" && method === "cash") {
        setStatus("success");
        setMessage(`Your order of Rs. ${amount} has been placed successfully with cash payment!`);
        setVerifying(false);
        return;
      }

      if (statusParam === "failed") {
        setStatus("failed");
        setMessage("Payment was cancelled or failed.");
        setVerifying(false);
        return;
      }

      // For Khalti success, token, amount, and transactionUuid will be present
      if (!token || !amount || !transactionUuid) {
        setStatus("failed");
        setMessage("Invalid payment response from Khalti.");
        setVerifying(false);
        return;
      }

      try {
        const authToken = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/api/payments/verify-khalti`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            transactionUuid,
            token,
            amount: parseFloat(amount),
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage("Payment verified successfully!");
          
          // Get pending cart data and create order
          const userData = localStorage.getItem("user");
          const user = userData ? JSON.parse(userData) : null;
          const userId = user?.id;

          if (userId) {
            const pendingCartKey = `khalti-pending-cart-${userId}`;
            const cartDataStr = localStorage.getItem(pendingCartKey);
            
            if (cartDataStr) {
              try {
                const cartData = JSON.parse(cartDataStr);
                
                // Create order with the cart items
                if (cartData.items && cartData.items.length > 0) {
                  await fetch(`${API_BASE_URL}/api/orders`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                      customerName: cartData.customerName || "Customer",
                      items: cartData.items.map((item: any) => ({
                        itemId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                      })),
                      totalAmount: parseFloat(amount),
                      orderPaymentType: "KHALTI",
                    }),
                  });
                }
                
                // Remove pending cart data
                localStorage.removeItem(pendingCartKey);
              } catch (e) {
                console.error("Failed to create order:", e);
              }
            }
            
            // Clear the actual cart
            const cartKey = `cafe-cart-${userId}`;
            localStorage.removeItem(cartKey);
          }
          
          // Also clear generic cart key if exists
          localStorage.removeItem("cart");
        } else {
          setStatus("failed");
          setMessage(data.message || "Payment verification failed.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("failed");
        setMessage("Failed to verify payment. Please contact support.");
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleContinue = () => {
    if (status === "success") {
      router.push("/customer/home");
    } else {
      router.push("/customer/cart");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Payment Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            {verifying ? (
              <>
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <p className="text-muted-foreground">Verifying payment...</p>
              </>
            ) : status === "success" ? (
              <>
                <CheckCircle className="w-16 h-16 text-green-500" />
                <p className="text-lg font-semibold text-foreground">Payment Successful!</p>
                <p className="text-sm text-muted-foreground text-center">{message}</p>
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 text-red-500" />
                <p className="text-lg font-semibold text-foreground">Payment Failed</p>
                <p className="text-sm text-muted-foreground text-center">{message}</p>
              </>
            )}
          </div>

          {!verifying && (
            <Button
              onClick={handleContinue}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {status === "success" ? "Continue Shopping" : "Back to Cart"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
