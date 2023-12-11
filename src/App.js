import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login/login";
import AdminRegister from "./components/register/admin-register";
import Register from "./components/register/register";
import ProductsPage from "./components/product-catalog/productsPage";
import Inventory from "./components/inventory/inventory";
import NotFound from "./components/notfound/notfound.jsx"
import Profile from "./components/profile/profile.jsx"
import UsersList from "./components/users-list/userslist.jsx";
import ChangePassword from "./components/change-password/changePassword.jsx";
import Cart from "./components/add-to-cart/Cart.jsx";
import Orders from "./components/orders/ordersPage.jsx"; 
import GenerateReportModal from "./components/orders/generateReport.jsx";
function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductsPage />}></Route>
          <Route path="/home" element={<ProductsPage />}></Route>
          <Route path="/admin-register" element={<AdminRegister />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/inventory" element={<Inventory />}></Route>
          <Route path="/users-list" element={<UsersList />}></Route>
          <Route path="/user-profile" element={<Profile />}></Route>
          <Route path="/change-password" element={<ChangePassword/>}></Route>
          <Route path="/cart" element={<Cart/>}></Route>
          <Route path="/orders" element={<Orders/>}></Route>
          <Route path="/*" element={<NotFound />}></Route>
          <Route path="/generate-report" element={<GenerateReportModal/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
