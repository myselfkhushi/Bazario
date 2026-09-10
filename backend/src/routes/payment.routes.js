import express from 'express';
import { createPaymentOrder ,verifyPayment} from '../controllers/payment.controller.js';
import { isAuthenticate,authorizeRole } from '../middleware/auth.middleware.js';
const router=express.Router();

router.post("/createorder",isAuthenticate,createPaymentOrder);

router.post("/verify",isAuthenticate,verifyPayment);

export default router;