import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [touched, setTouched] = useState({
    email: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleSendOtp = async () => {
    try {
      // Send email to receive OTP
      const response = await axios.post('http://localhost:3001/forgot-password', { email });
      setMessage({ text: response.data.message, isError: false });
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage({ text: 'Error sending OTP. Please try again.', isError: true });
    }
  };


  const handleVerifyOtp = async () => {
    try {
      // Verify OTP and update password
      const response = await axios.post('http://localhost:3001/verify-otp', {
        email,
        otp,
        newPassword,
        confirmPassword,
      });
      setMessage({ text: response.data.message, isError: false });

      // Redirect to /login after 3 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage({ text: 'Invalid OTP. Please try again.', isError: true });
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
          </div>

          <div style={{ maxWidth: 400, margin: 'auto' }}>
            <div className="mt-5 space-y-2 text-center">
              <h3 className="text-gray-800 text-2xl font-bold sm:text-5xl">Forgot Password</h3>
              <p className="">Back to  <Link to="/login" className="font-bold text-zinc-600 hover:text-zinc-500">Login</Link></p>
            </div>
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setTouched({ ...touched, email: true });
              }}
              error={touched.email && !email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)}
              helperText={touched.email && !email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/) ? 'Invalid email address' : ''}
            />

            <Button
              fullWidth
              variant="contained"
              style={{ marginTop: 3, backgroundColor: 'red', color: 'white' }}
              onClick={handleSendOtp}
            >
              Send OTP
            </Button>

            <TextField
              fullWidth
              label="OTP"
              type="text"
              variant="outlined"
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <TextField
              fullWidth
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setTouched({ ...touched, newPassword: true });
              }}
              error={touched.newPassword && (newPassword.length < 8 || newPassword.length > 64 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/.test(newPassword))}
              helperText={
                touched.newPassword &&
                (newPassword.length < 8
                  ? 'Password should be at least 8 characters'
                  : newPassword.length > 64
                    ? 'Password should not exceed 64 characters'
                    : !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/.test(newPassword)
                      ? 'Password must include at least one uppercase letter, one lowercase letter, and one digit.'
                      : '')
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setTouched({ ...touched, confirmPassword: true });
              }}
              error={touched.confirmPassword && confirmPassword !== newPassword}
              helperText={touched.confirmPassword && confirmPassword !== newPassword ? 'Passwords do not match' : ''}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              style={{ marginTop: 16, backgroundColor: 'black', color: 'white' }}
              onClick={handleVerifyOtp}
            >
              Verify OTP and Update Password
            </Button>

            {message.text && (
              <Typography
                variant="body2"
                color={message.isError ? 'error' : '#339989'}
                style={{
                  marginTop: 16,
                  backgroundColor: message.isError ? '#ffcccc' : '#ccffcc',
                  padding: '10px',
                  borderRadius: '5px'
                }}
                align='center'
              >
                {message.text}
              </Typography>
            )}
          </div>
        </div>
      </div>

    </main>
  );
};

export default ForgotPassword;
