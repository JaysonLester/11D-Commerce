import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

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

        console.log("Login successful");
        console.log("Response data:", response.data);

        localStorage.setItem("token", response.data.token);

        window.location.href = response.data.redirectTo || "";
      } catch (error) {
        console.error("Error logging in:", error);
      }
    }
  };

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     // Redirect to another page if the user is logged in
  //     window.location.href = "/home";
  //   }
  // }, []);


  return (
    <main className="w-full flex">
      <div className="relative flex-1 hidden items-center justify-center h-screen bg-gray-900 lg:flex">
        <div className="relative z-10 w-full max-w-md">
          <img src="https://floatui.com/logo-dark.svg" width={150} />
          <div className=" mt-16 space-y-3">
            <h3 className="text-white text-3xl font-bold">THE OUTFITS YOU'RE LOOKING FOR</h3>
            <p className="text-gray-300">
              Create an account and get access to all features for 30-days, No credit card required.
            </p>
          </div>
        </div>
        <div
          className="absolute inset-0 my-auto h-[500px]"
          style={{
            background: "linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.26) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)", filter: "blur(118px)"
          }}
        >

        </div>
      </div>
      <div className="flex-1 flex items-center justify-center h-screen">
        <div className="w-full max-w-md space-y-8 px-4 bg-white text-gray-600 sm:px-0">
          <div className="">
            <img src="https://floatui.com/logo.svg" width={150} className="lg:hidden" />
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