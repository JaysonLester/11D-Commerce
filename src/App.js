import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login/login";
import Register from "./components/register/register";
import ProductsPage from "./components/product-catalog/productsPage";
import Inventory from "./components/inventory/inventory";

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductsPage />}></Route>
          <Route path="/home" element={<ProductsPage />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/inventory" element={<Inventory />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
