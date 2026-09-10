import express from "express";
import {isAuthenticate} from "../middleware/auth.middleware.js";
import { authorizeRole } from "../middleware/auth.middleware.js";
import {getSellerDashboard} from "../controllers/seller.controller.js";
import { getRecentOrders,getSellerOrders } from "../controllers/seller.controller.js";

const router=express.Router();

router.get("/dashboard" ,isAuthenticate,authorizeRole("seller"),getSellerDashboard);
router.get("/recent-orders",isAuthenticate,authorizeRole("seller"),getRecentOrders);
router.get("/orders",isAuthenticate,authorizeRole("seller"),getSellerOrders);


export default router;