import Product from "../modules/Product.js";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import APIFeatures from "../utils/apiFuncnality.js";
import {v2 as cloudinary} from "cloudinary";

// Create Product
export const createProduct = wrapAsync(async (req, res) => {
  let image=[];
  if(typeof req.body.image==='string'){
    image.push(req.body.image)
  }else{
    image=req.body.image
  }
  const imageLinks=[];
  for(let i=0;i<image.length;i++){
    const result=await cloudinary.uploader.upload(image[i],{
      folder:"products"
    })
    imageLinks.push({
      public_id:result.public_id,
      url:result.secure_url
    })
  }
  req.body.image=imageLinks;

  req.body.user=req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// Get All Products
export const getAllProducts =wrapAsync(async (req, res,next) => {
    const apiFeatures = new APIFeatures(
        Product.find(),
        req.query
    )
    .search().filter();
    const products = await apiFeatures.query;
    if(products.length === 0){
      return next(new ExpressError("No products listed ",404))
    }
    res.status(200).json({
        success: true,
        products
    });
});

// Get Single Product
export const getSingleProduct = wrapAsync(async (req, res,next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ExpressError("No product Found",401));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// creating new reviews for product
export const createReviewforProduct = wrapAsync(async (req, res, next) => {

  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
     name: req.user.userName,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ExpressError("Product not found!", 404));
  }
  // Check if user already reviewed
  const reviewExist = product.reviews.find(
    (review) =>
      review.user &&
      review.user.toString() === req.user._id.toString()
  );
  if (reviewExist) {
    // Update existing review
    product.reviews.forEach((review) => {
      if (
        review.user &&
        review.user.toString() === req.user._id.toString()
      ) {
        review.rating = Number(rating);
        review.comment = comment;
        review.name = req.user.userName;
      }
    });
  } else {
    // Add new review
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  // Calculate average rating
  let sum = 0;
  product.reviews.forEach((review) => {
    sum += review.rating;
  });
  product.ratings =
    product.reviews.length > 0
      ? sum / product.reviews.length
      : 0;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    product,
  });
});

//get Reviews from single Product
export const getProductReviews=wrapAsync(async(req,res,next)=>{
  const product=await Product.findById(req.query.id);
  if(!product){
    return next(new ExpressError("Product not found",400));
  }
  const productReview=await product.reviews
  res.status(200).json({
    sucess:true,
    productReview
  })
})

//delete review
export const deleteProductReview = wrapAsync(async (req, res, next) => {

    const { id, reviewId } = req.query;

    console.log("Product ID:", id);
    console.log("Review ID:", reviewId);

    if (!id || !reviewId) {
        return next(
            new ExpressError("Product ID and Review ID are required", 400)
        );
    }

    const product = await Product.findById(id);

    if (!product) {
        return next(new ExpressError("Product not found", 404));
    }

    console.log("Reviews:", product.reviews);

    const reviews = product.reviews.filter(
        review => review._id && review._id.toString() !== reviewId
    );

    const numOfReviews = reviews.length;

    let sum = 0;

    reviews.forEach(review => {
        sum += review.rating;
    });

    const ratings = numOfReviews > 0
        ? sum / numOfReviews
        : 0;

    await Product.findByIdAndUpdate(
        id,
        {
            reviews,
            numOfReviews,
            ratings
        },
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        success: true,
        message: "Review Deleted Successfully"
    });
});


// Update Product
export const updateProduct = wrapAsync(async (req, res, next) => {
  // Find the product using the ID received from the URL.
  let product = await Product.findById(req.params.id);
  // Check whether the product exists in the database.
  if (!product) {
    // If the product does not exist, pass an error to the error-handling middleware.
    return next(new ExpressError("Product not found", 404));
  }
  // Handle the product images received from the frontend.
  let images = [];
  // Check if only one image was received as a string.
  // If it is a string, push that image into the images array.
  if (typeof req.body.image === "string") {
    images.push(req.body.image);
  // Check if multiple images were received as an array.
  } else if (Array.isArray(req.body.image)) {
    // If it is already an array, directly assign it to images.
    images = req.body.image;
  }
  // Check whether new images were actually provided.
  if (images.length > 0) {
    // Traverse through all the old images stored in the product.
    // Delete each old image from Cloudinary using its public_id.
    for (let i = 0; i < product.image.length; i++) {
      await cloudinary.uploader.destroy(
        product.image[i].public_id
      );
    }
    // Create an empty array to store the details
    // of the newly uploaded images.
    const imageLinks = [];
    // Loop through every new image received from the frontend.
    for (let i = 0; i < images.length; i++) {
      // Upload the current image to Cloudinary.
      // images[i] represents the current image.
      // await waits until Cloudinary finishes uploading it.
      const result = await cloudinary.uploader.upload(images[i], {
        // Store the uploaded image inside the "products" folder.
        folder: "products"
      });
      // Add the Cloudinary image details to imageLinks.
      imageLinks.push({
        // public_id is the unique ID given to the image by Cloudinary.
        // It is required later if we want to delete the image.
        public_id: result.public_id,
        // secure_url is the HTTPS URL of the uploaded image.
        // This URL is used to display the image on the website.
        url: result.secure_url
      });
    }
    // Replace the old image information in the request
    // with the newly uploaded Cloudinary image information.
    req.body.image = imageLinks;
  }

  product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product
export const deleteProduct = wrapAsync(async (req, res,next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ExpressError("Product not found", 404));
  }
  //delete Image
  for(let i=0;i<product.image.length;i++){
    await cloudinary.uploader.destroy(product.image[0].public_id)
  }
  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message:"Product Deleated Successfully!",
    product
  });
});

//get admin product
export const getAdminproducts=wrapAsync(async(req,res,next)=>{
  const product=await Product.find();
    if(product.length === 0){
      return next(new ExpressError("No products listed here",404))
    }
  res.status(200).json({
    sucess:true,
    product
  })
})

//get admin single product
export const getAdminSingleProduct=wrapAsync(async(req,res,next)=>{
  const product=await Product.findById(req.params.id);
    if(!product){
      return next(new ExpressError("No products",404))
    }
  res.status(200).json({
    sucess:true,
    product
  })
})
