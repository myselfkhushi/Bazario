import express from "express";
import {loginUser,getProfile,updateProfile,adminDashboared,registerUser,logoutUser} from "../controllers/auth.controller.js";
import { isAuthenticate,authorizeRole } from "../middleware/auth.middleware.js";
import { validateregister } from "../validators/user.validator.js";
import { validatelogin } from "../validators/login.validator.js";
import authLimiter from "../utils/authlimiter.js"



const router = express.Router();

router.post("/register",authLimiter,validateregister,registerUser);
router.post("/login",authLimiter,validatelogin,loginUser);
router.get("/me",isAuthenticate,getProfile);
router.put("/me",isAuthenticate,updateProfile);
router.post("/logout", isAuthenticate, logoutUser);
router.get("/admin",isAuthenticate,authorizeRole("admin"),adminDashboared);


export default router;
