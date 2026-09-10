import { createorder,getmyorder,getsingleorder,getallorder ,updateorderstatus,gettotalrevenue} from "../controllers/order.controller.js";
import express from "express";
import {authorizeRole, isAuthenticate} from "../middleware/auth.middleware.js"

const router = express.Router();

router.post("/createorder",isAuthenticate,createorder);
router.get("/getorder",isAuthenticate,getmyorder);
router.get("/admin/all",isAuthenticate,authorizeRole("admin"),getallorder);
router.get("/admin/revenue",isAuthenticate,authorizeRole("admin"),gettotalrevenue);
router.put("/admin/:id",isAuthenticate,authorizeRole("admin"),updateorderstatus);
router.get("/:id",isAuthenticate,getsingleorder);

export default router;