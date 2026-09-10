import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Product from "../components/Product";
import "../pagesStyling/Products.css";
import PageTitle from "../components/pageTitle";
import { useSelector, useDispatch } from "react-redux";
import { getProduct, removeError } from "../features/productSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import Noproducts from "../components/Noproducts";

const categories = [
  "All",
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

const Products = () => {
  const { error, products, loading, productCount } = useSelector(
    (state) => state.product
  );

  const dispatch = useDispatch();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword");

  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    dispatch(getProduct({ keyword }));
  }, [dispatch, keyword]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 2000,
      });
      dispatch(removeError());
    }
  }, [dispatch, error]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (item) =>
            item.category.toLowerCase() ===
            selectedCategory.toLowerCase()
        );

  return (
    <>
      <PageTitle title="All Products" />
      <Navbar />

      <div className="products-page">

        <aside className="sidebar">

          <h2><b>Categories</b></h2>

          <ul>
            {categories.map((category) => (
              <li
                key={category}
                className={
                  selectedCategory === category ? "active" : ""
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </li>
            ))}
          </ul>

        </aside>

        <section className="products-content">

          <div className="products-header">

            <h2>
              {selectedCategory === "All"
                ? "All Products"
                : selectedCategory}
            </h2>

            <span>{filteredProducts.length} Products</span>

          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <Noproducts />
          )}

        </section>

      </div>

      <Footer />
    </>
  );
};

export default Products;