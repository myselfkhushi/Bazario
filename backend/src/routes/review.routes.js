import express from "express";
import {isAuthenticate,authorizeRole} from "../middleware/auth.middleware.js";
import { createReview ,getProductReviews,deleteReview,updateReview} from "../controllers/review.controller.js";

const router=express.Router();

router.post("/:productId",isAuthenticate,authorizeRole("buyer"),createReview);
router.get("/:productId",getProductReviews);
router.delete("/:reviewId",isAuthenticate,authorizeRole("buyer"),deleteReview);
router.put("/:reviewId",isAuthenticate,authorizeRole("buyer"),updateReview)
export default router;