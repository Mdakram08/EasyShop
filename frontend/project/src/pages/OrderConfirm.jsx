import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/pageTitle";
import CheckoutSteps from "./CheckoutSteps";
import "../pagesStyling/OrderConfirm.css"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

const OrderConfirm = () => {
  const navigate = useNavigate();

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const {user,loading,isAuthenticated}=useSelector((state)=>state.user);

  // Order Calculations
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const goBack=()=>{
    navigate("/shipping")
  }

  

  const subTotal=cartItems.reduce((acc,item)=>acc+item.price*item.quantity,0);
  //tax 
  const tax=subTotal*0.18
  //shipping charges
  const shipping=subTotal>1000?0:100;
  //total
  const total=shipping+tax+subTotal

  const proceedToPayment = (e) => {
    e.prevwnt
    const data = {
      subTotal,
      shipping,
      tax,
      total,
    };
    // saving data in session
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/payment");
  };
  useEffect(() => {
        if (!loading && !isAuthenticated) {
          toast.success("Please log in to Countinue With Confirm Order page.",{position:'top-center',autoClose:2000})
          navigate("/login");
        }
      }, [loading, isAuthenticated, navigate]);

  return (
    <>
      <PageTitle title="Confirm Order" />
      <Navbar />

      <CheckoutSteps shipping={true} confirmOrder={true} />

      <div className="confirm-order">

        {/* LEFT SECTION */}

        <div className="left-section">

          {/* Shipping */}

          <div className="shipping-box">

            <h2>Shipping Information</h2>

            <div className="shipping-details">

              <p>
                <strong>Name :</strong> {user?.userName}
              </p>

              <p>
                <strong>Phone :</strong> {shippingInfo.phoneNo}
              </p>

              <p>
                <strong>Address :</strong>{" "}
                {shippingInfo.address},{" "}
                {shippingInfo.city},{" "}
                {shippingInfo.state},{" "}
                {shippingInfo.country} - {shippingInfo.pincode}
              </p>

            </div>

          </div>

          {/* Cart Items */}

          <div className="cart-box">

            <h2>Cart Items</h2>

            {cartItems.map((item) => (
              <div className="cart-item" key={item.product}>

                <img src={item.image} alt={item.name} />

                <div className="cart-info">
                  <h4>{item.name}</h4>

                  <p>
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                <strong>
                  ₹{item.price * item.quantity}/-
                </strong>

              </div>
            ))}

          </div>

        </div>

        {/* RIGHT SECTION */}

        <div className="summary-box">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subTotal}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>
              {shipping === 0 ? "FREE" : `₹${shipping}`}
            </span>
          </div>

          <div className="summary-row">
            <span>GST (18%)</span>
            <span>₹{tax}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>₹{total}/-</span>
          </div>

          <button className="go-back" onClick={goBack}>Go Back</button>

          <button
            className="payment-btn"
            onClick={proceedToPayment}
          >
            Proceed to Payment
          </button>

        </div>

      </div>

      <Footer />
    </>
  );
};

export default OrderConfirm;