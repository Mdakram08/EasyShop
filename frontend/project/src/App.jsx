import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import UpdateProfile from "./pages/UpdateProfile";
import UpdatePassword from "./pages/UpdatePassword";
import ForgotPassword from "./pages/ForgotPassword";
import PassReset from "./pages/PassReset";
import Cart from "./pages/Cart";
import Shipping from "./pages/Shipping";
import OrderConfirm from "./pages/OrderConfirm";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import Dashboard from "./admin/Dashboard";
import AdminProducts from "./admin/AdminProducts";
import CreateProducts from "./admin/CreateProducts";
import UpdateProducts from "./admin/UpdateProducts";
import AdminUsers from "./admin/AdminUsers";
import UpdateUserRole from "./admin/UpdateUserRole";
import AdminOrders from "./admin/AdminOrders";
import UpdateOrderStatus from "./admin/UpdateOrderStatus";
import Reviews from "./admin/Reviews";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/products/:keyword" element={<Products />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/profile/update" element={<UpdateProfile />} />
        <Route path="/user/change/password" element={<UpdatePassword/>} />
        <Route path="/user/forgot/password" element={<ForgotPassword/>} />
        <Route path="/reset/:token" element={<PassReset/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/shipping" element={<Shipping/>} />
        <Route path="/order/confirm" element={<OrderConfirm/>} />
        <Route path="/payment" element={<Payment/>} />
        <Route path="/api/payment/success" element={<PaymentSuccess/>}/>
        <Route path="/user/orders" element={<MyOrders/>}/>
        <Route path="/user/orders/:orderId" element={<OrderDetails/>}/>
        <Route path="/admin/dashboard" element={<Dashboard/>}/>
        <Route path="/admin/products" element={<AdminProducts/>}/>
        <Route path="/admin/products" element={<AdminProducts/>}/>
        <Route path="/admin/create/product" element={<CreateProducts/>}/>
        <Route path="/admin/products/:id" element={<UpdateProducts/>}/>
        <Route path="/admin/users" element={<AdminUsers/>}/>
        <Route path="/admin/users/:id" element={<UpdateUserRole/>}/>
        <Route path="/admin/orders" element={<AdminOrders/>}/>
        <Route path="/admin/orders/:id" element={<UpdateOrderStatus/>}/>
        <Route path="/admin/reviews" element={<Reviews/>}/>

      </Routes>
    </Router>
  );
}

export default App;