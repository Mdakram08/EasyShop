import React, { useEffect } from "react";
import "./AdminProducts.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { allAdminProducts, deleteProduct, removeError } from "../features/adminSlice";
import Navbar from "../components/Navbar.jsx";
import Loader from "../components/Loader.jsx";
import Footer from "../components/Footer.jsx";
import { FaTrash, FaEdit } from "react-icons/fa";
import PageTitle from "../components/pageTitle.jsx";
import { toast } from "react-toastify";

function AdminProducts() {
    const { products, loading, error } = useSelector((state) => state.admin);
    const { user, loading: userLoading, isAuthenticated } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    useEffect(() => {
        if (!userLoading && isAuthenticated && user?.role === "admin") {
            dispatch(allAdminProducts());
        }
    }, [dispatch, userLoading, isAuthenticated, user]);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "top-center",
                autoClose: 2000
            });
            dispatch(removeError());
        }
    }, [error, dispatch]);

    if (userLoading || loading) {
        return (
            <>
                <Navbar />
                <Loader />
                <Footer />
            </>
        );
    }

    if (!isAuthenticated || user?.role !== "admin") {
        return null;
    }

    const deleteProductHandle=(id)=>{
        const isComfirm=window.confirm("Are you sure you want to delete this product?");
        if(isComfirm){
            dispatch(deleteProduct(id)).then((action)=>{
                if(action.type==="admin/deleteproduct/fulfilled"){
                    toast.success("Product deleated Sucessfull !", {position: "top-center",autoClose: 2000});
                }
            })
        }
    }

    return (
        <>
            <Navbar />
            <PageTitle title="Admin-Products" />

            <div className="admin-products-page">
                <div className="admin-products-header">
                    <div>
                        <h1>All Products</h1>
                        <p>Manage all products</p>
                        <p>No of Products {products.length}</p>
                    </div>

                    <button className="create-product-btn" onClick={() => navigate("/admin/create/product")}>
                        + Create Product
                    </button>
                </div>

                <div className="products-table-container">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Sl No</th>
                                <th>Product Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Ratings</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.length > 0 ? (
                                products.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{index + 1}</td>

                                        <td>
                                            <img
                                                src={item.image?.[0]?.url}
                                                alt={item.name}
                                                className="admin-product-image"
                                            />
                                        </td>

                                        <td>{item.name}</td>

                                        <td>₹{item.price}</td>

                                        <td>{item.ratings}⭐</td>

                                        <td>{item.category}</td>

                                        <td>
                                            <span className="stock-low">
                                                {item.stock}
                                            </span>
                                        </td>

                                        <td>
                                            {new Date(item.createdAt).toLocaleString(
                                                "en-IN",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true
                                                }
                                            )}
                                        </td>

                                        <td>
                                            <div className="product-actions">
                                                <Link to={`/admin/products/${item._id}`}>
                                                    <button
                                                        className="edit-btn"
                                                        title="Edit Product"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                </Link>

                                                <button
                                                    className="delete-btn"
                                                    title="Delete Product"
                                                    onClick={()=>deleteProductHandle(item._id)}
                                                >
                                                    {loading?<Loader/>:<FaTrash />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9">
                                        No Products Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default AdminProducts;