import {loadStripe} from '@stripe/stripe-js'

const apiKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
export const stripePromise = loadStripe(apiKey)
console.log(apiKey);