import { useState } from 'react';
import KhaltiCheckout from 'khalti-checkout-web';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2004';

interface KhaltiConfig {
  publicKey: string;
  productIdentity: string;
  productName: string;
  productUrl: string;
  amount: number;
}

interface PaymentData {
  token: string;
  amount: number;
  transactionUuid: string;
}

export const useKhaltiPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const initiateKhaltiPayment = async (
    amount: number,
    reservationId?: number,
    productName?: string,
    onSuccess?: () => void,
    onError?: (error: any) => void
  ) => {
    try {
      setIsProcessing(true);

      // Step 1: Initiate payment on backend
      const response = await fetch(`${API_BASE_URL}/api/payments/initiate-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          paymentGateway: 'khalti',
          reservationId,
          productName: productName || 'Cafe Order',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate payment');
      }

      const data = await response.json();
      const khaltiConfig: KhaltiConfig = data.khaltiConfig;

      // Step 2: Initialize Khalti Checkout
      const config = {
        // Test public key - replace with your actual test key
        publicKey: khaltiConfig.publicKey || 'test_public_key_dc74e0fd57cb46cd93832aee0a507256',
        productIdentity: khaltiConfig.productIdentity,
        productName: khaltiConfig.productName,
        productUrl: khaltiConfig.productUrl,
        eventHandler: {
          onSuccess: async (payload: any) => {
            console.log('Khalti payment success:', payload);
            
            // Step 3: Verify payment on backend
            try {
              const verifyResponse = await fetch(`${API_BASE_URL}/api/payments/verify-khalti`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  token: payload.token,
                  amount: payload.amount,
                  transactionUuid: khaltiConfig.productIdentity,
                }),
              });

              if (!verifyResponse.ok) {
                throw new Error('Payment verification failed');
              }

              const verifyData = await verifyResponse.json();
              console.log('Payment verified:', verifyData);
              
              setIsProcessing(false);
              if (onSuccess) onSuccess();
            } catch (error) {
              console.error('Verification error:', error);
              setIsProcessing(false);
              if (onError) onError(error);
            }
          },
          onError: (error: any) => {
            console.error('Khalti payment error:', error);
            setIsProcessing(false);
            if (onError) onError(error);
          },
          onClose: () => {
            console.log('Khalti widget closed');
            setIsProcessing(false);
          },
        },
        paymentPreference: ['KHALTI', 'EBANKING', 'MOBILE_BANKING', 'CONNECT_IPS', 'SCT'],
      };

      // Step 4: Show Khalti checkout widget
      const checkout = new KhaltiCheckout(config);
      checkout.show({ amount: khaltiConfig.amount });

    } catch (error) {
      console.error('Error initiating Khalti payment:', error);
      setIsProcessing(false);
      if (onError) onError(error);
    }
  };

  return {
    initiateKhaltiPayment,
    isProcessing,
  };
};
