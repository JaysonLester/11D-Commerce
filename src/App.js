import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login/login";
import Register from "./components/register/register";

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element="{}"></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
