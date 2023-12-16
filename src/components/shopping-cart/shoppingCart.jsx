import React, { useState } from 'react';
import Nav from '../navigation-bar/nav';

const ShoppingCart = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [address, setAddress] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('delivery');
  const [total, setTotal] = useState(0); // Added this line

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setPhoneNumber(isNaN(value) ? 0 : value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleDeliveryOptionChange = (e) => {
    setDeliveryOption(e.target.value);
  };

  const handleCheckout = () => {
    console.log('Order submitted:', { name, phoneNumber, address, deliveryOption, total });
  };


  const formattedTotal = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(total);

  return (
    <div>
      <Nav />
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">SHOPPING CART</h1>
        <div className="flex items-center justify-end mt-8">
        
        <div className="max-w-xl bg-black rounded-lg p-10 shadow-md">
            <h3 className="text-white text-xl font-bold sm:text-2xl">Check Out</h3>

            <form className="mt-4">
              <label className="block text-white text-sm font-bold mb-2">Name:</label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                className="w-full border border-gray-300 p-2 rounded text-black"
                required
              />

              <label className="block text-white text-sm font-bold mt-4 mb-2">Phone Number:</label>
              <input
                type="tel"
                value={phoneNumber === 0 ? '' : phoneNumber}
                onChange={handlePhoneNumberChange}
                className="w-full border border-gray-300 p-2 rounded text-black"
                required
              />

              <label className="block text-white text-sm font-bold mt-4 mb-2">Address:</label>
              <textarea
                value={address}
                onChange={handleAddressChange}
                className="w-full border border-gray-300 p-2 rounded text-black"
                required
              ></textarea>

              <label className="block text-white text-sm font-bold mt-4 mb-2">Delivery Option:</label>
              <div className="flex items-center">
                <label className="mr-4 text-white">
                  <input
                    type="radio"
                    value="delivery"
                    checked={deliveryOption === 'delivery'}
                    onChange={handleDeliveryOptionChange}
                    className="mr-2"
                  />
                  Delivery
                </label>
                <label className="text-white">
                  <input
                    type="radio"
                    value="pickup"
                    checked={deliveryOption === 'pickup'}
                    onChange={handleDeliveryOptionChange}
                    className="mr-2"
                  />
                  Pickup
                </label>
              </div>

              <label className="block text-white text-sm font-bold mt-4 mb-2">Total:</label>
              <p className="text-lg font-bold text-white">{formattedTotal}</p>

              <button
                type="button"
                onClick={handleCheckout}
                className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
              >
                Checkout
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
