import { loadStripe } from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import './checkout.styles.scss'
import PaymentForm from '../paymentForm/payment-form.component';
const PUBLIC_KEY = 'pk_test_51MKsf9DT4vO9oNMHcr5fVekm0L7XxNWmvFFePcgjmEkzdViRmaRSu93GDOYX767wVbwgLq0SShCizScEqaAGuScw00xq01VdPt'
const stripeTestPromise = loadStripe(PUBLIC_KEY);


const checkout = () => {
  return (
    <Elements stripe={stripeTestPromise}>
        <PaymentForm />
    </Elements>
  )
}
export default checkout;