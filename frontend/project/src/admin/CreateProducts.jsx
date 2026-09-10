import React, { useState } from "react";
import "./CreateProducts.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import PageTitle from "../components/pageTitle.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { createProduct,removeError, removeSuccess } from "../features/adminSlice.js";
import { useEffect } from "react";

function CreateProducts() {
  const [name,setName]=useState("");
  const [price,setPrice]=useState("");
  const [description,setDescription]=useState("");
  const [category,setCategory]=useState("");
  const [stock,setStock]=useState("");
  const [image,setImage]=useState([]);
  const [imagePreview,setImagePreview]=useState([]);

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

  const{loading,success,error}=useSelector((state)=>state.admin);
  const { user, loading: userLoading, isAuthenticated } = useSelector((state) => state.user);
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const createProductForm=(e)=>{
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
    dispatch(createProduct(myForm));
  }

  const createProductImage=(e)=>{
    const files=Array.from(e.target.files);
    console.log(files);
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

  useEffect(()=>{
    if(error){
      toast.error(error,{position:'top-center',autoClose:2000})
      dispatch(removeError())
    }
    if(success){
      toast.success("Product created Succcessfully !",{position:'top-center',autoClose:2000})
      navigate("/products")
      dispatch(removeSuccess());
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategory("");
      setImage([]);
      setImagePreview([]);
    }
  },[dispatch,error,success])

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

  
  return (
    <>
      <Navbar />
      <PageTitle title="Add Product" />

      <div className="create-product-container">
        <h1 className="form-title">Create Product</h1>
        <form action="" className="product-form" encType="multipart/form-data" onSubmit={createProductForm}>
        {/* //product Name */}
        <input type="text" placeholder="Enter Product Name" name="name" className="form-input" value={name} onChange={(e)=>setName(e.target.value)} required/>
        {/* Product Price */}
        <input type="number" placeholder="Enter Product Price" name="price" className="form-input" value={price} onChange={(e)=>setPrice(e.target.value)} required/>
        {/* product decription */}
        <input type="text" placeholder="Enter Product Description" name="descriprion" className="form-input" value={description} onChange={(e)=>setDescription(e.target.value)} required/>
        {/* product category */}
        <select name="category" className="form-select" required value={category} onChange={(e)=>setCategory(e.target.value)}>
          <option value="">Select category</option>
          {categories.map((category)=>(
           <option value={category} key={category}>{category}</option>
          ))}
        </select>
        {/* //product stock */}
        <input type="Number" placeholder="Enter Product Stock" name="stock" className="form-input" value={stock} onChange={(e)=>setStock(e.target.value)} required/>
        {/* product image */}
        <div className="form-input-container">
          <input type="file" accept="image/*" name="name" className="form-input-image" multiple onChange={createProductImage}/>
        </div>
        <div className="image-review-container">
          {imagePreview.map((img,index)=>(<img src={img} alt="product-preview" className="image-preview" key={index}/>))}
        </div>
        <button className="submit-btn">{loading?'Creating Product':'create'}</button>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default CreateProducts;