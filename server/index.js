const express = require('express');
const app = express();
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post('/payment', cors(), async (req, res) => {
    let { amount, id } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "USD",
            description: "Leaderboard entry",
            payment_method: id,
            confirm: true,
            return_url: 'https://localhost:3000',
        });

        // Log the entire PaymentIntent object for a successful payment
        console.log('Successful Payment:', paymentIntent);

        res.json({
            message: 'Payment successful',
            success: true,
            paymentIntent: paymentIntent // Optionally return the payment intent in the response
        });
    } catch (error) {
        console.log('Payment Error:', error);
        res.json({
            message: "Payment failed",
            success: false,
            error: error.message // Include error message in response for debugging
        });
    }
});

app.listen(process.env.PORT || 4000, () => {
    console.log("Server running on port", process.env.PORT || 4000);
});
