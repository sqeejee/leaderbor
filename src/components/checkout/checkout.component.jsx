import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe Publishable Key
const stripePromise = loadStripe('pk_live_51MKsf9DT4vO9oNMHllWJqDaC267tqoHAHolpUwnUbbbFdISRVEBXzjVzc4VfC0MNKAGwI0VNNMfLU4ikUlpcDGCc00C2GBNKc5');

const DonationForm = () => {
  const [selectedAmount, setSelectedAmount] = useState(10);

  useEffect(() => {
    // Any additional setup or side effects can go here
  }, []);

  const handleAmountChange = (event) => {
    setSelectedAmount(parseInt(event.target.value, 10));
  };

  const handleDonateClick = async () => {
    // Call your payment processing function here
    const stripe = await stripePromise;

    // Replace with your serverless function endpoint
    const response = await fetch('/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: selectedAmount * 100 }), // Amount in cents
    });

    const { clientSecret } = await response.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: stripe.elements.getElement('card'),
        billing_details: {
          name: 'Test User',
        },
      },
    });

    if (result.error) {
      console.error(result.error.message);
    } else {
      // Payment succeeded, you can handle success logic here
      console.log('Payment succeeded:', result.paymentIntent);
    }
  };

  return (
    <div>
      <h2>Donation Amount</h2>
      <label>
        Select Amount:
        <select value={selectedAmount} onChange={handleAmountChange}>
          <option value={10}>$10</option>
          <option value={20}>$20</option>
          <option value={50}>$50</option>
          {/* Add more options as needed */}
        </select>
      </label>
      <button onClick={handleDonateClick}>Donate ${selectedAmount}</button>
    </div>
  );
};

export default DonationForm;
