import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/pageTitle";
import "../pagesStyling/Shipping.css";
import CheckoutSteps from "./CheckoutSteps";
import { Country, State, City }  from 'country-state-city';
import { getAllStates } from "country-state-city/lib/state";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../features/cartSlice";
import { useNavigate } from "react-router-dom";


const Shipping = () => {
  const [address,setAddress]=useState("");
  const [country,setCountry]=useState("");
  const [state,setState]=useState("");
  const [city,setCity]=useState("");
  const [pincode,setPincode]=useState("");
  const [phoneNo,setPhoneNo]=useState("");
  const {shippingInfo}=useSelector((state)=>state.cart)

  const dispatch=useDispatch();
  const navigate=useNavigate();

  const goBack=(e)=>{
    e.preventDefault();
    navigate("/cart")
  }

  const submitShippingInfo=(e)=>{
     e.preventDefault();
     if (!address || !country || !state || !city || !pincode || !phoneNo) {
        toast.error("Please enter all the required fields", {
          position: "top-center",
          autoClose: 2000,
        });
        return
    }
    if(phoneNo.length !== 10 ){
      toast.error("Phone Number Must have 10 Digits",{
        position: "top-center",
        autoClose: 2000,
      });
      return
    }
    dispatch(saveShippingInfo({address,country,city,state,pincode,phoneNo}))
    navigate("/order/confirm")
  }
  
  return (
    <>
      <PageTitle title="Shipping Details" />
      <Navbar />
      <CheckoutSteps shipping={true} />

      <div className="shipping-page">
        <div className="shipping-container">
          <h2>Shipping Information</h2>
          <p>Please enter your delivery details below.</p>

          <form className="shipping-form" onSubmit={submitShippingInfo}>

            {/* Address */}
            <div className="input-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                placeholder="House No, Street, Area"
                name="address"
                value={address}
                onChange={(e)=>setAddress(e.target.value)}
              />
            </div>

            {/* Country */}
            <div className="input-group">
              <label htmlFor="country">Country</label>
              <select name="country" value={country}
                onChange={(e)=>{
                  setCountry(e.target.value) 
                  setState("")
                  setCity("")
              }}>
                <option value="">Select Country</option>
                {Country && Country.getAllCountries().map((item)=>(
                  <option key={item.isoCode} value={item.isoCode} >{item.name}</option>
                ))}
              </select>
            </div>
            

            {/* State */}
            {Country && (<div className="input-group">
              <label htmlFor="state">State</label>
              <select name="state" value={state}
                onChange={(e)=>{
                  setState(e.target.value)
                  setCity("")

                }}>
                <option value="">Select State</option>
                {State && State.getStatesOfCountry(country).map((item)=>(
                  <option key={item.isoCode} value={item.isoCode} >{item.name}</option>
                ))}
              </select>
            </div>)}

            {/* City */}
            {State && (<div className="input-group">
              <label htmlFor="city">City</label>
              <select name="city" value={city}
                onChange={(e)=>setCity(e.target.value)}>
                <option value="">Select City</option>
                {City && City.getCitiesOfState(country,state).map((item)=>(
                  <option key={item.name} value={item.name} >{item.name}</option>
                ))}
              </select>
            </div>)}

            <div className="two-inputs">

              {/* Pincode */}
              <div className="input-group">
                <label htmlFor="pincode">Pincode</label>
                <input
                  type="number"
                  placeholder="Enter Pincode"
                  name="pincode"
                  value={pincode}
                  onChange={(e)=>setPincode(e.target.value)}
                  
                />
              </div>

              {/* Phone Number */}
              <div className="input-group">
                <label htmlFor="phoneNo">Phone Number</label>
                <input
                  type="number"
                  placeholder="Enter Phone Number"
                  name="phoneNo"
                  value={phoneNo}
                  onChange={(e)=>setPhoneNo(e.target.value)}
                />
              </div>

            </div>

            <button className="go-back" onClick={goBack}>Go Back</button>

            <button type="submit" className="shipping-btn" onSubmit={submitShippingInfo}>
              CONTINUE
            </button>

          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Shipping;
