import React, { useState, useContext } from "react";
import { UserContext } from '../../contexts/users.context';
import FormInput from "../form-input/form-input.component";
import Button from "../button/button.component";
import { addPost } from '../../utils/firebase/firebase.utils';
import { useNavigate } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../paymentForm/payment-form.component';

const PUBLIC_KEY = 'pk_test_51MKsf9DT4vO9oNMHcr5fVekm0L7XxNWmvFFePcgjmEkzdViRmaRSu93GDOYX767wVbwgLq0SShCizScEqaAGuScw00xq01VdPt';
const stripeTestPromise = loadStripe(PUBLIC_KEY);

const defaultFormFields = {
  message: "",
  price: "",
  image: "",
};

const PurchaseEntry = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formFields, setFormFields] = useState(defaultFormFields);
  const { message, price, image } = formFields;

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('fhi')
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <Elements stripe={stripeTestPromise}>
      <div className="sign-up-container">
        <form onSubmit={handleSubmit}>
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
        </form>
        <PaymentForm price={price} />
      </div>
    </Elements>
  );
};

export default PurchaseEntry;
