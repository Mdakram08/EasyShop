import express from "express";
import { userAuth } from "../utils/userAuth.js";
import {  paymentProcess,getApiKey, paymentVerification } from "../controllers/paymentControllers.js";
const router = express.Router();

//paymet route
router.route("/payment/process").post(userAuth,paymentProcess);
router.route("/get/paymentkey").get(userAuth,getApiKey);
router.route("/payment/verification").post(userAuth,paymentVerification)

export default router;