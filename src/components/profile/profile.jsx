import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Nav from '../navigation-bar/nav';
import axios from 'axios';
import Select from 'react-select';
import cities from './cities/cities';

export default function Profile() {
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
      checkFormModified()&&
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

  return (
    <div>
      <Nav />
      <div className="bg-white">
        <div className="mx-80 my-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-4xl font-bold leading-7 text-gray-900 mb-4">Your Profile</h2>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="username" className="block text-sm font-semibold leading-6 text-gray-900">
                      Username
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="username"
                        id="username"
                        autoComplete="username"
                        className={`block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6 ${usernameError && 'border-red-500'}`}
                        value={username}
                        onChange={(e) => setUsernameWithValidation(e.target.value)}
                      />
                      {usernameError && (
                        <p className="mt-2 text-sm text-red-500">{usernameError}</p>
                      )}
                    </div>
                    <div className="sm:col-span-3 mt-2">
                      <p className="text-sm font-medium font-style: italic text-gray-600">
                        Note: Please log out and log back in for the username changes to take effect.
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="username" className="block text-sm font-semibold leading-6 text-gray-900">
                      Password
                    </label>
                    <div className="sm:col-span-3 mt-2">
                    <p className="text-sm font-medium font-style: italic text-gray-600">If you want to change password go <Link to="/change-password" className="font-bold text-zinc-600 hover:text-zinc-500">here</Link></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">Provide the needed information</p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                  <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">
                      First name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        autoComplete="given-name"
                        className={`block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6 ${firstNameError && 'border-red-500'}`}
                        value={firstName}
                        onChange={(e) => setFirstNameWithValidation(e.target.value)}
                      />
                      {firstNameError && (
                        <p className="mt-2 text-sm text-red-500">{firstNameError}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">
                      Last name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        autoComplete="family-name"
                        className={`block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6 ${lastNameError && 'border-red-500'}`}
                        value={lastName}
                        onChange={(e) => setLastNameWithValidation(e.target.value)}
                      />
                      {lastNameError && (
                        <p className="mt-2 text-sm text-red-500">{lastNameError}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        readOnly={true}
                        className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {emailError && (
                        <p className="mt-2 text-sm text-red-500">{emailError}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-semibold leading-6 text-gray-900">
                      Phone Number
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        autoComplete="tel"
                        className={`block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6 ${phoneError && 'border-red-500'}`}
                        value={phone}
                        onChange={(e) => setPhoneWithValidation(e.target.value)}
                      />
                      {phoneError && (
                        <p className="mt-2 text-sm text-red-500">{phoneError}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="dob" className="block text-sm font-semibold leading-6 text-gray-900">
                      Date of Birth
                    </label>
                    <div className="mt-2">
                      <input
                        type="date"
                        name="dob"
                        id="dob"
                        autoComplete="bday"
                        className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-3 mt-2">
                      <p className="text-sm font-medium italic text-gray-600">
                        Note: If this is your initial attempt to modify your date of birth, please review it attentively, as it is currently configured with the default value, and it must be changed accordingly.
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-2 sm:col-start-1">
                    <label htmlFor="house-number" className="block text-sm font-semibold leading-6 text-gray-900">
                      House Number
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="house-number"
                        id="house-number"
                        autoComplete="house-number"
                        className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                        value={houseNumber}
                        onChange={(e) => setHouseNumberWithValidation(e.target.value)}
                      />
                      {houseNumberError && (
                        <p className="mt-2 text-sm text-red-500">{houseNumberError}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="street-address" className="block text-sm font-semibold leading-6 text-gray-900">
                      Street address
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="street-address"
                        id="street-address"
                        autoComplete="street-address"
                        className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                        value={streetAddress}
                        onChange={(e) => setStreetAddressWithValidation(e.target.value)}
                      />
                      {streetAddressError && (
                        <p className="mt-2 text-sm text-red-500">{streetAddressError}</p>
                      )}
                    </div>
                  </div>


                  <div className="sm:col-span-2">
                    <label htmlFor="city" className="block text-sm font-semibold leading-6 text-gray-900">
                      City
                    </label>
                    <div>
                      <Select
                        id="city"
                        name="city"
                        options={cities.map(cityOption => ({ value: cityOption, label: cityOption }))}
                        isSearchable
                        className={`w-full rounded-md py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-zinc-600 sm:text-sm sm:leading-6 ${cityError && 'border-red-500'}`}
                        value={{ value: city, label: city }} // Set the value as an object with value and label properties
                        onChange={(selectedOption) => setCityWithValidation(selectedOption.value)}
                      />


                      {cityError && (
                        <p className="mt-2 text-sm text-red-500">{cityError}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="region" className="block text-sm font-semibold leading-6 text-gray-900">
                      State / Province
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="region"
                        id="region"
                        autoComplete="address-level1"
                        className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                        value={province}
                        onChange={(e) => setProvinceWithValidation(e.target.value)}
                      />
                      {provinceError && (
                        <p className="mt-2 text-sm text-red-500">{provinceError}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="postal-code" className="block text-sm font-semibold leading-6 text-gray-900">
                      ZIP / Postal code
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="postal-code"
                        id="postal-code"
                        autoComplete="postal-code"
                        className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                        value={postalCode}
                        onChange={(e) => setPostalCodeWithValidation(e.target.value)}
                      />
                      {postalCodeError && (
                        <p className="mt-2 text-sm text-red-500">{postalCodeError}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="country" className="block text-sm font-semibold leading-6 text-gray-900">
                      Country
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="country"
                        id="country"
                        autoComplete="country"
                        readOnly={true}
                        className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
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
            </div>

          </form>
        </div>
      </div>
    </div>

  )
}
