import Order from "../modules/Order.js";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";

//create order
export const createOrder=wrapAsync(async(req,res,next)=>{
    console.log("REQ.BODY:", req.body);
    console.log("REQ.USER:", req.user);
    const {shippingInfo,orderItems,paymentInfo,itemPrice,taxPrice,shippingPrice,totalPrice}=req.body
    const order=await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user.id
    })
    res.status(200).json({
        success:true,
        order
    })
})

// Get all orders of the logged-in user
export const getUserOrders = wrapAsync(async (req, res, next) => {
    // Find orders belonging to the current user
    console.log("current user",req.user.id);
    const orders = await Order.find({ user: req.user.id });

    // Optional: Return message if no orders found
    if (orders.length === 0) {
        return next(new ExpressError("No order placed"))
    }
 
    
    // Return all orders
    res.status(200).json({
        success: true,
        orders
    });
});

//get single order for admin
export const getOrderforAdmin=wrapAsync(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new ExpressError("No Order Found",201));
    }
    res.status(200).json({
        success:true,
        order
    })
})

//get all order for admin with totalAmount
export const getAllOrderforAdmin=wrapAsync(async(req,res,next)=>{
    const orders=await Order.find();
    if(!orders){
        return next(new ExpressError("No Orders Found",201));
    }
    //dec a var with 0 value
    let totalAmount=0
    //add each elemenst total price 
    orders.forEach((order)=>{
        // 1st ele 20 2nd ele 30 =totalAmount
        totalAmount+=order.totalPrice
    })
    res.status(200).json({
        success:true,
        orders,
        totalAmount
    })
})

//admin order status update
export const updateOrderStatus = wrapAsync(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ExpressError("No order found", 404));
    }

    const { status } = req.body;

    console.log("Received status:", status);
    console.log("Order ID:", req.params.id);

    if (!status) {
        return next(new ExpressError("Please provide order status", 400));
    }

    order.orderStatus = status;

    if (status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    if (status === "Cancelled") {
        await Promise.all(
            order.orderItems.map(async (item) => {

                const product = await order.findById(item.product);

                if (product) {
                    product.Stock += item.quantity;
                    await product.save();
                }
            })
        );
    }

    await order.save();

    console.log("Updated order:", order.orderStatus);

    res.status(200).json({
        success: true,
        order
    });
});

//delete order admin
export const deleteOrderAdmin=wrapAsync(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new ExpressError("No error Found",201));
    }
    if(order.orderStatus==='Processing'){
        return next(new ExpressError("This order is under Processing and cannot be Deleated!",404))
    }
    await Order.findByIdAndDelete(req.params.id);
     res.status(200).json({
        success:true,
        message:"Order Deleted Sucessfully"
    })
})
