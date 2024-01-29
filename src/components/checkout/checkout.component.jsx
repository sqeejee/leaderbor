import { CardElement } from "@stripe/react-stripe-js";

import Button from "../button/button.component";
import './checkout.styles.scss'

const PaymentForm = () => {
    return (
      <div className="payment-form-container">
        <h2>GIVE ME MONEY</h2>
        <div className="payment-form-container-container">
         <CardElement />
        <Button>Pay Now</Button>
        </div>
      </div>
    )
}
export default PaymentForm;