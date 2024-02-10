import React, { useState, useContext } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';
import axios from 'axios';
import { addPost } from '../../utils/firebase/firebase.utils';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../contexts/users.context';

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
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const navigate = useNavigate();


    const stripe = useStripe();
    const elements = useElements();
    const [success, setSuccess] = useState(false);

    const defaultFormFields = {
        price: "",
        message: "",
        image: "",
    };

    const [formFields, setFormFields] = useState(defaultFormFields);
    const { message, price, image } = formFields;
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
        
        const userID = currentUser.uid;
        const username = currentUser.displayName;
        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });
    
        const priceRegex = /^\d+(\.\d{1,2})?$/;
        if (!priceRegex.test(price) || parseFloat(price) < 0.01) {
          alert("Invalid price entry. Please enter a non-negative value with up to two decimal places.");
          return;
        }

        const resetFormFields = () => {
            setFormFields(defaultFormFields);
          };

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
                    

                    const postPrice = paymentAmount/100
                    //PAYMENT IS SUCCESSFUL, THIS ACTUALLY PUTS IN THE POST!
                    try {
                        await addPost(userID, username, message, image, postPrice);
                        resetFormFields();
                        navigate('/');
                    } catch (error) {
                        console.log(error);
                      }
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
                label="Message"
                type="text"
                required
                onChange={handleChange}
                name="message"
                value={message}
                />
                <FormInput
                    label="Price"
                    type="number"
                    step="0.01"
                    required
                    onChange={handleChange}
                    name="price"
                    value={price}
                  />
                <FormInput
                    label="Image URL"
                    type="text"
                    required
                    onChange={handleChange}
                    name="image"
                    value={image}
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
