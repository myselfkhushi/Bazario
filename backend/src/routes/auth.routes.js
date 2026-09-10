import express from "express";
import {loginUser,getProfile,adminDashboared,registerUser,logoutUser} from "../controllers/auth.controller.js";
import { isAuthenticate,authorizeRole } from "../middleware/auth.middleware.js";
import { validateregister } from "../validators/user.validator.js";
import { validatelogin } from "../validators/login.validator.js";




const router = express.Router();

router.post("/register",validateregister,registerUser);
router.post("/login",validatelogin,loginUser);
router.get("/me",isAuthenticate,getProfile);
router.post("/logout", isAuthenticate, logoutUser);
router.get("/admin",isAuthenticate,authorizeRole("admin"),adminDashboared);


export default router;
