import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Nav from '../navigation-bar/nav';
import axios from 'axios';
import cities from './cities/cities';
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, OutlinedInput, Grid } from '@mui/material';

export default function Profile() {
  const tokenEncoded = localStorage.getItem('token');
  const token = tokenEncoded ? atob(tokenEncoded) : '';
  const [isFormModified, setFormModified] = useState(false);
  const [initialUserProfile, setInitialUserProfile] = useState({});
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [cityError, setCityError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [streetAddressError, setStreetAddressError] = useState('');
  const [houseNumberError, setHouseNumberError] = useState('');
  const [provinceError, setProvinceError] = useState('');
  const [postalCodeError, setPostalCodeError] = useState('');

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
        setUsername(userProfile.name || '');
        setFirstName(userProfile.firstName || '');
        setLastName(userProfile.lastName || '');
        setEmail(userProfile.email || '');
        setPhone(userProfile.phone_number || '');
        setDob(formatDate(userProfile.date_of_birth) || '');
        setStreetAddress(userProfile.street || '');
        setHouseNumber(userProfile.house_number || '');
        setCity(userProfile.city || '');
        setProvince(userProfile.province || '');
        setPostalCode(userProfile.zip_code || '');
        setCountry(userProfile.country || '');

        // Validate the form
        setUsernameWithValidation(userProfile.name || '');
        setFirstNameWithValidation(userProfile.firstName || '');
        setLastNameWithValidation(userProfile.lastName || '');
        setPhoneWithValidation(userProfile.phone_number || '');
        setCityWithValidation(userProfile.city || '');
        setHouseNumberWithValidation(userProfile.house_number || '');
        setStreetAddressWithValidation(userProfile.street || '');
        setProvinceWithValidation(userProfile.province || '');
        setPostalCodeWithValidation(userProfile.zip_code || '');

      } catch (error) {
        console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
      }
    };

    fetchUserProfile();
  }, []);

  const resetForm = () => {
    setUsername(initialUserProfile.name || '');
    setFirstName(initialUserProfile.firstName || '');
    setLastName(initialUserProfile.lastName || '');
    setEmail(initialUserProfile.email || '');
    setPhone(initialUserProfile.phone_number || '');
    setDob(formatDate(initialUserProfile.date_of_birth) || '');
    setStreetAddress(initialUserProfile.street || '');
    setHouseNumber(initialUserProfile.house_number || '');
    setCity(initialUserProfile.city || '');
    setProvince(initialUserProfile.province || '');
    setPostalCode(initialUserProfile.zip_code || '');
    setCountry(initialUserProfile.country || '');

    // Reset validation errors
    setUsernameError('');
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPhoneError('');
    setCityError('');
    setStreetAddressError('');
    setHouseNumberError('');
    setProvinceError('');
    setPostalCodeError('');
  };

  const setUsernameWithValidation = (value) => {
    if (value.trim() === '') {
      setUsernameError('Username cannot be empty');
    } else if (!/^[a-zA-Z0-9_-]{3,16}$/.test(value)) {
      setUsernameError('Invalid username. Use only letters, numbers, hyphens, and underscores (3-16 characters)');
    } else {
      setUsernameError('');
    }
    setUsername(value);
    setFormModified(true);
  };

  const setFirstNameWithValidation = (value) => {
    if (value.trim() === '') {
      setFirstNameError('First name cannot be empty');
    } else if (!/^[a-zA-Z ]+$/.test(value)) {
      setFirstNameError('Invalid characters. Use only letters for the first name');
    } else {
      setFirstNameError('');
    }
    setFirstName(value);
    setFormModified(true);
  };

  const setLastNameWithValidation = (value) => {
    if (value.trim() === '') {
      setLastNameError('Last name cannot be empty');
    } else if (!/^[a-zA-Z ]+$/.test(value)) {
      setLastNameError('Invalid characters. Use only letters for the last name');
    } else {
      setLastNameError('');
    }
    setLastName(value);
    setFormModified(true);
  };

  const setPhoneWithValidation = (value) => {
    if (value.trim() === '') {
      setPhoneError('Phone number cannot be empty');
    } else if (!/^\d{11}$/g.test(value)) {
      setPhoneError('Invalid phone number. Please enter an 11-digit number.');
    } else {
      setPhoneError('');
    }
    setPhone(value);
    setFormModified(true);
  };

  const setCityWithValidation = (value) => {
    if (!value) {
      setCityError('Please select a city');
    } else {
      setCityError('');
    }
    setCity(value);
    setFormModified(true);
  };

  const setHouseNumberWithValidation = (value) => {
    if (value.trim() === '') {
      setHouseNumberError('House number cannot be empty');
    } else {
      setHouseNumberError('');
    }
    setHouseNumber(value);
    setFormModified(true);
  };

  const setStreetAddressWithValidation = (value) => {
    if (value.trim() === '') {
      setStreetAddressError('Street address cannot be empty');
    } else {
      setStreetAddressError('');
    }
    setStreetAddress(value);
    setFormModified(true);
  };

  const setProvinceWithValidation = (value) => {
    if (value.trim() === '') {
      setProvinceError('Province cannot be empty');
    } else {
      setProvinceError('');
    }
    setProvince(value);
    setFormModified(true);
  };

  const setPostalCodeWithValidation = (value) => {
    if (value.trim() === '') {
      setPostalCodeError('Postal code cannot be empty');
    } else {
      setPostalCodeError('');
    }
    setPostalCode(value);
    setFormModified(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const checkFormModified = () => {
    const userProfile = initialUserProfile;

    return (
      username !== userProfile.name ||
      firstName !== userProfile.firstName ||
      lastName !== userProfile.lastName ||
      email !== userProfile.email ||
      phone !== userProfile.phone_number ||
      dob !== formatDate(userProfile.date_of_birth) ||
      streetAddress !== userProfile.street ||
      houseNumber !== userProfile.house_number ||
      city !== userProfile.city ||
      province !== userProfile.province ||
      postalCode !== userProfile.zip_code ||
      country !== userProfile.country
    );
  };

  const isFormValid = () => {
    return (
      checkFormModified() &&
      !firstNameError &&
      !lastNameError &&
      !usernameError &&
      !emailError &&
      !phoneError &&
      !cityError &&
      !streetAddressError &&
      !houseNumberError &&
      !provinceError &&
      !postalCodeError
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormModified || !isFormValid()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const decodedToken = token ? atob(token) : '';

      const updatedFields = {
        name: username,
        email,
        phoneNumber: phone,
        houseNumber,
        street: streetAddress,
        city,
        province,
        zipCode: postalCode,
        country,
        firstName,
        lastName,
      };

      if (dob) {
        const dateParts = dob.split("-");
        const formattedDate = `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
        updatedFields.dateOfBirth = formattedDate;
      }

      const response = await axios.post(
        'http://localhost:3001/api/update-profile',
        updatedFields,
        {
          headers: {
            Authorization: decodedToken,
          },
        }
      );

      window.location.reload();

      console.log(response.data);
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
      <div className="bg-white">
      <div className="container mx-auto px-10 my-4 max-w-7xl">
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <h2 className="text-4xl font-bold leading-7 text-gray-900 mb-4">Your Profile</h2>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  id="username"
                  name="username"
                  autoComplete="username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsernameWithValidation(e.target.value)}
                  error={Boolean(usernameError)}
                  helperText={usernameError}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <label htmlFor="username" className="block text-sm font-semibold leading-6 text-gray-900">
                  Password
                </label>
                <p className="text-sm font-medium font-style: italic text-gray-600">
                  If you want to change password go <Link to="/change-password" className="font-bold text-zinc-600 hover:text-zinc-500">here</Link>.
                </p>
              </Grid>

              <Grid item xs={12}>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">Provide the needed information</p>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First name"
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  variant="outlined"
                  value={firstName}
                  onChange={(e) => setFirstNameWithValidation(e.target.value)}
                  error={Boolean(firstNameError)}
                  helperText={firstNameError}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last name"
                  type="text"
                  name="last-name"
                  id="last-name"
                  autoComplete="family-name"
                  variant="outlined"
                  value={lastName}
                  onChange={(e) => setLastNameWithValidation(e.target.value)}
                  error={Boolean(lastNameError)}
                  helperText={lastNameError}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email address"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  readOnly={true}
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={Boolean(emailError)}
                  helperText={emailError}
                />
                <p className="text-sm font-medium font-style: italic text-gray-600 mt-2">
                  Note: Please log out and log back in for the changes to take effect.
                </p>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone number"
                  type="text"
                  name="phone"
                  id="phone"
                  autoComplete="tel"
                  variant="outlined"
                  value={phone}
                  onChange={(e) => setPhoneWithValidation(e.target.value)}
                  error={Boolean(phoneError)}
                  helperText={phoneError}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of birth"
                  type="date"
                  name="dob"
                  id="dob"
                  autoComplete="bday"
                  variant="outlined"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
                <p className="text-sm font-medium italic text-gray-600 mt-2">
                  Note: If this is your initial attempt to modify your date of birth, please review it attentively, as it is currently configured with the default value, and it must be changed accordingly.
                </p>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="House number"
                  type="text"
                  name="house-number"
                  id="house-number"
                  autoComplete="house-number"
                  variant="outlined"
                  value={houseNumber}
                  onChange={(e) => setHouseNumberWithValidation(e.target.value)}
                  error={Boolean(houseNumberError)}
                  helperText={houseNumberError}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Street address"
                  type="text"
                  name="street-address"
                  id="street-address"
                  autoComplete="street-address"
                  variant="outlined"
                  value={streetAddress}
                  onChange={(e) => setStreetAddressWithValidation(e.target.value)}
                  error={Boolean(streetAddressError)}
                  helperText={streetAddressError}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="city-label">City</InputLabel>
                  <Select
                    labelId="city-label"
                    id="city"
                    name="city"
                    value={city}
                    onChange={(event) => setCityWithValidation(event.target.value)}
                    error={Boolean(cityError)}
                    helperText={cityError}
                    input={
                      <OutlinedInput label="City" notched={true} />
                    }
                  >
                    {cities.map((cityOption, index) => (
                      <MenuItem key={index} value={cityOption}>
                        {cityOption}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Province"
                  type="text"
                  name="region"
                  id="region"
                  autoComplete="address-level1"
                  variant="outlined"
                  value={province}
                  onChange={(e) => setProvinceWithValidation(e.target.value)}
                  error={Boolean(provinceError)}
                  helperText={provinceError}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Postal code"
                  type="text"
                  name="postal-code"
                  id="postal-code"
                  autoComplete="postal-code"
                  variant="outlined"
                  value={postalCode}
                  onChange={(e) => setPostalCodeWithValidation(e.target.value)}
                  error={Boolean(postalCodeError)}
                  helperText={postalCodeError}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  type="text"
                  name="country"
                  id="country"
                  autoComplete="country"
                  readOnly={true}
                  variant="outlined"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900 mr-4" // Added margin to the right
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-zinc-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
                >
                  Save
                </button>
              </Grid>
            </Grid>
          </form>
        </div>

      </div>
    </div >

  )
}
