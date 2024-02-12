import React, { useState, useContext, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';
import axios from 'axios';
import { updatePost, getPostByUserName } from '../../utils/firebase/firebase.utils';
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

const UpdatePost = () => {
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const [success, setSuccess] = useState(false);
    const [originalPrice, setOriginalPrice] = useState(0); // Store the original price for comparison
    const [postDetails, setPostDetails] = useState(null); // Store the fetched post details

    const defaultFormFields = {
        price: "",
        message: "",
        image: "",
    };

    const [formFields, setFormFields] = useState(defaultFormFields);
    const { message, price, image } = formFields;

    useEffect(() => {
        const fetchUserPost = async () => {
            if (currentUser) {
                try {
                    const post = await getPostByUserName(currentUser.displayName);
                    if (post) {
                        setFormFields({
                            message: post.message || "",
                            price: post.value.toString() || "", // Assuming 'value' is the field for price in your post data model
                            image: post.image || "",
                        });
                        setOriginalPrice(post.value || 0); // Set the original price for comparison
                        setPostDetails(post); // Store the entire fetched post
                    }
                } catch (error) {
                    console.log("Error fetching user's post:", error);
                }
            }
        };

        fetchUserPost();
    }, [currentUser]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormFields({ ...formFields, [name]: value });
    };

    const isPriceValid = () => parseFloat(price) >= originalPrice;

    const handleUpdatePostFree = async () => {
        if (!isPriceValid()) {
            alert("You cannot lower the price of your post.");
            return;
        }
        if (postDetails) {
            await updatePost(postDetails.id, message, image, parseFloat(price) - originalPrice);
            setSuccess(true);
            navigate('/');
        }
    };

    const handleUpdatePostPaid = async () => {
        if (!isPriceValid()) {
            alert("The new price cannot be lower than the original price.");
            return;
        }
        const paymentAmount =(Math.round((parseFloat(price) - originalPrice).toFixed(2) ) * 100);
        console.log((formFields.price - originalPrice).toFixed(2));

        if (!stripe || !elements) {
            console.log("Stripe has not loaded yet.");
            return;
        }
        
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
                    try {
                        await updatePost(postDetails.id, message, image, parseFloat(price) - originalPrice);
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

    if (!currentUser) {
        return <div><h1>Please sign in to update your post</h1></div>;
    }

    return (
        <div>
            <h1>Update your post</h1>

            <form onSubmit={(e) => e.preventDefault()}>
            <FormInput
                    label="Message"
                    maxLength={250}
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
                {(parseFloat(price) - originalPrice).toFixed(2) > 0 ? <h2>You will be charged $ {(parseFloat(price) - originalPrice).toFixed(2)}</h2> : null}
                {(parseFloat(price) - originalPrice).toFixed(2) > 0 ? 
                 <fieldset className="FormGroup-Stripe">
                    <div className="FormRow-Stripe">
                        <CardElement options={CARD_OPTIONS} />
                    </div>
                </fieldset>
                : null }
                {parseFloat(price) === originalPrice ?  <Button type="button" onClick={handleUpdatePostFree} disabled={!stripe || !elements || success || !(parseFloat(price) - originalPrice  === 0)}>
                    Update Post
                </Button> :  <Button type="button" onClick={handleUpdatePostPaid} disabled={!stripe || !elements || success}>
                    Pay
                </Button>}
            </form>
        </div>
    );
};

export default UpdatePost;
