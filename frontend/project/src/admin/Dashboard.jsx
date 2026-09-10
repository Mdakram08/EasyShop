import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import PageTitle from "../components/pageTitle.jsx";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaBox, FaUsers, FaShoppingCart, FaStar, FaPlus, FaTrash, FaEdit, FaEye, FaBars, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const Admin = () => {
  const navigate = useNavigate();

  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  

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
  

  if (loading || !isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <>
      <Navbar />

      <PageTitle title="Admin Dashboard" />

      <div className="admin-container">

        <main className="admin-content">

          <div className="admin-header">
            <h1>Dashboard</h1>
            <p>
              <b>Welcome back, Mr. {user?.userName?.charAt(0).toUpperCase() + user?.userName?.slice(1)}</b>
            </p>
              <p className="admin-description">
               Manage your entire e-commerce platform from one place. Monitor products,
               users, orders, and customer reviews, while keeping track of your store's
               overall activity.
              </p>
          </div>

          <div className="admin-cards">

            <div
              className="admin-card"
              onClick={() => navigate("/admin/products")}
            >
              <FaBox />

              <div>
                <h3>All Products</h3>
                <p>Manage products</p>
              </div>
            </div>

            <div
              className="admin-card"
              onClick={() => navigate("/admin/users")}
            >
              <FaUsers />

              <div>
                <h3>All Users</h3>
                <p>Manage users</p>
              </div>
            </div>

            <div
              className="admin-card"
              onClick={() => navigate("/admin/orders")}
            >
              <FaShoppingCart />

              <div>
                <h3>All Orders</h3>
                <p>Manage orders</p>
              </div>
            </div>

            <div
              className="admin-card"
              onClick={() => navigate("/admin/reviews")}
            >
              <FaStar />

              <div>
                <h3>All Reviews</h3>
                <p>Manage reviews</p>
              </div>
             </div>

          </div>

       
           <p className="admin-description">
            The Admin Panel is the central management system of the e-commerce website, designed to give administrators complete control over the platform and its day-to-day operations. From this dashboard, administrators can easily manage products, users, orders, and customer reviews from a single, organized interface. The panel provides a clear overview of the store and helps administrators monitor important activities efficiently.

            The Products section allows administrators to add new products, update existing product information, manage prices and categories, update stock availability, and remove products when required. The Users section provides access to registered customer information, allowing administrators to manage user accounts and monitor customer activity. The Orders section helps administrators view and manage customer orders, check order details, track order status, and ensure that orders are processed properly.

            The Reviews section allows administrators to monitor customer feedback and reviews submitted for products. This helps maintain the quality of the platform and provides useful insights into customer satisfaction. The dashboard can also display important statistics such as the total number of products, registered users, orders, and overall revenue, giving administrators a quick understanding of the website's performance.

            The Admin Panel is designed with a simple and user-friendly interface so that administrators can navigate between different sections without difficulty. By bringing all essential management features together, it reduces the time required to perform administrative tasks and makes the overall management process more efficient. As the application grows, the panel can also be extended with features such as sales analytics, inventory alerts, revenue reports, customer management, notifications, and advanced performance monitoring, making it a powerful solution for managing the complete e-commerce platform.
           </p>

        </main>

        

      </div>
    <Footer/>
    </>
  );
};

export default Admin;