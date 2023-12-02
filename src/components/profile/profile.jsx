import { useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import Nav from '../navigation-bar/nav';
import axios from 'axios';

export default function Profile() {
  const getStoredValue = (key) => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== 'undefined' ? storedValue : '';
  };

  const [username, setUsername] = useState(getStoredValue('name'));
  const [firstName, setFirstName] = useState(getStoredValue('firstName'));
  const [lastName, setLastName] = useState(getStoredValue('lastName'));
  const [email, setEmail] = useState(getStoredValue('email'));
  const [phone, setPhone] = useState(getStoredValue('phone_number'));
  const [dob, setDob] = useState(getStoredValue('date_of_birth'));
  const [streetAddress, setStreetAddress] = useState(getStoredValue('street'));
  const [houseNumber, setHouseNumber] = useState(getStoredValue('house_number'));
  const [city, setCity] = useState(getStoredValue('city'));
  const [province, setProvince] = useState(getStoredValue('province'));
  const [postalCode, setPostalCode] = useState(getStoredValue('zip_code'));
  const [country, setCountry] = useState(getStoredValue('country'));

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
  
      // Include fields in the updatedFields object only if they have a value
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
  
      // Only include dateOfBirth if it has a value
      if (dob) {
        updatedFields.dateOfBirth = dob;
      }
  
      const response = await axios.post(
        'http://localhost:3001/api/update-profile',
        updatedFields,
        {
          headers: {
            Authorization: token,
          },
        }
      );
  
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

                <div className="col-span-full">
                  <div className="mt-2 flex items-center gap-x-3">
                    <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                    <button
                      type="button"
                      className="rounded-md bg-white px-2.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                      Username
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-zinc-600 sm:max-w-md">
                        <input
                          type="text"
                          name="username"
                          id="username"
                          autoComplete="username"
                          className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">Provide the needed information</p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                  <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                      First name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                      Last name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        autoComplete="family-name"
                        className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                      Phone Number
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        autoComplete="tel"
                        className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="dob" className="block text-sm font-medium leading-6 text-gray-900">
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
                  </div>

                  <div className="sm:col-span-2 sm:col-start-1">
                    <label htmlFor="house-number" className="block text-sm font-medium leading-6 text-gray-900">
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
                        onChange={(e) => setHouseNumber(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
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
                        onChange={(e) => setStreetAddress(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                      City
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        autoComplete="address-level2"
                        className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
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
                        onChange={(e) => setProvince(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
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
                        onChange={(e) => setPostalCode(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                      Country
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="country"
                        id="country"
                        autoComplete="country"
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
              <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
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
