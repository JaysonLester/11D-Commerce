import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateEmail = (value) => (!value ? "Email is required." : !/^\S+@\S+\.\S+$/.test(value) && "Invalid email address.");
  const validatePassword = (value) => (!value ? "Password is required." : "");

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors({ ...errors, email: validateEmail(value) });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors({ ...errors, password: validatePassword(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({ email: emailError, password: passwordError });

    if (!emailError && !passwordError) {
      try {
        const response = await axios.post("http://localhost:3001/login", {
          email,
          password,
        });

        if (response.data.token) {
          console.log("Login successful");
          console.log("Token:", response.data.token);
          console.log("User details:", response.data.user);

          // Verify the token
          const decodedToken = jwtDecode(response.data.token);

          if (decodedToken.exp * 1000 < Date.now()) {
            console.log("Token is expired");
            // Handle expired token, e.g., redirect to login or show an error message
          } else {
            console.log("Token is valid");

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user_id", response.data.user.id);
            localStorage.setItem('name', response.data.user.name);
            localStorage.setItem('email', response.data.user.email);
            localStorage.setItem('isAdmin', response.data.user.isAdmin);
            window.location.href = response.data.redirectTo || "/home";
          }
        } else {
          console.error("Error logging in:", "Token not present in the response");
        }
      } catch (error) {
        console.error("Error logging in:", error);
      }
    }
  };


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/home";
    }
  }, []);


  return (
    <main className="w-full flex">
      <div className="relative flex-1 hidden items-center justify-center h-screen bg-gray-900 lg:flex">
        <div className="relative z-10 w-full max-w-md">
          <img src="https://i.postimg.cc/3kpY5HVx/icon.png" width={150} />
          <div className=" mt-16 space-y-3">
            <h3 className="text-white text-5xl font-bold">THE OUTFITS YOU'RE LOOKING FOR</h3>
            <p className="text-white text-2xl font-base">
              Elevate your style, own your vibe—define your identity with flair from our timeless selections.
            </p>
          </div>
        </div>
        <div
          className="absolute inset-0 my-auto h-[850px]"
          style={{
            background: "url('https://images.unsplash.com/photo-1627577279497-4b24bf1021b6?q=80&w=1649&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') center/cover",
            filter: "none",
            backgroundSize: "cover",
          }}
        ></div>
      </div>
      <div className="flex-1 flex items-center justify-center h-screen">
        <div className="w-full max-w-md space-y-8 px-4 bg-white text-gray-600 sm:px-0">
          <div className="">
            <img src="https://i.postimg.cc/3kpY5HVx/icon.png" width={60} className="lg:hidden" />
            <div className="mt-5 space-y-2">
              <h3 className="text-gray-800 text-2xl font-bold sm:text-5xl">Sign in</h3>
              <p className="">Don't have an account? <Link to="/register" className="font-bold text-zinc-600 hover:text-zinc-500">Register</Link></p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-medium">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={handleEmailChange}
                className={`w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-sky-600 shadow-sm rounded-lg ${errors.email && "border-red-500"}`}
              />
              {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
            </div>
            <div>
              <label className="font-medium">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={handlePasswordChange}
                className={`w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus-border-zinc-600 shadow-sm rounded-lg ${errors.password && "border-red-500"}`}
              />
              {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
            </div>
            <button className="w-full px-4 py-2 text-white font-medium bg-zinc-600 hover:bg-zinc-500 active-bg-zinc-600 rounded-lg duration-150">
              Login
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Login;