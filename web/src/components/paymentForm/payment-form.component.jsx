import {CardElement, useElements, useStripe} from '@stripe/react-stripe-js';
import axios from 'axios';
import { useState } from 'react';
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
            ':-webkit-autofill': {color: '#fce883'},
            '::placeholder': {color: '#87bbfd'},
        },
        invalid: {
            iconColor: '#ffc7ee',
            color: '#ffc7ee',
        },
}   
};

const PaymentForm = () => {
    const [success, setSuccess] = useState(false);
    const [amount, setAmount] = useState(0); // State to hold the payment amount
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cardElement = elements.getElement(CardElement);
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });
        
        if (!error) {
            try {
                const {id} = paymentMethod;
                const paymentAmount = 10000; // Define the amount here or retrieve from another state if dynamic
                const response = await axios.post('https://localhost:4000/payment', {
                    amount: paymentAmount,
                    id,
                });

                if (response.data.success) {
                    setSuccess(true);
                    setAmount(response.data.amount || paymentAmount); // Update the amount state
                }
            } catch (error) {
                console.log('Error', error);
                setSuccess(false); // Ensure success is false on error
            }
        } else {
            console.log(error.message);
        }
    };

    return (
        <>
            {!success ? (
                <form onSubmit={handleSubmit}>
                    <fieldset className="FormGroup-Stripe">
                        <div className="FormRow-Stripe">
                            <CardElement options={CARD_OPTIONS}/>
                        </div>
                    </fieldset>
                    <Button type="submit">Pay</Button>
                </form>
            ) : (
                <div>
                    {/* Display the amount on successful payment */}
                    <h2>Your payment of ${amount / 100} was successful!</h2> 
                </div>
            )}
        </>
    );
};

export default PaymentForm;
