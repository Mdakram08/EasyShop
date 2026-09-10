import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import "./Reviews.css"
import PageTitle from '../components/pageTitle'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { allAdminProducts, deleteProductReviews, fetchProductReviews, removeError, removeMessage, removeSuccess } from '../features/adminSlice'
import { useNavigate } from 'react-router-dom'

const Reviews = () => {
  const {products,loading,error,productReview,message,success}=useSelector(state=>state.admin);
  const { user, loading:userLoading, isAuthenticated } = useSelector((state) => state.user);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [selectedProduct,setSelectedProduct]=useState(null);

  const handleReviews=(id)=>{
    setSelectedProduct(id);
    dispatch(fetchProductReviews(id))
  }

  const handleDeleteReview=(id,reviewId)=>{
    const confirm=window.confirm("Are you sure that you want to delete this review ?");
    if(confirm){
      dispatch(deleteProductReviews({id,reviewId}))
    }
  }

  useEffect(()=>{
    dispatch(allAdminProducts());
  },[dispatch]);

  useEffect(()=>{
    if(error){
      toast.error(error,{position:'top-center',autoClose:2000})
      dispatch(removeError())
    }
    if(success){
      toast.success(message,{position:'top-center',autoClose:2000})
      dispatch(removeSuccess());
      dispatch(removeMessage());
      navigate("/admin/dashboard")
    }
  },[dispatch,error,success,message]);

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

  if(loading || !products || products.length===0){
    return(
      <>
        <PageTitle title="Admin Reviews"/>
        <Navbar/>
        <Footer/>
      </>
      )
  }


  return (
    <>
      <Navbar/>
      <PageTitle title="Admin Reviews" />
      <div className="reviews-container">
        <div className="product-review">
          <h1>Product Reviews</h1>
          <table className="reviews-table">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Product Name</th>
                <th>Product Image</th>
                <th>Number of Reviews</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product,index)=>(
                <tr key={product._id}>
                <td>{index+1}</td>
                <td>{product.name}</td>
                <td>
                  <img src={product.image?.[0]?.url} alt="prod IAMge" className='product-image'/>
                </td>
                <td>{product.numOfReviews}</td>
                <td>
                  <button className='action-btn view-btn'onClick={()=>handleReviews(product._id)}>View Reviews</button>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
          {selectedProduct && productReview && productReview.length>0 && (
          <div className="reviews-details">
            <h2>Reviews for product</h2>
            <table className="reviews-table">
              <thead>
                <tr>
                  <th>Sl No</th>
                  <th>Reviewrs Name</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productReview.map((review,index)=>(<tr>
                  <td>{index+1}</td>
                  <td>{review.name}</td>
                  <td>{review.rating}</td>
                  <td>{review.comment}</td>
                  <td><button className='action-btn delete-btn' onClick={()=>handleDeleteReview(selectedProduct,review._id)}>Delete</button></td>
                </tr>))}
              </tbody>
            </table>
          </div>)}
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default Reviews
