import {loadStripe} from '@stripe/stripe-js'

const apiKey = 'pk_test_51MKsf9DT4vO9oNMHcr5fVekm0L7XxNWmvFFePcgjmEkzdViRmaRSu93GDOYX767wVbwgLq0SShCizScEqaAGuScw00xq01VdPt'
export const stripePromise = loadStripe(apiKey)