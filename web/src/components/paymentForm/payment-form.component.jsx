import React, { useEffect, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import './payment-form.styles.scss';
import Button from '../button/button.component';

const CARD_OPTIONS = {
    iconStyle: 'solid',
    style: {
        base: {
            iconColor: '#c4f0ff',
            color: '#fff',
            fontWeight: 500,
            fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',
            ':-webkit-autofill': { color: '#fce883' },
            '::placeholder': { color: '#87bbfd' },
        },
        invalid: {
            iconColor: '#ffc7ee',
            color: '#ffc7ee',
        },
    }
}

    const PaymentForm = ({ price }) => {
        const stripe = useStripe();
        const elements = useElements();
        const [success, setSuccess] = useState(false);

        // Convert price to cents as Stripe expects amounts to be in the smallest currency unit
        const paymentAmount = Math.round(price * 100);

        const handlePayment = async () => {
            // Guard clause for Stripe or Elements not being loaded
            if (!stripe || !elements) {
                console.log("Stripe has not loaded yet.");
                return;
            }

            const cardElement = elements.getElement(CardElement);
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (!error) {
                try {
                    const { id } = paymentMethod;
                    const response = await axios.post('https://localhost:4000/payment', {
                        amount: paymentAmount,
                        id,
                    });

                    if (response.data.success) {
                        console.log("Payment successful:", response.data);
                        setSuccess(true);
                    } else {
                        console.error("Payment failed:", response.data);
                        setSuccess(false);
                    }
                } catch (error) {
                    console.error("Payment error:", error.response ? error.response.data : error);
                    setSuccess(false);
                }
            } else {
                console.log(error.message);
                setSuccess(false);
            }
        };

        useEffect(() => {
            // Ensure Stripe is loaded and price is valid before attempting payment
            if (stripe && elements && paymentAmount > 0) {
                handlePayment();
            }
        }, [stripe, elements, paymentAmount]);

        if (success) {
            return (
                <div>
                    <h2>Your payment of ${price} was successful!</h2>
                </div>
            );
        }

        return (
            <div>
                <fieldset className="FormGroup-Stripe">
                    <div className="FormRow-Stripe">
                        <CardElement options={CARD_OPTIONS} />
                    </div>
                </fieldset>
                {/* The Pay button is for visual purposes, actual payment trigger is done via useEffect */}
                <Button type="button" disabled={!stripe || !elements || success}>
                    Pay
                </Button>
            </div>
        );
    }

export default PaymentForm;
