import Stripe from "stripe";

const stripe = new Stripe("sk_test_51QjPzPDvLkrL7RLrNtSpZtuAKegGvkl7NvpABwIdde7PWtC5ujbZN1cMmGeLQD8Bf8VhUcitJPmEctyPfchkaEB8003roaYo2G"); // Replace with your actual secret key

export const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: currency || "usd",
            payment_method_types: ["card"],
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
