import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PageTitle from "../components/pageTitle";
import Footer from "../components/Footer";
import "./UpdateOrderStatus.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleorder, removeError } from "../features/orderSlice";
import { toast } from "react-toastify";
import { removeMessage, updateOrderStatus } from "../features/adminSlice";

const UpdateOrder = () => {

    const [status, setStatus] = useState("");
    const { order, loading:orderLoading } = useSelector((state) => state.order);
    const {success,error,loading:adminLoading,message}=useSelector((state)=>state.admin);
    const {user,isAuthenticated } = useSelector((state) => state.user);
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const loading=orderLoading||adminLoading
    console.log(order);
    // Fetch single order
    useEffect(() => {
        if (id) {
            dispatch(getSingleorder(id));
        }
    }, [dispatch, id]);

    // Set current order status
    useEffect(() => {
        if (order) {
            setStatus(order.orderStatus);
        }
    }, [order]);

    const handleStatusUpdate=()=>{
        dispatch(updateOrderStatus({id,status}));
    }

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        toast.error("Please login to access Admin Panel", {
          position: "top-center",
          autoClose: 2000
        });
  
        navigate("/login");
      }
    }, [loading, isAuthenticated, navigate]);
  
    useEffect(() => {
      if (!loading && isAuthenticated && user?.role !== "admin") {
        toast.error("You are not authorized to access Admin Panel", {
          position: "top-center",
          autoClose: 2000
        });
        navigate("/");
      }
    }, [loading, isAuthenticated, user, navigate]);  

    useEffect(() => { // Watches for errors from Redux
        if (error) { // Checks whether an error exists
          toast.error(err, { // Displays the Redux error using a toast
            position: "top-center", // Places the toast at the top center
            autoClose: 2000 // Automatically closes the message after 2 seconds
          });
          dispatch(removeError()); // Clears the error from Redux
        }
        if (success) { // Checks whether an error exists
          toast.success("OrderStatus Updated Sucessfully", { // Displays the Redux error using a toast
            position: "top-center", // Places the toast at the top center
            autoClose: 2000 // Automatically closes the message after 2 seconds
          });
          dispatch(removeMessage());
          dispatch(getSingleorder(id)); // Clears the error from Redux
        }
    }, [error, dispatch,success,message]);
    
    return (
        <>
            <Navbar />

            <PageTitle title="Order Details" />

            <div className="update-order-page">

                {/* ==============================
                    ORDER HEADER
                ============================== */}
                <div className="update-order-header">

                    <div className="update-order-header-info">

                        <h2 className="update-order-title">
                            Order Details
                        </h2>

                        <p className="update-order-id">
                            Order ID:
                            <strong className="update-order-id-value">
                                {order?._id}
                            </strong>
                        </p>

                    </div>


                    {/* Order Status */}
                    <div className="update-order-status-wrapper">

                        <span className="update-order-status-label">
                            Status
                        </span>

                        <select
                            className="update-order-status-select"
                            value={status || order?.orderStatus || ""}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Processing">
                                Processing
                            </option>

                            <option value="Shipped">
                                Shipped
                            </option>

                            <option value="On the way">
                                On the way
                            </option>

                            <option value="Delivered">
                                Delivered
                            </option>

                            
                        </select>

                    </div>

                </div>


                {/* ==============================
                    INFORMATION GRID
                ============================== */}
                <div className="update-order-info-grid">


                    {/* ==============================
                        SHIPPING INFORMATION
                    ============================== */}
                    <div className="update-order-card update-order-shipping-card">

                        <h3 className="update-order-card-title">
                            Shipping Information 
                        </h3>


                        <div className="update-order-info-row">

                            <span className="update-order-info-label">
                                Address
                            </span>

                            <strong className="update-order-info-value">
                                {order?.shippingInfo?.address}
                            </strong>

                        </div>


                        <div className="update-order-info-row">

                            <span className="update-order-info-label">
                                City
                            </span>

                            <strong className="update-order-info-value">
                                {order?.shippingInfo?.city}
                            </strong>

                        </div>


                        <div className="update-order-info-row">

                            <span className="update-order-info-label">
                                State
                            </span>

                            <strong className="update-order-info-value">
                                {order?.shippingInfo?.state}
                            </strong>

                        </div>


                        <div className="update-order-info-row">

                            <span className="update-order-info-label">
                                Country
                            </span>

                            <strong className="update-order-info-value">
                                {order?.shippingInfo?.country}
                            </strong>

                        </div>


                        <div className="update-order-info-row">

                            <span className="update-order-info-label">
                                Pincode
                            </span>

                            <strong className="update-order-info-value">
                                {order?.shippingInfo?.pincode}
                            </strong>

                        </div>


                        <div className="update-order-info-row">

                            <span className="update-order-info-label">
                                Phone
                            </span>

                            <strong className="update-order-info-value">
                                {order?.shippingInfo?.phoneNo}
                            </strong>

                        </div>

                        <div className="update-order-info-row">

                            <span className="update-order-info-label">
                                OrderStatus
                            </span>

                            <strong className="update-order-info-value">
                                {order.orderStatus}
                            </strong>

                        </div>

                    </div>


                    {/* ==============================
                        PAYMENT INFORMATION
                    ============================== */}
                    <div className="update-order-card update-order-payment-card">

                        <h3 className="update-order-card-title">
                            Payment Information
                        </h3>


                        <div className="update-order-info-row">

                            <span className="update-order-info-label">
                                Payment ID
                            </span>

                            <strong className="update-order-info-value update-order-payment-id">
                                {order?.paymentInfo?.id}
                            </strong>

                        </div>


                        <div className="update-order-info-row">

                            <span className="update-order-info-label">
                                Payment Status
                            </span>

                            <strong className="update-order-payment-status">
                                {order?.paymentInfo?.status}
                            </strong>

                        </div>


                        <div className="update-order-info-row">

                            <span className="update-order-info-label">
                                Paid At
                            </span>

                            <strong className="update-order-info-value">
                                {order?.paidAt
                                    ? new Date(order.paidAt).toLocaleString()
                                    : "N/A"}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* ==============================
                    ORDERED PRODUCTS
                ============================== */}
                <div className="update-order-card update-order-products-card">

                    <h3 className="update-order-card-title">
                        Ordered Products
                    </h3>


                    {/* Products Header */}
                    <div className="update-order-products-header">

                        <span>Product</span>

                        <span>Price</span>

                        <span>Quantity</span>

                        <span>Subtotal</span>

                    </div>


                    {/* Products */}
                    {order?.orderItems?.map((item, index) => (

                        <div
                            className="update-order-product-row"
                            key={index}
                        >

                            {/* Product */}
                            <div className="update-order-product-info">

                                <img
                                    className="update-order-product-image"
                                    src={item.image}
                                    alt={item.name}
                                />

                                <span className="update-order-product-name">
                                    {item.name}
                                </span>

                            </div>


                            {/* Price */}
                            <span className="update-order-product-price">
                                ₹{item.price?.toLocaleString("en-IN")}
                            </span>


                            {/* Quantity */}
                            <span className="update-order-product-quantity">
                                {item.quantity}
                            </span>


                            {/* Subtotal */}
                            <strong className="update-order-product-subtotal">
                                ₹{(
                                    item.price * item.quantity
                                )?.toLocaleString("en-IN")}
                            </strong>

                        </div>

                    ))}

                </div>


                {/* ==============================
                    PRICE DETAILS
                ============================== */}
                <div className="update-order-price-section">

                    <div className="update-order-card update-order-price-card">

                        <h3 className="update-order-card-title">
                            Price Details
                        </h3>


                        {/* Items Price */}
                        <div className="update-order-price-row">

                            <span>
                                Items Price
                            </span>

                            <strong>
                                ₹{order?.itemPrice?.toLocaleString("en-IN")}
                            </strong>

                        </div>


                        {/* Shipping */}
                        <div className="update-order-price-row">

                            <span>
                                Shipping
                            </span>

                            <strong>
                                ₹{order?.shippingPrice?.toLocaleString("en-IN")}
                            </strong>

                        </div>


                        {/* Tax */}
                        <div className="update-order-price-row">

                            <span>
                                Tax
                            </span>

                            <strong>
                                ₹{order?.taxPrice?.toLocaleString("en-IN")}
                            </strong>

                        </div>


                        <hr className="update-order-price-divider" />


                        {/* Total */}
                        <div className="update-order-total-row">

                            <span>
                                Total
                            </span>

                            <strong>
                                ₹{order?.totalPrice?.toLocaleString("en-IN")}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* ==============================
                    UPDATE BUTTON
                ============================== */}
                <div className="update-order-action-container">

                    <button
                        className="update-order-submit-btn"
                        onClick={handleStatusUpdate}
                    >
                        Update Order
                    </button>

                </div>

            </div>

            <Footer />
        </>
    );
};

export default UpdateOrder;