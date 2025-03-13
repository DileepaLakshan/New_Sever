import express from "express";

import { createPaymentIntent} from "../controllers/paymentController.js";

const paymentRoutes  = express.Router();

// Define the payment route
paymentRoutes.post('/', createPaymentIntent);

export default paymentRoutes ;
