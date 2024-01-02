import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import Navbar from '../navigation-bar/nav';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Container from '@mui/material/Container';

const reviews = { href: '#', average: 4, totalCount: 117 }

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductOverview() {
  const encodedUserId = localStorage.getItem('user_id');
  const userId = atob(encodedUserId);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const isAdminEncoded = localStorage.getItem('isAdmin');
  const isAdmin = isAdminEncoded ? atob(isAdminEncoded) : '';
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { productId } = useParams();
  const [open, setOpen] = useState(false);
  const [cartSuccessOpen, setCartSuccessOpen] = useState(false);
  const [cartErrorOpen, setCartErrorOpen] = useState(false);
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/home');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    setIsLoggedIn(!!token);

    if (isLoggedIn) {
      const storedName = localStorage.getItem('name');
      const decodedName = storedName ? atob(storedName) : '';
      setName(decodedName || '');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    console.log('productId:', productId);
    console.log('userId:', userId);
    axios.get(`http://localhost:3001/api/products/${productId}`)
      .then(response => {
        console.log(response.data);
        const productData = response.data;
        productData.selectedColor = null;
        productData.availableSizes = Object.values(productData.colors).flat();
        setProduct(productData);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, [productId]);

  const handleAddToCart = () => {
    if (userId && product.selectedSize && product.selectedColor) {
      console.log('userId:', userId);
      console.log('productId:', productId);
      console.log('selectedSize:', product.selectedSize);
      console.log('selectedColor:', product.selectedColor);

      axios.post(`http://localhost:3001/api/users/${userId}/cart/items`, {
        productId,
        quantity: 1,
        sizeId: product.selectedSize,
        colorId: product.selectedColor,
      })
        .then(response => {
          console.log(response.data);
          setCartSuccessOpen(true);
        })
        .catch(error => {
          console.error('Error:', error);
          // Check if the error is due to a duplicate entry (status code 400)
          if (error.response && error.response.status === 400) {
            setCartErrorOpen(true);
          } else {
            // Handle other errors (e.g., server error)
            // You can display a generic error message or handle it as needed
            console.error('Unhandled error:', error);
          }
        });
    }
  }

  const handleCartErrorClose = () => {
    setCartErrorOpen(false);
  };

  const handleCartSuccessClose = () => {
    setCartSuccessOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleColorChange = (event, newColor) => {
    console.log('Selected color:', newColor ? product.colors[newColor].color_name : 'None');
    console.log('Selected color ID:', newColor);
    console.log('Selected color ID type:', typeof newColor);
    if (newColor) {
      setProduct({ ...product, selectedColor: newColor, availableSizes: product.colors[newColor].sizes || [] });
    } else {
      setProduct({ ...product, selectedColor: newColor, availableSizes: Object.values(product.colors).flatMap(color => color.sizes) });
    }
  };

  const handleSizeChange = (event, newSize) => {
    console.log('Selected size ID:', newSize);
    console.log('Selected size ID type:', typeof newSize);
    const selectedSizeName = product.selectedColor ? product.colors[product.selectedColor].sizes.find(size => size.size === newSize)?.size_name : 'None';
    console.log('Selected size name:', selectedSizeName);
    setProduct({ ...product, selectedSize: newSize });
  };


  const handleFormSubmit = (event) => {
    event.preventDefault();

    const updatedProduct = {
      price: product.price,
      description: product.description,
      is_archived: product.is_archived,
      is_limited_edition: product.is_limited_edition,
      is_on_sale: product.is_on_sale,
      is_discounted: product.is_discounted,
      is_displayed: product.is_displayed,
      image_url_1: product.image_urls_1,
      image_url_2: product.image_urls_2,
      image_url_3: product.image_urls_3,
      image_url_4: product.image_urls_4,
    };

    axios.put(`http://localhost:3001/api/products/${productId}`, updatedProduct)
      .then(response => {
        console.log(response.data);
        setOpen(false);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  return (
    <div className="bg-white">
      <Navbar />
      <Container>
        <div className="pt-6">
          {/* Image gallery */}
          <Box mb={2} sx={{ color: 'black' }}>
            <Button
              startIcon={<ArrowBackIosIcon />}
              onClick={goBack}
              color="inherit"
            >
              Go Back
            </Button>
          </Box>
          <div className="mx-auto mt-1 mb-1 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-1 lg:px-1">
            <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-sm lg:row-span-1 mb-1">
              <img
                src={product.image_urls_1}
                alt={product.product_name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-sm lg:row-span-1 mb-1">
              <img
                src={product.image_urls_2}
                alt={product.product_name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-sm lg:row-span-1 mb-1">
              <img
                src={product.image_urls_3}
                alt={product.product_name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-sm lg:row-span-1 mb-1">
              <img
                src={product.image_urls_4}
                alt={product.product_name}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Edit Product</DialogTitle>
            <form onSubmit={handleFormSubmit}>
              <DialogContent>
                {/* Text Fields */}
                <TextField
                  autoFocus
                  margin="dense"
                  label="Price"
                  type="number"
                  value={product.price}
                  onChange={e => setProduct({ ...product, price: e.target.value })}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Description"
                  type="text"
                  multiline
                  rowsMax={4}
                  value={product.description}
                  onChange={e => setProduct({ ...product, description: e.target.value })}
                  fullWidth
                />

                {/* Image Fields */}
                {Array.from({ length: 4 }, (_, i) => (
                  <React.Fragment key={i}>
                    <TextField
                      margin="dense"
                      label={`Image URL ${i + 1}`}
                      type="text"
                      value={product[`image_urls_${i + 1}`]}
                      onChange={e => setProduct({ ...product, [`image_urls_${i + 1}`]: e.target.value })}
                      fullWidth
                    />
                    {product[`image_urls_${i + 1}`] && <img src={product[`image_urls_${i + 1}`]} alt="Preview" style={{ width: '100%', height: 'auto' }} />}
                  </React.Fragment>
                ))}

                {/* Checkboxes */}
                <FormGroup>
                  <FormControlLabel
                    control={<Switch checked={product.is_archived} onChange={e => setProduct({ ...product, is_archived: e.target.checked })} />}
                    label="Archive this product"
                  />
                  <FormControlLabel
                    control={<Switch checked={product.is_limited_edition} onChange={e => setProduct({ ...product, is_limited_edition: e.target.checked })} />}
                    label="Mark as limited edition"
                  />
                  <FormControlLabel
                    control={<Switch checked={product.is_on_sale} onChange={e => setProduct({ ...product, is_on_sale: e.target.checked })} />}
                    label="Mark as on sale"
                  />
                  <FormControlLabel
                    control={<Switch checked={product.is_discounted} onChange={e => setProduct({ ...product, is_discounted: e.target.checked })} />}
                    label="Apply discount to this product"
                  />
                  <FormControlLabel
                    control={<Switch checked={product.is_displayed} onChange={e => setProduct({ ...product, is_displayed: e.target.checked })} />}
                    label="Display this product on the website"
                  />
                </FormGroup>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" color="primary" variant="contained">Save</Button>
              </DialogActions>
            </form>
          </Dialog>

          {/* Product info */}
          <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {product.product_name}
                {isAdmin === '1' &&
                  <IconButton
                    onClick={() => setOpen(true)}
                    style={{ marginLeft: '10px', transition: 'transform 0.3s' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = ''}
                  >
                    <EditIcon />
                  </IconButton>
                }
              </h1>
            </div>

            {/* Options */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">Php {product.price}</p>

              {/* Reviews */}
              <div className="mt-6">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          reviews.average > rating ? 'text-gray-900' : 'text-gray-200',
                          'h-5 w-5 flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="sr-only">{reviews.average} out of 5 stars</p>
                  <a href={reviews.href} className="ml-3 text-sm font-medium text-zinc-900 hover:text-zinc-500">
                    {reviews.totalCount} reviews
                  </a>
                </div>
              </div>

              <form className="mt-10">
                {/* Colors */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Color</h3>
                  <ToggleButtonGroup
                    value={product.selectedColor || ''}
                    exclusive
                    onChange={handleColorChange}
                  >
                    {Object.keys(product.colors).map((colorId, index) => (
                      <ToggleButton key={index} value={colorId}>
                        {product.colors[colorId].color_name}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </div>

                {/* Sizes */}
                <div className="mt-10 mb-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Available Size</h3>
                  </div>

                  <ToggleButtonGroup
                    value={product.selectedSize || ''}
                    exclusive
                    onChange={handleSizeChange}
                  >
                    {product.selectedColor && product.colors[product.selectedColor].sizes.map((size, index) => (
                      <ToggleButton key={index} value={size.size}>
                        {size.size_name}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </div>

                {isLoggedIn ? (
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<AddShoppingCartIcon />}
                    onClick={handleAddToCart} // Add this line
                    sx={{
                      backgroundColor: 'black',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgb(30, 30, 30)'
                      }
                    }}
                    mt={2}
                  >
                    Add to Cart
                  </Button>
                ) : (
                  <>
                    <Button variant="contained" color="secondary" disabled fullWidth startIcon={<AddShoppingCartIcon />} mt={2}>
                      Add to Cart
                    </Button>
                    <p>You need to log in to add items to your bag.</p>
                  </>
                )}
              </form>
            </div>

            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
              {/* Description and details */}
              <div>
                <h3 className="sr-only">Description</h3>

                <div className="space-y-6">
                  <p className="text-base text-gray-900">{product.description}</p>
                </div>
              </div>

              {/* <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>

              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {product.highlights.map((highlight) => (
                    <li key={highlight} className="text-gray-400">
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>

              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{product.details}</p>
              </div>
            </div> */}
            </div>
          </div>
          {/* Success Dialog */}
          <Dialog open={cartSuccessOpen} onClose={handleCartSuccessClose}>
            <DialogTitle>Success</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Item added to cart successfully!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCartSuccessClose} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>

          {/* Error Dialog */}
          <Dialog open={cartErrorOpen} onClose={handleCartErrorClose}>
            <DialogTitle>Error</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Item already exists in the cart.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCartErrorClose} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Container>

    </div>
  )
}
