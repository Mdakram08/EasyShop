import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/pageTitle";
import "../pagesStyling/PaymentSuccess.css";
import { useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { removeError, removeSuccess } from "../features/orderSlice";
import { clearCart } from "../features/cartSlice";
import { createOrder } from "../features/orderSlice";
import Loader from "../components/Loader";

const PaymentSuccess = () => {
  const[searchParams]=useSearchParams();
  const reference=searchParams.get("reference");
  const{shippingInfo,cartItems}=useSelector((state)=>state.cart);
  const {loading,error,success}=useSelector((state)=>state.order);;
  const dispatch=useDispatch();
  
  useEffect(()=>{
    const createOrderData=async()=>{
    try {
    const orderItem=JSON.parse(sessionStorage.getItem('orderInfo'));
    if(!orderItem) return;
    const orderData={
      shippingInfo:{
        address:shippingInfo.address,
        city:shippingInfo.city,
        state:shippingInfo.state,
        country:shippingInfo.country,
        pincode:shippingInfo.pincode,
        phoneNo:shippingInfo.phoneNo
      },
      orderItems:cartItems.map((item)=>({
        name:item.name,
        price:item.price,
        quantity:item.quantity,
        image:item.image,
        product:item.product
      })),
      paymentInfo:{
        id:reference,                                                                                                                     status:'succeeded',
      },
      itemPrice:orderItem.subTotal,
      taxPrice:orderItem.tax,
      shippingPrice:orderItem.shipping,
      totalPrice:orderItem.total
    }
    console.log("orderdata",orderData);
    dispatch(createOrder(orderData));
    sessionStorage.removeItem('orderInfo')
    } catch (error) {
      console.log("Error While creating order",error);
      toast.error(error || "Error While creating order",{position:'top-center',autoClose:2000})
    }
    }
    createOrderData();
  },[])

  useEffect(()=>{
    if(success){
      toast.success("Order Placed",{position:'top-center',autoClose:2000});
      dispatch(clearCart());
      dispatch(removeSuccess());
    }
  },[dispatch,success])

  useEffect(()=>{
    if(error){
      toast.error(error,{position:'top-center',autoClose:2000});
      dispatch(removeError())
    }
  },[dispatch,error])

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  return (
    <>
      <PageTitle title="Payment Successful" />
      <Navbar />

      <div className="payment-success-page">
        <div className="success-card">
          <div className="success-icon">
            ✓
          </div>

          <h1>Payment Successful!</h1>

          <p className="success-message">
            Thank you for your purchase. Your payment has been
            successfully processed.
          </p>

          <div className="payment-details">

            <div className="payment-detail-row">
              <span>Reference ID</span>
              <strong>{reference}</strong>
            </div>

            <div className="payment-detail-row status">
              <span>Status</span>
              <strong>Paid</strong>
            </div>

          </div>

          <div className="success-actions">

            <Link
              to="/user/orders"
              className="track-order-btn"
            >
              View My Orders
            </Link>

            <Link
              to="/products"
              className="track-order-btn"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
};

export default PaymentSuccess;