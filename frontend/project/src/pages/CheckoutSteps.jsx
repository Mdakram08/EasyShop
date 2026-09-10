import React from "react";
import "../pagesStyling/CheckoutSteps.css"

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
  return (
    <div className="checkout-steps">

      <div className={`step ${shipping ? "active" : ""}`}>
        <div className="circle">1</div>
        <span>Shipping</span>
      </div>

      <div className={`line ${confirmOrder ? "active-line" : ""}`}></div>

      <div className={`step ${confirmOrder ? "active" : ""}`}>
        <div className="circle">2</div>
        <span>Confirm</span>
      </div>

      <div className={`line ${payment ? "active-line" : ""}`}></div>

      <div className={`step ${payment ? "active" : ""}`}>
        <div className="circle">3</div>
        <span>Payment</span>
      </div>

    </div>
  );
};

export default CheckoutSteps;