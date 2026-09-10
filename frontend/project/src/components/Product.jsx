import { useState } from "react";
import "../componentsStyling/Product.css"
import Rating from "../components/Rating"
import { Link } from "react-router-dom";

function Product({ product }) {
  const[rating,setRating]=useState(0);
  const handleRatingChange=(newRating)=>{
   setRating(newRating)
  }
  return (
    <>
    <Link to={`/products/${product._id}`} className="product-link">
     <div className="product-card">
      <img src={product.image?.[0]?.url} alt={product.name} className="product-image-card"/>
      <div className="product-details">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-price">₹{product.price} /-</p>
        <div className="rating-container">
          <Rating disabled={true} value={product.ratings} onRatingChange={handleRatingChange} />
        </div>
        <p className="product-review">({product.numOfReviews}{product.numOfReviews === 1? " review":" reviews"}) </p>
        <button className="add-to-cart">View</button>
      </div>
     </div>
     </Link>
    </>
  );
}

export default Product;


        