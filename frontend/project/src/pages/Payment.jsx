import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/pageTitle";
import CheckoutSteps from "./CheckoutSteps";
import "../pagesStyling/Payment.css";
import { data, useNavigate } from "react-router-dom";
import axios from "axios"
import { useSelector } from "react-redux";

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  
  const {user}=useSelector((state)=>state.user);
  const {shippingInfo}=useSelector((state)=>state.cart);
  const navigate=useNavigate();
  const completePayment = async (amount) => {
      try{
        const { data: keyData } =await axios.get("/api/get/paymentkey");
        const { key } = keyData;
        // console.log(key);

        const { data: orderData } =await axios.post("/api/payment/process", {amount: Number(amount)});
        const {order}=orderData;
        // console.log(order)

        const options = {
            key,
            amount: order.amount,
            currency: order.currency,
            name: "EasyShop",
            description: "EasyShop Order",
            order_id: order.id,
            handler:async function(response) {
              const {data}=await axios.post("/api/payment/verification",{
                razorpay_order_id:response.razorpay_order_id,
                razorpay_payment_id:response.razorpay_payment_id,
                razorpay_signature:response.razorpay_signature
              })
              if(data.success===true){
                navigate(`/api/payment/success?reference=${data.reference}`)
              }else{
                alert("Payment Failed!")
              }
            },
            prefill: {
                name: user?.userName || "",
                email: user?.email || "",
                contact: shippingInfo?.phoneNo || ""
            },

            theme: {
                color: "#393c3d"
            }
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }catch(error){
        console.log("Payment error",error);
      }
  };

  const goBack=()=>{
    navigate("/order/confirm")
  }
  return (
    <>
      <PageTitle title="Payment" />

      <Navbar />

      <CheckoutSteps shipping confirmOrder payment />

      <div className="payment-page">

        <div className="payment-left">

          <h2>Payment Details</h2>

          <form>

            <div className="input-group">
              <label>Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
              />
            </div>

            <div className="input-group">
              <label>Name on Card</label>
              <input
                type="text"
                placeholder="John Doe"
              />
            </div>

            <div className="payment-row">

              <div className="input-group">
                <label>Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                />
              </div>

              <div className="input-group">
                <label>CVV</label>
                <input
                  type="password"
                  placeholder="123"
                />
              </div>

            </div>

          </form>

        </div>

        <div className="payment-right">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{orderInfo.subTotal}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>₹{orderInfo.shipping}</span>
          </div>

          <div className="summary-row">
            <span>GST</span>
            <span>₹{orderInfo.tax}</span>
          </div>

          <div className="summary-row total">

            <span>Total</span>

            <span>₹{orderInfo.total}</span>

          </div>

          <button className="go-back" onClick={goBack}>Go Back</button>

          <button className="pay-btn" onClick={()=>completePayment(orderInfo.total)}>
            Pay ₹{orderInfo.total}
          </button>

        </div>

      </div>

      <Footer />
    </>
  );
};

export default Payment;
