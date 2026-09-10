import React, { useEffect, useState } from 'react'
import { FaTrashAlt } from "react-icons/fa";
import { toast } from 'react-toastify'
import { addItemtoCart, removeError, removeItemFromCart, removeMessage } from '../features/cartSlice';
import { useDispatch, useSelector } from 'react-redux';

const CartItem = ({item}) => {
  const [quantity,setQuantity]=useState(item.quantity);
  const {loading,error,message,success,CartItems}=useSelector((state)=>state.cart)
  const dispatch=useDispatch()
    console.log("CART ITEM:", item);
  console.log("IMAGE URL:", item.image);

  
   // increas qunatity function
      const increaseQuantity=()=>{
         if(item.stock<=quantity){
          toast.error("Cannot exceed available Stock!",{position:'top-center',autoClose:2000});
          dispatch(removeError());
          return
         }
         setQuantity(quantity+1);
      }
  
      const decreaseQuantity=()=>{
         if(quantity<=1){
          toast.error("Quantity Cannot be less than 1",{position:'top-center',autoClose:2000});
          dispatch(removeError());
          return
         }
         setQuantity(quantity-1);
      }

      const updateCartHandler=()=>{
        if(loading) return
        if(quantity!==item.quantity){
            dispatch(addItemtoCart({id:item.product,quantity}))
        }
      }


      const HandleRemove=()=>{
        if(loading) return
        dispatch(removeItemFromCart(item.product))
        toast.success("Item Removed from cart Successfully",{position:'top-center',autoClose:2000});
      }
      
      useEffect(()=>{
        if(success){
            toast.success(message,{position:"top-center",autoClose:3000,toastId:"cart-update"})
            dispatch(removeMessage())
        }
      },[dispatch,success,message])

  return (
    <div>
      <div className="cart-item">
        {/* item image section             */}
      <div className="cart-image">
       <img
        src={item.image}
        alt={item.name}
       />
      </div>
      
        <div className="cart-info">
            <h2>{item.name}</h2>
            <p>Quantity: {item.quantity}</p> 
            <p>Stock: {item.stock}</p>
            <div className="cart-bottom">
                <div className="quantity-box">
                    <button onClick={decreaseQuantity} disabled={loading}>-</button>
                    <input
                        type="number"
                        value={quantity}
                        readOnly
                    />
                    <button onClick={increaseQuantity} disabled={loading}>+</button>
                </div>
      
                <button
                  className="update-btn"
                  disabled={loading || quantity === item.quantity}
                  onClick={() => updateCartHandler(item.product, quantity)}
                >
                 {loading ? "UPDATING..." : "UPDATE"} 
                </button>
      
                <button className="remove-btn" onClick={HandleRemove}
                disabled={loading}>
                    <FaTrashAlt /> &nbsp;
                    Remove
                </button>
            </div>
        </div>
      
        <div className="cart-price">
            Price: {item.price.toFixed(2)}
        </div>
      </div>
    </div>
  )
}

export default CartItem
