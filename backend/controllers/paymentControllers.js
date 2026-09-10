import { instance } from "../app.js";
import wrapAsync from "../utils/wrapAsync.js";
import crypto from "crypto"

export const paymentProcess = wrapAsync(async (req, res) => {
    const amount = Number(req.body.amount*100);
    const options = {
        amount: Math.round(amount),
        currency: "INR",
        // receipt: `receipt_${Date.now()}`
    };
    const order = await instance.orders.create(options);
    res.status(200).json({
        success: true,
        order
    });
});


export const getApiKey = wrapAsync(async (req, res) => {
    res.status(200).json({
        key: process.env.RAZORPAY_API_KEY
    });

});

export const paymentVerification=wrapAsync(async(req,res)=>{
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
    const body=razorpay_order_id+"|"+razorpay_payment_id;
    const expectedSignature=crypto.createHmac('sha256',process.env.RAZORPAY_API_SECRET).update(body.toString()).digest("hex");
    const isAuthentic=expectedSignature===razorpay_signature;
    if(isAuthentic){
        res.status(200).json({
            success:true,
            message:"Payment Verified Sucessfully",
            reference:razorpay_payment_id
        })
    }else{
        res.status(404).json({
            success:false,
            message:"Payment Not verified"
        })
    }
 
})

