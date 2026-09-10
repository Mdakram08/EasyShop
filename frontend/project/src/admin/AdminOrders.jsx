import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/pageTitle";
import "./AdminOrders.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteOrder, fetchAllOrders,removeError,removeMessage,removeSuccess } from "../features/adminSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const AdminOrders = () => {
    const {orders,loading,error,success,message}=useSelector((state)=>state.admin);
    const { user, loading: userLoading, isAuthenticated } = useSelector((state) => state.user);
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const deleteOrderBtn=(id)=>{
        const confirm=window.confirm("Are you sure that you want to delete this order!");
        if(confirm){
            dispatch(deleteOrder(id));
            dispatch(fetchAllOrders());
        }
    }

    useEffect(() => {
        if (!userLoading && !isAuthenticated) {
            toast.error("Please login to access Admin Panel", {
                position: "top-center",
                autoClose: 2000
            });
            navigate("/login");
        }
    }, [userLoading, isAuthenticated, navigate]);

    useEffect(() => {
        if (!userLoading && isAuthenticated && user?.role !== "admin") {
            toast.error("You are not authorized to access Admin Panel", {
                position: "top-center",
                autoClose: 2000
            });
            navigate("/");
        }
    }, [userLoading, isAuthenticated, user, navigate]);

    useEffect(() => {
        if (!userLoading && isAuthenticated && user?.role === "admin") {
            dispatch(fetchAllOrders())
        }
    }, [dispatch, userLoading, isAuthenticated, user]);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "top-center",
                autoClose: 2000
            });
            dispatch(removeError());
        }
        if (success) {
            toast.success(message, {
                position: "top-center",
                autoClose: 2000
            });
            dispatch(removeSuccess());
            dispatch(removeMessage());
        }
    }, [error, dispatch,success,message]);

    if (userLoading || loading) {
        return (
            <>
                <Navbar />
                <Loader />
                <Footer />
            </>
        );
    }

    if (!isAuthenticated || user?.role !== "admin") {
        return null;
    }
    
    return (
        <>
            <Navbar />

            <PageTitle title="Admin Orders" />

            <div className="admin-orders-page">

                {/* HEADER */}
                <div className="admin-orders-header">
                    <div>
                        <h1>Orders</h1>
                        <p>Manage customer orders</p>
                        <p>No of Orders {orders.length}</p>
                    </div>

                </div>


                {/* STATISTICS */}
                <div className="orders-stats">

                    <div className="orders-stat-card">
                        <span>Total Orders</span>
                        <h2>{orders.length}</h2>
                    </div>

                    <div className="orders-stat-card">
                        <span>Processing</span>
                        <h2>{orders.filter(order=>order.orderStatus === "Processing").length}</h2>
                    </div>

                    <div className="orders-stat-card">
                        <span>Shipped</span>
                        <h2>{orders.filter(order=>order.orderStatus === "Shipped").length}</h2>
                    </div>

                    <div className="orders-stat-card">
                        <span>Delivered</span>
                        <h2>{orders.filter(order=>order.orderStatus === "Delivered").length}</h2>
                    </div>

                </div>


                {/* ORDERS TABLE */}
                <div className="orders-table-wrapper">

                    <table className="orders-table">

                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Products</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody> 
                         {orders && orders.length > 0 ? (
                           orders.map((order) => (

                             <tr key={order._id}>
                              <td> 
                                #{order._id}
                              </td>
                              <td>
                                {order.orderItems?.length || 0} Items
                              </td>
                              <td className="order-price">
                                ₹{order.totalPrice}
                              </td>
                              <td>
                                <span
                                 className={`payment ${
                                   order.paymentInfo?.status === "succeeded"
                                    ? "paid"
                                    : "pending"
                                 }`}
                                >
                                 {order.paymentInfo?.status || "Pending"}
                                </span>
                              </td>
                <td>
                    <span
                        className={`status ${
                            order.orderStatus?.toLowerCase()
                        }`}
                    >
                        {order.orderStatus}
                    </span>
                </td>

                {/* DATE */}
                <td>
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </td>

                {/* ACTIONS */}
                <td>
                    <div className="order-actions">

                        <Link to={`/admin/orders/${order._id}`}>
                            <button className="edit-order-btn">
                                Edit
                            </button>
                        </Link>

                        <button className="delete-order-btn" onClick={()=>deleteOrderBtn(order._id)}>
                            Delete
                        </button>

                    </div>
                </td>

            </tr>

        ))

    ) : (

        <tr>
            <td colSpan="8" style={{ textAlign: "center" }}>
                No Orders Found
            </td>
        </tr>

    )}

</tbody>

                    </table>

                </div>

            </div>

            <Footer />
        </>
    );
};

export default AdminOrders;

