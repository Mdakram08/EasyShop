import React, { useEffect, useState } from 'react'
import Navbar from "../components/Navbar.jsx"
import PageTitle from "../components/PageTitle.jsx"
import Footer from "../components/Footer.jsx"
import "./UpdateProducts.css"
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getSingleProduct } from '../features/productSlice.js'
import { removeSuccess, updateProduct ,removeError} from '../features/adminSlice.js'

const UpdateProducts = () => {
  
  // state variables
  const [name,setName]=useState("");
  const [price,setPrice]=useState("");
  const [description,setDescription]=useState("");
  const [category,setCategory]=useState("");
  const [stock,setStock]=useState("");
  const [image,setImage]=useState([]);
  const[oldImage,SetOldImage]=useState([]);
  const [imagePreview,setImagePreview]=useState([]);
  //user state
  const { user, loading: userLoading, isAuthenticated } = useSelector((state) => state.user);
  //admin state
  const{loading,error,success}=useSelector((state)=>state.admin)
  //product state
  const {product}=useSelector((state)=>state.product);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  //product id from parameters
  const {id}=useParams();
  
  // if id  then dispatch product details snd render in the update FOrm
  useEffect(()=>{
    if(id){
      dispatch(getSingleProduct(id))
    }
  },[dispatch,id])
  
  //if product exists then display product details in the updateform
  useEffect(()=>{
    if(product && product._id){
      setName(product.name)
      setDescription(product.description)
      setPrice(product.price)
      setStock(product.stock)
      setCategory(product.category)
      SetOldImage(product.image)
    }
  },[product])

  const categories = [
    "Men",
    "Women",
    "Kids",
    "Electronics",
    "Footwear",
    "Sports",
    "Home",
    "Beauty",
    "Others"
  ];

  const handleImageChange=(e)=>{
    const files=Array.from(e.target.files);
    setImage([]);
    setImagePreview([]);

    files.forEach((file)=>{
      const reader=new FileReader();
      reader.onload=()=>{
        if(reader.readyState===2){
          setImage((old)=>[...old,reader.result]);
          setImagePreview((old)=>[...old,reader.result])
        }
      }
      reader.readAsDataURL(file)
    })
  }
  
  //updtaae form
  const updateProductSubmit=(e)=>{
    e.preventDefault();
    const myForm=new FormData();
    myForm.set("name",name);
    myForm.set("price",price);
    myForm.set("description",description);
    myForm.set("stock",stock);
    myForm.set("category",category);
    image.forEach((img)=>{
    myForm.append("image",img)
    })
    dispatch(updateProduct({id,myForm}));
  }

  //if error occurs or success
  useEffect(()=>{
    if(error){
      toast.error(error,{position:'top-center',autoClose:2000})
      dispatch(removeError())
    }
    if(success){
      toast.success("Product Updated Succcessfully !",{position:'top-center',autoClose:2000})
      navigate("/admin/products")
      dispatch(removeSuccess());
     }
   },[dispatch,error,success])
   
  // if user loading or user is not logged in
  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      toast.error("Please login to access Admin Panel", {
      position: "top-center",
      autoClose: 2000
    });
    navigate("/login");
    }
  }, [userLoading, isAuthenticated, navigate]);
   
  // if user loading and user is not admin in
  useEffect(() => {
    if (!userLoading && isAuthenticated && user?.role !== "admin") {
      toast.error("You are not authorized to access Admin Panel", {
        position: "top-center",
        autoClose: 2000
      });
      navigate("/");
    }
  }, [userLoading, isAuthenticated, user, navigate]); 

  return (
    <>
      <Navbar/>
      <PageTitle title="Admin-UpdateProducts"/>

      <div className="create-product-container">

        <h1 className="form-title">
          Update Product
        </h1>

        <form
          className="product-form"
          encType="multipart/form-data"
          onSubmit={updateProductSubmit}
        >

          {/* product name */}
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="form-input"
            placeholder="Enter Product Name"
            value={name} onChange={(e)=>setName(e.target.value)}
          />

          {/* product price */}
          <label htmlFor="price">Product Price</label>
          <input
            type="number"
            name="price"
            id="price"
            required
            className="form-input"
            placeholder="Enter Product Price"
            value={price} onChange={(e)=>setPrice(e.target.value)}
          />

          {/* product description */}
          <label htmlFor="description">Product Description</label>
          <textarea
            name="description"
            id="description"
            required
            className="form-input"
            placeholder="Enter Product Description"
            value={description} onChange={(e)=>setDescription(e.target.value)}
          />

          {/* product category */}
          <select
            name="category"
            id="category"
            className="form-select"
            required
            defaultValue=""
            value={category} onChange={(e)=>setCategory(e.target.value)}
          >
            <option value="" disabled>
              Select category
            </option>

            {categories.map((category) => (
              <option
                value={category}
                key={category}
              >
                {category}
              </option>
            ))}
          </select>

          {/* product stock */}
          <label htmlFor="stock">Product Stock</label>
          <input
            type="number"
            name="stock"
            id="stock"
            required
            className="form-input"
            placeholder="Enter Product Stock"
            value={stock} onChange={(e)=>setStock(e.target.value)}
          />

          {/* product image */}
          <label htmlFor="image">Product Image</label>

          <div className="form-input-container">
            <input
              type="file"
              name="image"
              id="image"
              // required
              className="form-input-image"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>
         
          {/* new image product */}
          <div className="update-product-preview-wrapper">
            {imagePreview.map((img,index)=>(<img src={img} alt="Product Preview" className='update-product-preview-image' key={index}/>))}
          </div>

          {/* old image preview */}
          <div className="image-review-container">
            {oldImage.map((img,index)=>(<img
              src={img.url}
              alt="Old image"
              className="image-preview"
              key={index}
            />))}
          </div>

          {/* update button */}
          <button
            type="submit"
            className="submit-btn"
          >
            {loading?'Updating Product':'Update'}
          </button>

        </form>
      </div>

      <Footer/>
    </>
  )
}

export default UpdateProducts