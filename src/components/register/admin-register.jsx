import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [admin, setadmin] = useState(false); // Track admin status
    const [errors, setErrors] = useState({ name: "", email: "", password: "" });

    const validateName = (value) => (!value ? "Name is required." : "");
    const validateEmail = (value) => (!value ? "Email is required." : !/^\S+@\S+\.\S+$/.test(value) && "Invalid email address.");
    const validatePassword = (value) => {
        if (!value) {
            return "Password is required.";
        }

        if (value.length < 8) {
            return "Password must be at least 8 characters long.";
        }

        if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/\d/.test(value)) {
            return "Password must include at least one uppercase letter, one lowercase letter, and one digit.";
        }

        return "";
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        setErrors({ ...errors, name: validateName(value) });
    };

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

    const handleAdminChange = (e) => {
        setadmin(e.target.checked);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const nameError = validateName(name);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        setErrors({ name: nameError, email: emailError, password: passwordError });

        if (!nameError && !emailError && !passwordError) {
            axios
                .post("http://localhost:3001/register/admin", { name, email, password, admin })
                .then((response) => {
                    console.log("Form submitted successfully, Admin user registered successfully");
                    window.location.href = "/login";
                })
                .catch((error) => {
                    console.error("Error submitting form:", error);
                });
        }
    };

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
                            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Sign up</h3>
                            <p className="">Already have an account? <Link to="/login" className="font-bold text-zinc-600 hover:text-zinc-500">Log in</Link></p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="font-medium">Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={handleNameChange}
                                className={`w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-zinc-600 shadow-sm rounded-lg ${errors.name && "border-red-500"
                                    }`}
                            />
                            {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                        </div>
                        <div>
                            <label className="font-medium">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={handleEmailChange}
                                className={`w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus-border-zinc-600 shadow-sm rounded-lg ${errors.email && "border-red-500"
                                    }`}
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
                                className={`w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus-border-zinc-600 shadow-sm rounded-lg ${errors.password && "border-red-500"
                                    }`}
                            />
                            {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
                        </div>
                        <div>
                            <label className="font-medium">
                                Admin
                                <input type="checkbox" checked={admin} onChange={handleAdminChange} className="ml-2" />
                            </label>
                        </div>
                        <button className="w-full px-4 py-2 text-white font-medium bg-zinc-600 hover:bg-zinc-500 active-bg-zinc-600 rounded-lg duration-150">
                            Create Admin Account
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Register;