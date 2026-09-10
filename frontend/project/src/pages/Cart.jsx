import React from "react";
import "../pagesStyling/Cart.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/pageTitle";
import { FaTrashAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



const Cart = () => {
  const {cartItems}=useSelector((state=>state.cart));
  const {loading,isAuthenticated} = useSelector((state) => state.user);
  
  //price calculator
  const subTotal=cartItems.reduce((acc,item)=>acc+item.price*item.quantity,0);
  //tax 
  const tax=subTotal*0.18
  //shipping charges
  const shipping=subTotal>1000?0:100;
  //total
  const total=shipping+tax+subTotal

  const navigate = useNavigate();
  //if user is logged in only he can view the cart
  useEffect(() => {
      if (!loading && !isAuthenticated) {
        toast.error("Please log in to continue to your cart.",{position:'top-center',autoClose:2000})
        navigate("/login");
      }
    }, [loading, isAuthenticated, navigate]);
  
  //checkout function
  const checkoutHandler=()=>{
    navigate("/shipping")
  }

  const CountinueHandler=()=>{
    navigate("/products")
  }

  return (
    <>
      <PageTitle title="My-cart" />
      <Navbar />

      {cartItems.length==0?(
        <div className="empty-cart">
         <h1>Your Cart Is Empty</h1>
         <p>
           Looks like you haven't added anything to your shopping bag yet.
         </p>
         <Link to="/products" className="shop-btn">
            CONTINUE SHOPPING
         </Link>
        </div>
      ):
      (<div className="cart-page">

        {/* Header */}
        <div className="cart-header">
          <h2>My Cart</h2>
        </div> 

        <div className="cart-wrapper">

          {/* Left Side */}
          <div className="cart-items">

            {/* Product 1 */}

            {cartItems && cartItems.map((item)=>(
              <CartItem item={item} key={item}/>
            ))}

          </div>

          {/* Summary */}

          <div className="order-summary">

            <h2>ORDER SUMMARY</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{subTotal}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping}</span>
            </div>

            <div className="summary-row">
              <span>Tax 18%</span>
              <span>{tax}</span>
            </div>

            <hr />

            <div className="summary-row total">
              <span>Total</span>
              <span>{total}</span>
            </div>
            
            <button className="checkout-btn" onClick={checkoutHandler}>
              PROCEED TO CHECKOUT
            </button>
            
            <button className="continue-btn" onClick={CountinueHandler}>
              CONTINUE SHOPPING
            </button>

          </div>

        </div>

      </div>
      )}

      <Footer />
    </>
  );
};

export default Cart;
