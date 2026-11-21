import express from "express";
import { isAuthenticate, authorizeRole } from "../middleware/auth.middleware.js";
import {
    getSellerDashboard,
    getRecentOrders,
    getSellerOrders,
    updateSellerOrderStatus,
    markSellerLabelPrinted,
} from "../controllers/seller.controller.js";

const router = express.Router();

router.get("/dashboard", isAuthenticate, authorizeRole("seller"), getSellerDashboard);
router.get("/recent-orders", isAuthenticate, authorizeRole("seller"), getRecentOrders);
router.get("/orders", isAuthenticate, authorizeRole("seller"), getSellerOrders);
router.put("/orders/:orderId/status", isAuthenticate, authorizeRole("seller"), updateSellerOrderStatus);
router.put("/orders/:orderId/print-label", isAuthenticate, authorizeRole("seller"), markSellerLabelPrinted);

export default router;
