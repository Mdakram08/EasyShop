import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },

  description: {
    type: String,
    required: [true, "Description is required"],
  },

  price: {
    type: Number,
    required: [true, "Price is required"],
    max: [9999999, "Price cannot exceed 7 digits"],
  },

  ratings: {
    type: Number,
    default: 0,
  },

image: [
  {
    public_id: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },
  },
],
  category: {
    type: String,
    required: [true, "Category is required"],
  },

  stock: {
    type: Number,
    required: [true, "Stock is required"],
    max: [99999, "Stock cannot exceed 5 digits"],
    default: 1,
  },

  numOfReviews: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
      },
      name: {
        type: String,
        required: true,
      },

      rating: {
        type: Number,
        required: true,
      },

      comment: {
        type: String,
        required: true,
      },
    },
  ],
    
  user:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required:true
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;