import "../componentsStyling/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaHeart,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery,setSearchQuery]=useState("");

  const navigate=useNavigate();
  const searchHandler=(e)=>{
    e.preventDefault();
    if(searchQuery.trim()){
      navigate(`/products?keyword=${encodeURIComponent(searchQuery)}`);
    }else{
      navigate("/products");
    }
    setSearchQuery("");
  }

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const {cartItems}=useSelector((state)=>state.cart)

  return (
    <nav className="web-navbar">
      <div className="web-nav-container">

        {/* Logo */}
        <div className="web-logo">
          <Link to="/">EasyShop</Link>
        </div>

        {/* Search Bar */}
        <form  onSubmit={searchHandler}>
        <div className="web-search-box">
          <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}/>
          <button>
            <FaSearch />
          </button>
        </div>
        </form>

        {/* Desktop Menu */}
        <ul className={`web-nav-links ${menuOpen ? "active" : ""}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>

        {/* Icons */}
        <div className="web-nav-icons">
          <Link to="/wishlist">
            <FaHeart />
          </Link>

          <Link to="/cart" className="web-cart-icon">
  <FaShoppingCart />

  {isAuthenticated && (
    <span className="web-cart-count">
      {cartItems.length}
    </span>
  )}
</Link>

          {isAuthenticated ? (
          <Link to="/user/profile">
          <img
             src={user?.avatar?.url || "/profile.jpeg"}
             alt="Profile"
             className="web-profile-image"
          />
          </Link>
          ) : (
          <Link to="/register">
            <FaUser />
          </Link>
          )}
        </div>

        {/* Hamburger */}
        <div
          className="web-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;