import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/pageTitle";
import Loader from "../components/Loader";
import "../pagesStyling/MyOrders.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllMyorders } from "../features/orderSlice";

const MyOrders = () => {

  const { orders, loading, error } = useSelector(
    (state) => state.order
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllMyorders());
  }, [dispatch]);


  // Loading
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
      <PageTitle title="My Orders" />

      <Navbar />

      <main className="orders-page">

        <div className="orders-container">

          {/* HEADER */}

          <div className="orders-header">

            <div>

              <span className="orders-eyebrow">
                EASY-SHOP
              </span>

              <h1>
                My Orders
              </h1>

            </div>

            <span className="orders-count">
               ORDERS
            </span>

          </div>


          {/* ERROR */}

          {error && (
            <div className="no-orders">

              <h2>
                No Orders
              </h2>

              <p>
                You haven't placed any orders yet.
              </p>

              <Link
                to="/products"
                className="single-view-btn"
              >
                START SHOPPING
              </Link>

            </div>
          )}


          {/* NO ORDERS */}

          {!error && orders.length === 0 && (

            <div className="no-orders">

              <div className="no-orders-icon">
                🛍️
              </div>

              <h2>
                No Orders Yet
              </h2>

              <p>
                You haven't placed any orders yet.
              </p>

              <Link
                to="/products"
                className="single-view-btn"
              >
                START SHOPPING
              </Link>

            </div>

          )}


          {/* ORDERS */}

          {!error && orders.length > 0 && (

            orders.map((order) => (

              <div
                className="single-order"
                key={order._id}
              >

                {/* ORDER HEADER */}

                <div className="single-order-header">

                  <div>

                    <span>
                      ORDER
                    </span>

                    <strong>
                      #{order._id}
                    </strong>

                  </div>


                  <div>

                    <span>
                      DATE
                    </span>

                    <strong>
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString("en-IN")}
                    </strong>

                  </div>


                  <div className="status delivered">
                    {order.orderStatus}
                  </div>

                </div>


                {/* ORDER BODY */}

                <div className="single-order-body">

                  {/* IMAGE */}

                  <div className="single-product-image">

                    <img
                      src={order.orderItems[0].image}
                      alt={order.orderItems[0].name}
                    />

                  </div>


                  {/* PRODUCT */}

                  <div className="single-product-info">

                    <span className="product-category">
                      EASY-SHOP
                    </span>

                    <h2>
                      {order.orderItems[0].name}
                    </h2>

                    <p>
                      Quantity:{" "}
                      {order.orderItems[0].quantity}
                    </p>

                    <strong className="single-product-price">
                      ₹
                      {order.orderItems[0].price.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>


                  {/* ORDER DETAILS */}

                  <div className="single-order-details">

                    <div>

                      <span>
                        PAYMENT
                      </span>

                      <strong>
                        {order.paymentInfo?.status ===
                        "succeeded"
                          ? "PAID"
                          : "PENDING"}
                      </strong>

                    </div>


                    <div>

                      <span>
                        TOTAL
                      </span>

                      <strong>
                        ₹
                        {order.totalPrice.toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>


                    <Link
                      to={`/user/orders/${order._id}`}
                      className="single-view-btn"
                    >
                      VIEW ORDER
                    </Link>

                  </div>

                </div>

              </div>

            ))

          )}

        </div>

      </main>

      <Footer />
    </>
  );
};

export default MyOrders;
