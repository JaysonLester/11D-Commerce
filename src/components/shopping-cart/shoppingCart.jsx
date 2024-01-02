import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Nav from '../navigation-bar/nav';
import { TextField, Radio, RadioGroup, FormControlLabel, Button, Typography, Box, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { CardMedia } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';

const ShoppingCart = () => {
  const { userId: urlUserId } = useParams();
  const userIdEncoded = localStorage.getItem('user_id');
  const userId = userIdEncoded ? atob(userIdEncoded) : null;
  const [name, setName] = useState('');
  const tokenEncoded = localStorage.getItem('token');
  const token = tokenEncoded ? atob(tokenEncoded) : '';
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [address, setAddress] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('delivery');
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [removedItemName, setRemovedItemName] = useState('');


  useEffect(() => {
    const userIdEncoded = localStorage.getItem('user_id');
    const userId = userIdEncoded ? atob(userIdEncoded) : null;

    if (userId) {
      axios.get(`http://localhost:3001/api/cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          if (response.data.length > 0) {
            setCartItems(response.data);
            console.log('Cart items:', response.data);
          } else {
            console.log('No items in cart');
          }
        })
        .catch(error => {
          console.error('Error fetching cart items:', error);
        });
    }
  }, []);

  // State to track selected items for checkout
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemTotal, setSelectedItemTotal] = useState(0);

  useEffect(() => {
    calculateTotal();
  }, [cartItems, selectedItems]);

  const calculateTotal = () => {
    const total = selectedItems.reduce((acc, cartId) => {
      const selectedItem = cartItems.find(item => item.cart_id === cartId);
      return acc + (selectedItem ? selectedItem.price * selectedItem.quantity : 0);
    }, 0);
    setTotal(total);
  };

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

  // Function to toggle the selection of an item
  const toggleItemSelection = (cartId) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(cartId)) {
        return prevSelectedItems.filter((id) => id !== cartId);
      } else {
        return [...prevSelectedItems, cartId];
      }
    });
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const removeFromCart = async (cartId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/cart/${cartId}/remove`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const removedItem = cartItems.find(item => item.cart_id === cartId);
        if (removedItem) {
          setRemovedItemName(removedItem.product_name);
        }
        setOpenDialog(true);
        setCartItems(cartItems.filter(item => item.cart_id !== cartId));
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const updateQuantity = async (cartId, quantityChange) => {
    const item = cartItems.find(item => item.cart_id === cartId);
    if (item && (item.quantity + quantityChange) > 0) {
      const updatedItem = { ...item, quantity: item.quantity + quantityChange };
      try {
        const response = await axios.put(`http://localhost:3001/api/cart/${cartId}/update`, updatedItem, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setCartItems(cartItems.map(item => item.cart_id === cartId ? updatedItem : item));
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    }
  };

  const handleIncrease = (cartId) => {
    updateQuantity(cartId, 1);
  };

  const handleDecrease = (cartId) => {
    updateQuantity(cartId, -1);
  };

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

  const handleRedirectToLogin = () => {
    window.location.href = `/login`;
  };

  const handRedirectToCart = () => {
    window.location.href = `/shopping-cart/${userId}`;
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
                  onClick={handleRedirectToLogin}
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
  } else if (Number(urlUserId) !== Number(userId)) {
    return (
      <>
        <div>
          <Nav />
          <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
              <p className="text-base font-semibold text-zinc-600">Access Denied</p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Unauthorized Access</h1>
              <p className="mt-6 text-base leading-7 text-gray-600">You are trying to access a shopping cart that does not belong to you.</p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  onClick={handRedirectToCart}
                  className="rounded-md bg-zinc-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
                >
                  Go to My Cart
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
        <div className="flex items-start justify-between mt-8">
  
          <Box sx={{ width: '65%', marginRight: '5%', overflow: 'auto', maxHeight: '90vh' }}>
            <Typography variant="h4" color="black">
              <ShoppingCartIcon sx={{ mr: 1 }} />
              Shopping Cart
            </Typography>
  
            {/* Display Cart Items with Checkboxes */}
            {cartItems.map((item) => (
              <Card key={item.cart_id} sx={{ my: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid grey', bgcolor: 'transparent' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Checkbox
                    checked={selectedItems.includes(item.cart_id)}
                    onChange={() => toggleItemSelection(item.cart_id)}
                  />
                </Box>
                <Box sx={{ width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 2 }}>
                  <CardMedia
                    component="img"
                    sx={{ objectFit: 'contain', maxHeight: '100%' }}
                    image={item.image} // Assuming each item has an image
                    alt={item.product_id}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                   
                    <Typography variant="h6" color="black" sx={{ fontWeight: 'bold', lineHeight: '1.5' }}>{item.product_name}</Typography>
                    <IconButton color="default" aria-label="remove from shopping cart" onClick={() => removeFromCart(item.cart_id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', fontSize: '1.2em', lineHeight: '1.2' }}>{item.product_color}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'normal', fontSize: '1em', lineHeight: '1.2' }}>{item.product_size}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'lighter', fontSize: '0.8em', lineHeight: '1.2' }}>
  Php {item.price * item.quantity}
</Typography>                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'normal', lineHeight: '1.2' }}>Quantity: {item.quantity}</Typography>
                    <IconButton color="default" aria-label="increase quantity" onClick={() => handleIncrease(item.cart_id)} sx={{ padding: '5px' }}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="default" aria-label="decrease quantity" onClick={() => handleDecrease(item.cart_id)} sx={{ padding: '5px' }}>
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
  
          {/* Checkout Form */}
          <Box sx={{ width: '30%', bgcolor: 'white', borderRadius: 2, p: 2, boxShadow: 3 }}>
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
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Item Removed"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {removedItemName ? `${removedItemName} has been removed from the cart.` : ''}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
  
};

export default ShoppingCart;
