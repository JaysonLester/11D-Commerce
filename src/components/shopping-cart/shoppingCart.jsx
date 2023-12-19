import React, { useState } from 'react';
import Nav from '../navigation-bar/nav';
import { TextField, Radio, RadioGroup, FormControlLabel, Button, Typography, Box } from '@mui/material';

const ShoppingCart = () => {
  const [name, setName] = useState('');
  const tokenEncoded = localStorage.getItem('token');
  const token = tokenEncoded ? atob(tokenEncoded) : '';
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [address, setAddress] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('delivery');
  const [total, setTotal] = useState(0);

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
              <p className="text-base font-semibold text-zinc-600">Access Denied</p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Login Required</h1>
              <p className="mt-6 text-base leading-7 text-gray-600">Please login to access your shopping cart.</p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
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
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">SHOPPING CART</h1>
        <div className="flex items-center justify-end mt-8">

          <Box sx={{ width: '35%', bgcolor: 'white', borderRadius: 2, p: 2, boxShadow: 3 }}>
            <Typography variant="h4" color="black">Check Out</Typography>

            <form noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <TextField
                label="Name"
                value={name}
                onChange={handleNameChange}
                fullWidth
                required
                sx={{ my: 2, color: 'black' }}
              />

              <TextField
                label="Phone Number"
                type="tel"
                value={phoneNumber === 0 ? '' : phoneNumber}
                onChange={handlePhoneNumberChange}
                fullWidth
                required
                sx={{ my: 2, color: 'black' }}
              />

              <TextField
                label="Address"
                value={address}
                onChange={handleAddressChange}
                fullWidth
                required
                multiline
                sx={{ my: 2, color: 'black' }}
              />

              <Typography variant="body1" color="black" sx={{ mt: 2 }}>Delivery Option:</Typography>
              <RadioGroup
                value={deliveryOption}
                onChange={handleDeliveryOptionChange}
                row
              >
                <FormControlLabel value="delivery" control={<Radio color="primary" />} label="Delivery" />
                <FormControlLabel value="pickup" control={<Radio color="primary" />} label="Pickup" />
              </RadioGroup>

              <Typography variant="body1" color="black" sx={{ my: 2 }}>Total:</Typography>
              <Typography variant="h6" color="black">{formattedTotal}</Typography>

              <Button
                variant="contained"
                color="inherit"
                onClick={handleCheckout}
                fullWidth
                sx={{
                  mt: 2,
                  bgcolor: 'black',
                  color: 'white',
                  '&:hover': {
                    color: 'black',
                    bgcolor: 'white',
                  },
                }}
              >
                Checkout
              </Button>
            </form>
          </Box>

        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
