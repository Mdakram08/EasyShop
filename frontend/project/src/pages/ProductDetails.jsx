import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Rating from "../components/Rating";
import PageTitle from "../components/pageTitle";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import "../pagesStyling/ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { addItemtoCart, removeMessage } from "../features/cartSlice"; 
import {
    createRatingReview,
    getSingleProduct,
    removeError,
    removeSuccess
} from "../features/productSlice";
import { toast } from "react-toastify";

const ProductDetails = () => {
    // Stores the rating selected by the user
    const [userRating, setUserRating] = useState(0);
    // Stores the review text entered by the user
    const [reviewComment, setReviewComment] = useState("");
    // Stores the quantity selected for the product
    const [quantity, setQuantity] = useState(1);
    // Gets authentication status from Redux
    const { isAuthenticated } = useSelector((state) => state.user);
    //mutliple image of a poroduct
    const[selectedImage,setSetlectedImage]=useState("");
    // Gets product information from Redux
    const {
        error,
        product,
        loading,
        reviewSuccess,
        reviewLoading
    } = useSelector((state) => state.product);
     console.log("PRODUCT:", product);
     console.log("IMAGES:", product?.image);
    // Gets cart information from Redux
    const {
        error: cartError,
        loading: cartLoading,
        success,
        message
    } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    // Gets product ID from the URL
    const { id } = useParams();

    // Updates the selected rating when the user clicks a star
    const handleRatingChange = (newRating) => {
        setUserRating(newRating);
    };

    // Increases product quantity without exceeding available stock
    const increaseQuantity = () => {
        if (product.stock <= quantity) {
            toast.error("Cannot exceed available Stock!", {
                position: "top-center",
                autoClose: 2000
            });
            return;
        }
        setQuantity(quantity + 1);
    };

    // Decreases quantity but does not allow it below 1
    const decreaseQuantity = () => {
        if (quantity <= 1) {
            toast.error("Quantity Cannot be less than 1!", {
                position: "top-center",
                autoClose: 2000
            });
            return;
        }
        setQuantity(quantity - 1);
    };

    // Adds the selected product quantity to the cart
    const addToCart = () => {
        // Prevents unauthenticated users from adding products to the cart
        if (!isAuthenticated) {
            toast.error("Please login to place an Order!", {
                position: "top-center",
                autoClose: 2000
            });
            return;
        }
        dispatch(addItemtoCart({ id, quantity }));
    };

    // Validates and submits the review
    // const submitReview = (e) => {
    //     e.preventDefault();
    //     // Rating must be selected before submitting
    //     if (userRating === 0) {
    //         toast.error("Please select a rating", {
    //             position: "top-center",
    //             autoClose: 2000
    //         });
    //         return;
    //     }
    //     // Review comment cannot be empty
    //     if (!reviewComment.trim()) {
    //         toast.error("Please write a review", {
    //             position: "top-center",
    //             autoClose: 2000
    //         });
    //         return;
    //     }
    //     // Sends review data to the backend
    //     dispatch(
    //         createRatingReview({
    //             rating: userRating,
    //             comment: reviewComment,
    //             productId: id
    //         })
    //     );
    // };
    const submitReview = async (e) => {
    e.preventDefault();

    if (userRating === 0) {
        toast.error("Please select a rating", {
            position: "top-center",
            autoClose: 2000,
        });
        return;
    }

    if (!reviewComment.trim()) {
        toast.error("Please write a review", {
            position: "top-center",
            autoClose: 2000,
        });
        return;
    }

    try {
        await dispatch(
            createRatingReview({
                rating: userRating,
                comment: reviewComment.trim(),
                productId: id,
            })
        ).unwrap();

        // Clear form after successful submission
        setUserRating(0);
        setReviewComment("");

        toast.success("Review submitted successfully!", {
            position: "top-center",
            autoClose: 2000,
        });
    } catch (error) {
        toast.error(error || "Failed to submit review", {
            position: "top-center",
            autoClose: 2000,
        });
    }
};

    // Gets the product when the page loads or product ID changes
    useEffect(() => {
        if (id) {
            dispatch(getSingleProduct(id));
        }
    }, [dispatch, id]);

    // Handles successful review creation or update
    useEffect(() => {
        if (reviewSuccess) {
            // Displays success message after review is saved
            toast.success("Review submitted successfully!", {
                position: "top-center",
                autoClose: 2000
            });
            // Clears the review form after successful submission
            setUserRating(0);
            setReviewComment("");
            // Gets the updated product containing the latest review
            dispatch(getSingleProduct(id));
            // Resets the review success state
            dispatch(removeSuccess());
        }
    }, [reviewSuccess, dispatch, id]);

    // Handles product and cart errors
    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "top-center",
                autoClose: 2000
            });
            dispatch(removeError());
        }
        if (cartError) {
            toast.error(
                typeof cartError === "string"
                    ? cartError
                    : cartError.message || "Something went wrong",
                {
                    position: "top-center",
                    autoClose: 2000
                }
            );
            dispatch(removeError());
        }
    }, [dispatch, error, cartError]);

    // Displays success message after adding a product to the cart
    useEffect(() => {
        if (success) {
            toast.success(message, {
                position: "top-center",
                autoClose: 2000
            });
            dispatch(removeMessage());
        }
    }, [dispatch, message, success]);
    
    useEffect(() => {
     if (product && product.image && product.image.length > 0) {
        setSetlectedImage(product.image[0]?.url);
     }
    }, [product]);

    // Shows loader while product data is being fetched
    if (loading) {
        return (
            <>
                <Navbar />
                <Loader />
                <Footer />
            </>
        );
    }

    // Shows basic page if product does not exist
    if (error || !product) {
        return (
            <>
                <PageTitle title="Product-details" />
                <Navbar />
                <Footer />
            </>
        );
    }

 

    return (
        <>
            <Navbar />
            <PageTitle title={product.name} />
            <div className="product-details-container">
                <div className="product-detail-container">
                    {/* Displays product image */}
                    <div className="product-image-container">
                        <img
                            src={selectedImage}
                            alt={product.name}
                            className="product-detail-image"
                        />
                        {product.image.length>1 && (<div className="product-thumbnails">
                            {product.image.map((img,index)=>(<img src={img.url} alt="thumbnail" className="thumbnails-image" key={index} onClick={()=>setSetlectedImage(img.url)}/>))}
                        </div>)}
                    </div>
                    {/* Displays product information */}
                    <div className="product-info">
                        <h2>{product.name}</h2>
                        <p className="product-description">
                            {product.description}
                        </p>
                        <p className="product-price">
                            ₹{product.price}/-
                        </p>
                        {/* Displays the existing product rating as read-only */}
                        <div className="product-rating">
                            <Rating
                                value={product.ratings}
                                disabled={true}
                            />
                            <span className="productCardSpan">
                                {product.ratings}
                            </span>
                        </div>
                        {/* Displays stock status */}
                        <div className="stock-status">
                            <span
                                className={
                                    product.stock > 0
                                        ? "in-stock"
                                        : "out-of-stock"
                                }
                            >
                                {product.stock > 0
                                    ? `In Stock (${product.stock} available)`
                                    : "Out of Stock"}
                            </span>
                        </div>
                        {/* Displays quantity controls when product is in stock */}
                        {product.stock > 0 && (
                            <>
                                <div className="quantity-controls">
                                    <span className="quantity-label">
                                        Quantity :
                                    </span>
                                    <button
                                        className="quantity-button"
                                        onClick={decreaseQuantity}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="text"
                                        className="quantity-value"
                                        value={quantity}
                                        readOnly
                                    />
                                    <button
                                        className="quantity-button"
                                        onClick={increaseQuantity}
                                    >
                                        +
                                    </button>
                                </div>
                                {/* Displays total number of reviews */}
                                <p className="product-reviews">
                                    No of reviews {product.numOfReviews}
                                </p>
                                {/* Adds the product to the cart */}
                                <button
                                    className="add-to-cart"
                                    onClick={addToCart}
                                    disabled={cartLoading}
                                >
                                    {cartLoading
                                        ? "Adding to cart"
                                        : "Add to cart"}
                                </button>
                            </>
                        )}
                        {/* Displays review form only when the user is logged in */}
                        {isAuthenticated ? (
                            <form
                                onSubmit={submitReview}
                                className="review-form"
                            >
                                <h3>Write a review</h3>
                                {/* Allows the logged-in user to select a rating */}
                                <Rating
                                    value={userRating}
                                    disabled={false}
                                    onRatingChange={handleRatingChange}
                                />
                                {/* Allows the logged-in user to enter a review comment */}
                                <textarea
                                    className="review_input"
                                    placeholder="Write the product review here!"
                                    value={reviewComment}
                                    onChange={(e) =>
                                        setReviewComment(e.target.value)
                                    }
                                />
                                {/* Submits the review to the backend */}
                                <button
                                    className="submit-review-btn"
                                    type="submit"
                                    disabled={reviewLoading}
                                >
                                    {reviewLoading
                                        ? "Submitting"
                                        : "Submit Review"}
                                </button>
                            </form>
                        ) : (
                            // Displays this message when the user is not logged in
                            <p className="no-review-login">
                                Please login to Review a Product.
                            </p>
                        )}
                    </div>
                </div>
                {/* Customer reviews section */}
                <div className="review-container">
                    <h3 className="c-r">
                        <b>Customer Reviews</b>
                    </h3>
                    {/* Checks whether the product has any reviews */}
                    {product.reviews && product.reviews.length > 0 ? (
                        <div className="review-section">
                            {/* Loops through all product reviews */}
                            {product.reviews.map((review, index) => (
                                <div
                                    className="review-item"
                                    key={review._id || index}
                                >
                                    <div className="review-header">
                                        {/* Displays the review rating as read-only */}
                                        <Rating
                                            value={review.rating}
                                            disabled={true}
                                        />
                                        {/* Displays the review comment */}
                                        <p className="review-comment">
                                            {review.comment}
                                        </p>
                                        {/* Displays the reviewer's username */}
                                        <p className="review-name">
                                            <b>{review.name}</b>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Displays this message when there are no reviews
                        <p className="no-reviews">
                            No reviews yet. Be the first to review this product.
                        </p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProductDetails;