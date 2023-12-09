import { useState, useEffect } from 'react';
import Nav from '../navigation-bar/nav';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import _debounce from 'lodash/debounce';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function ChangePassword() {
  const tokenEncoded = localStorage.getItem('token');
  const token = tokenEncoded ? atob(tokenEncoded) : '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isFormModified, setFormModified] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [initialUserProfile, setInitialUserProfile] = useState({});
  const [fetchedPassword, setFetchedPassword] = useState('');
  const [isOldPasswordCorrect, setIsOldPasswordCorrect] = useState(false);
  const [showNoChangesMessage, setShowNoChangesMessage] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = token ? atob(token) : '';

        const response = await axios.get('http://localhost:3001/api/user-profile', {
          headers: {
            Authorization: decodedToken,
          },
        });

        const userProfile = response.data;
        setInitialUserProfile(userProfile);
        setFetchedPassword(userProfile.password || '');


      } catch (error) {
        console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
      }
    };

    fetchUserProfile();
  }, []);

  const setOldPasswordWithValidation = async (value) => {
    setOldPassword(value);
    setFormModified(true);
  };

  const validateOldPassword = async () => {
    if (oldPassword.trim() === '') {
      setIsOldPasswordCorrect(false); // Set an error state
      return;
    }

    try {
      const isCorrect = await bcrypt.compare(oldPassword, fetchedPassword);
      setIsOldPasswordCorrect(isCorrect);

      if (isCorrect) {
        setPasswordError('');
      } else {
        setPasswordError('Incorrect old password');
      }
    } catch (error) {
      console.error('Error comparing passwords:', error.message);
    }
  };

  const validateOldPasswordDebounced = _debounce(validateOldPassword, 500);

  useEffect(() => {
    validateOldPasswordDebounced();
    return () => {
      validateOldPasswordDebounced.cancel();
    };
  }, [oldPassword, fetchedPassword]);

  const setPasswordWithValidation = (value) => {
    if (value.trim() === '') {
      setPasswordError('Password cannot be empty');
    } else if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
    } else if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/\d/.test(value)) {
      setPasswordError('Password must include at least one uppercase letter, one lowercase letter, and one digit.');
    } else {
      setPasswordError('');
    }
    setNewPassword(value);
    setFormModified(true);
  };

  const setConfirmPasswordWithValidation = (value) => {
    if (value.trim() === '') {
      setConfirmPasswordError('Confirm Password cannot be empty');
    } else if (value !== newPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
    setConfirmNewPassword(value);
    setFormModified(true);
  };

  const isFormValid = () => {
    return !passwordError && !confirmPasswordError;
  };

  useEffect(() => {
    if (showNoChangesMessage) {
      alert('No changes have been made.');
      setShowNoChangesMessage(false);
    }
  }, [showNoChangesMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormModified || !isFormValid()) {
      setShowNoChangesMessage(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const decodedToken = token ? atob(token) : '';

      const updatedFields = {
        name: initialUserProfile.name,
        newPassword,
        confirmPassword: confirmNewPassword,
      };

      const response = await axios.post(
        'http://localhost:3001/api/update-password',
        updatedFields,
        {
          headers: {
            Authorization: decodedToken,
          },
        }
      );
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error.response ? error.response.data : error.message);
    }
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  if (!token) {
    return (
      <>
        <div>
          <Nav />
          <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
              <p className="text-base font-semibold text-zinc-600">404</p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
              <p className="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn’t find the page you’re looking for.</p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="#"
                  onClick={handleLogin}
                  className="rounded-md bg-zinc-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
                >
                  Login
                </a>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }


  return (
    <div>
      <Nav />
      <div className="bg-white p-4 sm:p-8 md:p-16 lg:p-24 xl:p-32 my-1 mx-auto max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="pb-8 sm:pb-12">
            <h2 className="text-lg font-semibold text-gray-900">Security</h2>
            <p className="mt-1 text-sm text-gray-600">Update your password</p>
  
            {/* Old Password */}
            <div className="mt-4 sm:mt-6 relative">
              <label htmlFor="old-password" className="block text-sm font-semibold text-gray-900">
                Old Password
              </label>
              <div className="mt-2 relative">
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  name="old-password"
                  id="old-password"
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-2.5 px-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setOldPasswordWithValidation(e.target.value)}
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  <FontAwesomeIcon icon={showOldPassword ? faEye : faEyeSlash} />
                </div>
              </div>
              {isOldPasswordCorrect || oldPassword.trim() === '' ? null : (
                <p className="mt-2 text-sm text-red-500">Incorrect old password</p>
              )}
            </div>
  
            {/* New Password */}
            <div className={`mt-4 sm:mt-6 ${isOldPasswordCorrect ? '' : 'hidden'}`}>
              <label htmlFor="new-password" className="block text-sm font-semibold text-gray-900">
                New Password
              </label>
              <div className="mt-2 relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="new-password"
                  id="new-password"
                  autoComplete="new-password"
                  className={`block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6 ${passwordError && 'border-red-500'}`}
                  onChange={(e) => setPasswordWithValidation(e.target.value)}
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  <FontAwesomeIcon icon={showNewPassword ? faEye : faEyeSlash} />
                </div>
              </div>
              {passwordError && (
                <p className="mt-2 text-sm text-red-500">{passwordError}</p>
              )}
            </div>
  
            {/* Confirm Password */}
            <div className={`mt-4 sm:mt-6 ${isOldPasswordCorrect ? '' : 'hidden'}`}>
              <label htmlFor="confirm-new-password" className="block text-sm font-semibold text-gray-900">
                Confirm New Password
              </label>
              <div className="mt-2 relative">
                <input
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  name="confirm-new-password"
                  id="confirm-new-password"
                  autoComplete="new-password"
                  className={`block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6 ${confirmPasswordError && 'border-red-500'}`}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmPasswordWithValidation(e.target.value)}
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                >
                  <FontAwesomeIcon icon={showConfirmNewPassword ? faEye : faEyeSlash} />
                </div>
              </div>
              {confirmPasswordError && (
                <p className="mt-2 text-sm text-red-500">{confirmPasswordError}</p>
              )}
            </div>
  
          </div>
  
          {/* Save Button */}
          <div className="mt-2 sm:mt-4 flex justify-end"> 
            <button
              type="submit"
              className="rounded-md bg-zinc-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
}  