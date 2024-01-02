import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      // Get the token from the URL params
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setVerificationStatus('Verification token is required');
        return;
      }

      try {
        // Make a request to the server to verify the email
        const response = await axios.get(`http://localhost:3001/verify-email?token=${token}`);

        // Set the verification status based on the response
        setVerificationStatus(response.data.message);

        // Optionally, you can redirect the user after successful verification
        if (response.status === 200) {
          window.location.href = '/home';
        }
      } catch (error) {
       
        console.error('Error verifying email:', error.message, error.response);
        setVerificationStatus('EMAIL VERIFIED. PLEASE LOGIN AGAIN ');
      }
    };

    // Call the verifyEmail function when the component mounts
    verifyEmail();
  }, []);

  return (
    <div>
      {verificationStatus === 'Email verified successfully' ? (
        <p>Email verified successfully</p>
      ) : (
        <div>
          <p>{verificationStatus}</p>
          <p>
            Click <Link to="/login"><u>here</u></Link> to go to the login page.
          </p>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
