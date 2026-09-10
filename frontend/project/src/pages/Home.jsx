import Navbar from "../components/Navbar";
import ImageSlider from "../components/ImageSlider";
import Footer from "../components/Footer";
import Product from "../components/Product";
import PageTitle from "../components/pageTitle";
import "../pagesStyling/Home.css"
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getProduct, removeError } from "../features/productSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

function Home() {
  
  const {error,products,loading,productCount}=useSelector((state)=>state.product);
  
  //dipatch products
  const dispatch=useDispatch()
  useEffect(()=>{
     dispatch(getProduct({keyword:""}));
  },[dispatch])
  
  //if any error occuress
    useEffect(()=>{
        if(error){
          toast.error(error,{position:'top-center',autoClose:2000})
          dispatch(removeError())
        }
    },[dispatch,error])
 
  if(error || !products){
    return(
      <>
        <PageTitle title="Product-details"/>
        <Navbar/>
        <Footer/>
      </>
      )
  }
 
  return (
    <>
      <Navbar/>
      <PageTitle title="Easy-Shop" />
      <ImageSlider />

      <div className="home-container">
        <h2 className="home-heading">
          <b>Trending Now!</b>
        </h2>

        <div className="home-products-container">
          {products.map((product,index) => (
            <Product product={product} key={product._id} />
          ))}
        </div>
      </div>
      <Footer/>
  </>
  )};

export default Home;