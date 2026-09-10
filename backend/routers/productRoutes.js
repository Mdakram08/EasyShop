import express from "express";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getAdminproducts,
  createReviewforProduct,
  getProductReviews,
  getAdminSingleProduct,
  deleteProductReview
} from "../controllers/productControllers.js";
import {userAuth,userBasedRoles} from "../utils/userAuth.js"

const router = express.Router();

//get all
router.get("/products",getAllProducts);
//get single
router.get("/products/:id",getSingleProduct);
//create
router.post("/admin/create/product",userAuth,userBasedRoles("admin"),createProduct);
//update
router.put("/admin/products/:id",userAuth,userBasedRoles("admin"),updateProduct);
//delete
router.delete("/admin/products/:id",userAuth,userBasedRoles("admin"),deleteProduct);
//admin products
router.get("/admin/products",userAuth,userBasedRoles("admin"),getAdminproducts);
//get admin single product
router.get("/admin/products/:id",userAuth,userBasedRoles("admin"),getAdminSingleProduct);
//review Post
router.put("/admin/reviews",userAuth,createReviewforProduct);
//get review from the product
router.get("/admin/reviews",userAuth,getProductReviews);
//delete review
router.delete("/admin/reviews",userAuth,deleteProductReview);


export default router;