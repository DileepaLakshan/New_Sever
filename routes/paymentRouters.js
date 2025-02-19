import express from "express";
import { createPaymentIntent } from "../controllers/paymentController.mjs";

const paymentRoutes  = express.Router();

// Define the payment route
paymentRoutes.post("/payment", createPaymentIntent);

export default paymentRoutes ;
