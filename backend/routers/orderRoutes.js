import express from "express";

import {getUserOrders, createOrder,getOrderforAdmin,getAllOrderforAdmin,updateOrderStatus,deleteOrderAdmin} from "../controllers/orderControllers.js"
import { userAuth,userBasedRoles } from "../utils/userAuth.js";
const router = express.Router();

//create Order
router.post("/new/order",userAuth,createOrder);
//get LogedIn user order
router.get("/user/orders",userAuth,getUserOrders);
//get single order for admin
router.get("/user/orders/:id",userAuth,getOrderforAdmin);


//get all Order for Admin
router.get("/admin/orders",userAuth,userBasedRoles("admin"),getAllOrderforAdmin)
//get single Order for Admin
router.get("/admin/orders/:id",userAuth,userBasedRoles("admin"),getOrderforAdmin);
//admin order status update
router.put("/admin/orders/:id",userAuth,userBasedRoles("admin"),updateOrderStatus);
//admin order delete
router.delete("/admin/orders/:id",userAuth,userBasedRoles("admin"),deleteOrderAdmin);


export default router;