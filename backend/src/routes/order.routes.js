import {
    createorder,
    getmyorder,
    getsingleorder,
    getallorder,
    updateorderstatus,
    gettotalrevenue,
    trackOrder,
    cancelorder,
    returnorder,
} from "../controllers/order.controller.js";
import express from "express";
import { authorizeRole, isAuthenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Order Tracking
router.get("/track/:id", trackOrder);

// Authenticated Buyer Routes
router.post("/createorder", isAuthenticate, createorder);
router.get("/getorder", isAuthenticate, getmyorder);
router.post("/cancel/:id", isAuthenticate, cancelorder);
router.post("/return/:id", isAuthenticate, returnorder);

// Admin Routes
router.get("/admin/all", isAuthenticate, authorizeRole("admin"), getallorder);
router.get("/admin/revenue", isAuthenticate, authorizeRole("admin"), gettotalrevenue);
router.put("/admin/:id", isAuthenticate, authorizeRole("admin"), updateorderstatus);

// Single Order Route
router.get("/:id", isAuthenticate, getsingleorder);

export default router;
