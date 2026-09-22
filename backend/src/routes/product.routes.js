import express from 'express';
import upload from '../middleware/upload.js';
import { createProduct,getallproducts ,getsingleproduct,updateproduct,deleteproduct,getproductwithsearch,getproductwithpagination,getproductwithcategory,getmyproduct,getproductcount,getproductbrands} from '../controllers/product.controller.js';
import { isAuthenticate,authorizeRole } from '../middleware/auth.middleware.js';
import { validateproduct } from '../validators/product.validator.js';

const router=express.Router();

router.post("/create",isAuthenticate,authorizeRole("admin","seller"),upload.array("images",5),validateproduct,createProduct);
router.get("/",getallproducts);
router.get("/brands", getproductbrands);
router.get("/search/all",getproductwithsearch);
router.get("/page/all",getproductwithpagination);
router.get("/category/:category",getproductwithcategory);
router.get("/my/product",isAuthenticate,getmyproduct);
router.get("/total/count",getproductcount);
router.get("/:id", getsingleproduct);
router.put("/:id", isAuthenticate, authorizeRole("admin", "seller"), upload.array("images", 5), updateproduct);
router.delete("/:id", isAuthenticate, authorizeRole("admin", "seller"), deleteproduct);

export default router;