import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/pageTitle";
import "../pagesStyling/OrderDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { getSingleorder, removeError } from "../features/orderSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const OrderDetails = () => {

  const { orderId } = useParams();

  const { order, loading, error } = useSelector(
    (state) => state.order
  );

  const dispatch = useDispatch();

  console.log(order);

  useEffect(() => {
    dispatch(getSingleorder(orderId));
  }, [dispatch, orderId]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 2000,
      });

      dispatch(removeError());
    }
  }, [error, dispatch]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  // Prevent destructuring before order is available
  if (!order) {
    return null;
  }

  const {
    _id,
    createdAt,
    shippingInfo = {},
    orderItems = [],
    paymentInfo = {},
    orderStatus,
    totalPrice,
    taxPrice,
    shippingPrice,
    itemPrice,
    paidAt,
  } = order;

  return (
    <>
      <PageTitle title={orderId} />

      <Navbar />

      <main className="order-details-page">

        <div className="order-details-container">

          {/* ================= HEADER ================= */}

          <div className="order-details-header">

            <div>

              <span className="order-details-eyebrow">
                EASY-SHOP / MY ORDERS
              </span>

              <h1>
                Order Details
              </h1>

            </div>

            <Link
              to="/user/orders"
              className="back-orders-btn"
            >
              ← BACK TO ORDERS
            </Link>

          </div>


          {/* ================= ORDER INFO ================= */}

          <div className="order-info-bar">

            <div className="order-info-item">

              <span>
                ORDER NUMBER
              </span>

              <strong>
                #{_id}
              </strong>

            </div>


            <div className="order-info-item">

              <span>
                ORDER DATE
              </span>

              <strong>
                {new Date(createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </strong>

            </div>


            <div className="order-info-item">

              <span>
                PAYMENT
              </span>

              <strong>
                {paidAt ? "PAID" : "NOT PAID"}
              </strong>

            </div>


            <div className="order-status-details">

              <span>
                STATUS
              </span>

              <strong>
                {orderStatus}
              </strong>

            </div>

          </div>


          {/* ================= MAIN CONTENT ================= */}

          <div className="order-details-grid">


            {/* ================= PRODUCT ================= */}

            <section className="order-product-section">

              <div className="section-heading">

                <span>
                  YOUR ITEM
                </span>

                <h2>
                  Product Details
                </h2>

              </div>


              {orderItems.map((item) => (

                <div
                  className="order-product-card"
                  key={item.product}
                >

                  <div className="order-product-image">

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                  </div>


                  <div className="order-product-info">

                    <span className="product-category">
                      {item.category || "PRODUCT"}
                    </span>

                    <h2>
                      {item.name}
                    </h2>

                    <p>
                      Color: {item.color || "N/A"}
                    </p>

                    <p>
                      Size: {item.size || "N/A"}
                    </p>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                    <div className="product-price">
                      ₹{item.price}
                    </div>

                  </div>

                </div>

              ))}

            </section>


            {/* ================= SHIPPING ================= */}

            <section className="shipping-section">

              <div className="section-heading">

                <span>
                  DELIVERY
                </span>

                <h2>
                  Shipping Address
                </h2>

              </div>


              <div className="shipping-card">

                <h3>
                  Delivery Address
                </h3>

                <p>
                  {shippingInfo.name}
                </p>

                <p>
                  {shippingInfo.address}
                </p>

                <p>
                  {shippingInfo.city}, {shippingInfo.state}
                </p>

                <p>
                  {shippingInfo.country} - {shippingInfo.pinCode}
                </p>

                <p>
                  Phone: {shippingInfo.phoneNo}
                </p>

              </div>

            </section>


            {/* ================= PAYMENT ================= */}

            <section className="payment-section">

              <div className="section-heading">

                <span>
                  PAYMENT
                </span>

                <h2>
                  Payment Information
                </h2>

              </div>


              <div className="payment-card">

                <div className="payment-row">

                  <span>
                    Payment Status
                  </span>

                  <strong className="paid">
                    {paidAt ? "PAID" : "NOT PAID"}
                  </strong>

                </div>


                <div className="payment-row">

                  <span>
                    Payment Method
                  </span>

                  <strong>
                    {paymentInfo.type || "ONLINE PAYMENT"}
                  </strong>

                </div>


                <div className="payment-row">

                  <span>
                    Transaction ID
                  </span>

                  <strong>
                    {paymentInfo.id || "N/A"}
                  </strong>

                </div>

              </div>

            </section>


            {/* ================= PRICE SUMMARY ================= */}

            <section className="price-section">

              <div className="section-heading">

                <span>
                  SUMMARY
                </span>

                <h2>
                  Order Summary
                </h2>

              </div>


              <div className="price-card">

                <div className="price-row">

                  <span>
                    Item Price
                  </span>

                  <strong>
                    ₹{itemPrice}
                  </strong>

                </div>


                <div className="price-row">

                  <span>
                    Tax
                  </span>

                  <strong>
                    ₹{taxPrice}
                  </strong>

                </div>


                <div className="price-row">

                  <span>
                    Shipping
                  </span>

                  <strong>
                    {shippingPrice === 0
                      ? "FREE"
                      : `₹${shippingPrice}`}
                  </strong>

                </div>


                <div className="price-divider"></div>


                <div className="price-total">

                  <span>
                    TOTAL
                  </span>

                  <strong>
                    ₹{totalPrice}
                  </strong>

                </div>

              </div>

            </section>

          </div>

        </div>

      </main>

      <Footer />

    </>
  );
};

export default OrderDetails;
