import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';
import axios from 'axios';

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
};

const Submit = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [success, setSuccess] = useState(false);

    const defaultFormFields = {
        price: "",
    };

    const [formFields, setFormFields] = useState(defaultFormFields);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormFields({ ...formFields, [name]: value });
    }

    const submitPayment = async () => {
        const paymentAmount = Math.round(formFields.price * 100);
        console.log(paymentAmount + " (cents)");

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
                const response = await axios.post('http://localhost:4000/payment', {
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

    return (
        <div>
            <form onSubmit={(e) => e.preventDefault()}>
                <FormInput
                    label="Price"
                    type="number"
                    step="0.01"
                    required
                    onChange={handleChange}
                    name="price"
                    value={formFields.price}
                    min={0.5}
                />
                <fieldset className="FormGroup-Stripe">
                    <div className="FormRow-Stripe">
                        <CardElement options={CARD_OPTIONS} />
                    </div>
                </fieldset>
                <Button type="button" onClick={submitPayment} disabled={!stripe || !elements || success}>
                    Pay
                </Button>
            </form>
        </div>
    );
};

export default Submit;
