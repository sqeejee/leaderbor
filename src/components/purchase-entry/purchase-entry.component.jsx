import React, { useState, useContext } from "react";
import { UserContext } from '../../contexts/users.context'
import FormInput from "../form-input/form-input.component";
import Button from "../button/button.component";
import { addPost } from '../../utils/firebase/firebase.utils'
import { useNavigate } from "react-router-dom";

const defaultFormFields = {
  message: "",
  price: "",
  image: "",
};

const PurchaseEntry = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formFields, setFormFields] = useState(defaultFormFields);
  const { message, price, image } = formFields;

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userID = currentUser.uid;
    const username = currentUser.displayName;

    const priceRegex = /^\d+(\.\d{1,2})?$/;
    if (!priceRegex.test(price) || parseFloat(price) < 0.01) {
      alert("Invalid price entry. Please enter a non-negative value with up to two decimal places.");
      return;
    }

    try {
      await addPost(userID, username, message, image, price);
      resetFormFields();
      // Redirect user to a different page
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className="sign-up-container">
      <form onSubmit={handleSubmit}>
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
          step="0.01" // Allow only two decimal places
          required
          onChange={handleChange}
          name="price"
          value={price}
        />
        <FormInput
          label="Image (url for now my b)"
          type="text"
          required
          onChange={handleChange}
          name="image"
          value={image}
        />
        <div className="sign-up-button-container">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default PurchaseEntry;
