import express from "express";
import { isAuthenticate } from "../middleware/auth.middleware.js";
import { addtocart,getmycart,updatecart ,removecartitem} from "../controllers/cart.controller.js";


const router = express.Router();

router.post("/add",isAuthenticate,addtocart);
router.get("/mycart",isAuthenticate,getmycart);
router.put("/update/:id",isAuthenticate,updatecart);
router.delete("/remove/:id",isAuthenticate,removecartitem);


export default router;