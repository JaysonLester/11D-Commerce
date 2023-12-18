import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOtp = async () => {
    try {
      // Send email to receive OTP
      const response = await axios.post('http://localhost:3001/forgot-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage('Error sending OTP. Please try again.');
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
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage('Error verifying OTP. Please try again.');
    }
  };

  return (
    <div className="container mx-auto mt-8 max-w-md">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="w-full border p-2 rounded"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <button
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={handleSendOtp}
          >
            Send OTP
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
            OTP:
          </label>
          <input
            type="text"
            id="otp"
            className="w-full border p-2 rounded"
            placeholder="Enter the OTP sent to your email"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
            New Password:
          </label>
          <input
            type="password"
            id="newPassword"
            className="w-full border p-2 rounded"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full border p-2 rounded"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <button
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            onClick={handleVerifyOtp}
          >
            Verify OTP and Update Password
          </button>
        </div>

        {message && <p className="text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
