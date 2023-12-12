import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [admin, setadmin] = useState(false); // Track admin status
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateName = (value) => (
        !value ? "Name is required." : /^[a-zA-Z0-9_-]{3,16}$/.test(value) ? "" : "Invalid name format. It must contain 3 to 16 characters, including letters, numbers, underscores, and hyphens."
    );
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

    const validateConfirmPassword = (value) => {
        if (!value) {
            return "Confirm Password is required.";
        }

        if (value !== password) {
            return "Passwords do not match.";
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

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setErrors({ ...errors, confirmPassword: validateConfirmPassword(value) });
    };

    const handleAdminChange = (e) => {
        setadmin(e.target.checked);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const nameError = validateName(name);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const confirmPasswordError = validateConfirmPassword(confirmPassword);

        setErrors({
            name: nameError,
            email: emailError,
            password: passwordError,
            confirmPassword: confirmPasswordError,
        });

        if (!nameError && !emailError && !passwordError && !confirmPasswordError) {
            axios
                .post("http://localhost:3001/register/admin", { name, email, password, confirmPassword, admin })
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
                    <img src="https://i.postimg.cc/3kpY5HVx/icon.png" width={150} />
                    <div className=" mt-16 space-y-3">
                        <h3 className="text-white text-5xl font-bold">THE OUTFITS YOU'RE LOOKING FOR</h3>
                        <p className="text-white text-2xl font-base">
                            Elevate your style, own your vibe—define your identity with flair from our timeless selections.
                        </p>
                    </div>
                </div>
                <div
                    className="absolute inset-0 my-auto h-auto"
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
                            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Sign up</h3>
                            <p className="">Already have an account? <Link to="/login" className="font-bold text-zinc-600 hover:text-zinc-500">Log in</Link></p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <TextField
                                label="Name"
                                type="text"
                                required
                                value={name}
                                onChange={handleNameChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                variant="outlined"
                                fullWidth
                                sx={{ mt: 2 }}
                            />
                        </div>

                        <div>
                            <TextField
                                label="Email"
                                type="email"
                                required
                                value={email}
                                onChange={handleEmailChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                variant="outlined"
                                fullWidth
                                sx={{ mt: 2 }}
                            />
                        </div>

                        <div>
                            <TextField
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={handlePasswordChange}
                                error={!!errors.password}
                                helperText={errors.password}
                                variant="outlined"
                                fullWidth
                                sx={{ mt: 2 }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>

                        <div>
                            <TextField
                                label="Confirm Password"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                variant="outlined"
                                fullWidth
                                sx={{ mt: 2 }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>

                        <div>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={admin}
                                        onChange={handleAdminChange}
                                    />
                                }
                                label="Admin"
                            />
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

