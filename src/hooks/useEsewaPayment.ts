import { useState } from "react";
import KhaltiCheckout from "khalti-checkout-web";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2004";
const KHALTI_PUBLIC_KEY = process.env.NEXT_PUBLIC_KHALTI_PUBLIC_KEY || "test_public_key_dc74e0fd57cb46cd93832aee0a507256";

export function useKhaltiPayment() {
  const [isProcessing, setIsProcessing] = useState(false);

  const initiateKhaltiPayment = async (
    amount: number,
    reservationId?: number,
    productName: string = "Cafe Order",
    onSuccess?: () => void,
    onError?: (error: any) => void
  ) => {
    try {
      setIsProcessing(true);

      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/api/payments/initiate-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          paymentGateway: "khalti",
          reservationId,
          productName,
          purchaseOrderId: `KHL-${Date.now()}`,
          purchaseOrderName: productName,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Payment initiation failed";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If it's not JSON, use the default message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const { payment } = data;

      // Initialize Khalti Checkout
      const config = {
        publicKey: KHALTI_PUBLIC_KEY,
        productIdentity: payment.transactionUuid,
        productName: productName,
        productUrl: window.location.origin,
        eventHandler: {
          onSuccess(payload: any) {
            console.log("Khalti Payment Success:", payload);
            // Redirect to payment success page with Khalti response
            window.location.href = `/payment-success?token=${payload.token}&amount=${amount.toFixed(2)}&transactionUuid=${payment.transactionUuid}`;
          },
          onError(error: any) {
            console.error("Khalti Payment Error:", error);
            if (onError) {
              onError(error);
            }
            setIsProcessing(false);
          },
          onClose() {
            console.log("Khalti widget closed");
            setIsProcessing(false);
          }
        },
        paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
      };

      const checkout = new KhaltiCheckout(config);
      checkout.show({ amount: amount * 100 }); // Amount in paisa (1 Rs = 100 paisa)
    } catch (error) {
      console.error("Khalti payment error:", error);
      if (onError) {
        onError(error);
      }
      setIsProcessing(false);
    }
  };

  return {
    initiateKhaltiPayment,
    isProcessing,
  };
}
