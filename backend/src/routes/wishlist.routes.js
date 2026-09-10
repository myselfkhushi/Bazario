import express from "express";
import { addToWishlist,getMyWishlist,removeWishlist } from "../controllers/wishlist.controller.js";

import { isAuthenticate } from "../middleware/auth.middleware.js";

const router =express.Router();
router.post("/:productId",isAuthenticate,addToWishlist)
router.get("/",isAuthenticate,getMyWishlist);
router.delete("/:id",isAuthenticate,removeWishlist);

export default router;