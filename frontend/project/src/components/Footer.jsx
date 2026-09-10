import "../componentsStyling/Footer.css"
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-easyhop">
      <div className="footer-container-easyhop">

        {/* Brand Section */}
        <div className="footer-section-easyhop">
          <h2 className="footer-logo-easyhop">EasyShop</h2>
          <p>
            Your one-stop destination for quality products at affordable prices.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section-easyhop">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/cart">Cart</a></li>
            <li><a href="/login">Login</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="footer-section-easyhop">
          <h3>Customer Service</h3>
          <ul>
            <li><a href="/">Contact Us</a></li>
            <li><a href="/">Shipping Policy</a></li>
            <li><a href="/">Returns & Refunds</a></li>
            <li><a href="/">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-section-easyhop">
          <h3>Follow Us</h3>
          <div className="social-icons-easyhop">
            <a href="/"><FaFacebookF /></a>
            <a href="/"><FaInstagram /></a>
            <a href="/"><FaTwitter /></a>
            <a href="/"><FaLinkedinIn /></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom-easyhop">
        <p>© {new Date().getFullYear()} ShopEase. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;