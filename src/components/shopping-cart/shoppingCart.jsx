import React, { useState, useEffect} from 'react';
import axios from 'axios';

import Nav from '../navigation-bar/nav';
import { TextField, Radio, RadioGroup, FormControlLabel, Button, Typography, Box } from '@mui/material';

const ShoppingCart = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  


  
  const tokenEncoded = localStorage.getItem('token');
  const token = tokenEncoded ? atob(tokenEncoded) : '';
  const [deliveryOption, setDeliveryOption] = useState('delivery');
  const [total, setTotal] = useState(0);

  const [cart, setCart] = useState([
    { id: 1, name: 'Swimming Cap', description: 'Black swimming cap with the flag of USA', price: 100, quantity: 1, image: 'https://c4.wallpaperflare.com/wallpaper/894/684/963/michael-phelps-athlete-american-swimmer-the-baltimore-bullet-wallpaper-preview.jpg' },
    { id: 2, name: 'White Shirt' , description: 'Aesthetic white shirt', price: 200, quantity: 2, image: 'https://c4.wallpaperflare.com/wallpaper/1020/45/287/blonde-portrait-women-blue-eyes-wallpaper-preview.jpg' },
    { id: 3, name: 'Plaid Shirt', description: 'woman wearing white and purple plaid shirt and blue denim short short', price: 300, quantity: 3, image: 'https://c1.wallpaperflare.com/preview/129/917/209/model-teen-young-posing.jpg' },
  ]);
  
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
        setName(userProfile.firstName + ' ' + userProfile.lastName || '');
        setPhoneNumber(userProfile.phone_number || '');
        setAddress(userProfile.house_number + ' ' + userProfile.street + ', ' + userProfile.city + ' City ' +  userProfile.province + ', ' + userProfile.zip_code + ', ' + userProfile.country || '' );
        
        // setNameWithValidation(userProfile.name || '');


      } catch (error) {
        console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
      }
    };

    fetchUserProfile();
  }, []);

  // const setNameWithValidation = (value) => {
  //   if (value.trim() === '') {
  //     setName('Username cannot be empty');
  //   } else if (!/^[a-zA-Z0-9_-]{3,16}$/.test(value)) {
  //     setNameError('Invalid username. Use only letters, numbers, hyphens, and underscores (3-16 characters)');
  //   } else {
  //     setNameError('');
  //   }
  //   setName(value);
  //   setFormModified(true);
  // };
  
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

  const calculateTotal = () => {
    const total = cart.reduce((acc, item) => acc + (item.price ), 0);
    setTotal(total);
  };
  
  useEffect(() => {
    calculateTotal();
  }, [cart]);

  const removeFromCart = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
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
        
        <div className="flex justify-around mt-8">
          <Box sx={{ width: '45%', height: '100%', bgcolor: 'white', borderRadius: 2, p: 2, boxShadow: 3 }}>
            <Typography variant="h4" color="black">Products</Typography>
            {cart.map((cart) => (
              <div key={cart.id} className="flex justify-between bg-white rounded-lg p-6 my-4 shadow-md items-center">              
                <img className="w-16 h-16 rounded" src={cart.image} alt={cart.name} />
              <div className="text-left">
                <h2 className="text-lg">{cart.name}</h2>
                <p className="text-gray-600">{cart.description.length > 10 ? `${cart.description.slice(0, 10)}...` : cart.description}</p>                <p className="text-red-500">P {cart.price}</p>
              </div>
              <div className="flex justify-end">
                <button onClick={() => removeFromCart(cart.id)} className="mt-auto bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full text-center">Remove from cart</button>
              </div>
            </div>
            ))}
          </Box>

          <Box sx={{ width: '35%', height: '100%', bgcolor: 'white', borderRadius: 2, p: 2, boxShadow: 3 }}>
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
                value={phoneNumber}
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
