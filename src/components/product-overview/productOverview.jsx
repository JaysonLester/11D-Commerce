import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import Navbar from '../navigation-bar/nav';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const reviews = { href: '#', average: 4, totalCount: 117 }

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductOverview() {
  const isAdminEncoded = localStorage.getItem('isAdmin');
  const isAdmin = isAdminEncoded ? atob(isAdminEncoded) : '';
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { productId } = useParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleColorChange = (event, newColor) => {
    if (newColor) {
      setProduct({ ...product, selectedColor: newColor, availableSizes: product.colors[newColor] || [] });
    } else {
      setProduct({ ...product, selectedColor: newColor, availableSizes: Object.values(product.colors).flat() });
    }
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
      <div className="pt-6">
        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            <img
              src={product.image_urls_1}
              alt={product.product_name}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={product.image_urls_2}
                alt={product.product_name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={product.image_urls_3}
                alt={product.product_name}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
          <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
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
              <TextField
                margin="dense"
                label="Image URL 1"
                type="text"
                value={product.image_urls_1}
                onChange={e => setProduct({ ...product, image_urls_1: e.target.value })}
                fullWidth
              />
              {product.image_urls_1 && <img src={product.image_urls_1} alt="Preview" style={{ width: '100%', height: 'auto' }} />}
              <TextField
                margin="dense"
                label="Image URL 2"
                type="text"
                value={product.image_urls_2}
                onChange={e => setProduct({ ...product, image_urls_2: e.target.value })}
                fullWidth
              />
              {product.image_urls_2 && <img src={product.image_urls_2} alt="Preview" style={{ width: '100%', height: 'auto' }} />}
              <TextField
                margin="dense"
                label="Image URL 3"
                type="text"
                value={product.image_urls_3}
                onChange={e => setProduct({ ...product, image_urls_3: e.target.value })}
                fullWidth
              />
              {product.image_urls_3 && <img src={product.image_urls_3} alt="Preview" style={{ width: '100%', height: 'auto' }} />}
              <TextField
                margin="dense"
                label="Image URL 4"
                type="text"
                value={product.image_urls_4}
                onChange={e => setProduct({ ...product, image_urls_4: e.target.value })}
                fullWidth
              />
              {product.image_urls_4 && <img src={product.image_urls_4} alt="Preview" style={{ width: '100%', height: 'auto' }} />}
            </DialogContent>
            <FormControlLabel
              control={
                <Checkbox
                  checked={product.is_archived}
                  onChange={e => setProduct({ ...product, is_archived: e.target.checked })}
                />
              }
              label="Is Archived"
              style={{ margin: '10px 0' }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={product.is_limited_edition}
                  onChange={e => setProduct({ ...product, is_limited_edition: e.target.checked })}
                />
              }
              label="Is Limited Edition"
              style={{ margin: '10px 0' }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={product.is_on_sale}
                  onChange={e => setProduct({ ...product, is_on_sale: e.target.checked })}
                />
              }
              label="Is On Sale"
              style={{ margin: '10px 0' }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={product.is_discounted}
                  onChange={e => setProduct({ ...product, is_discounted: e.target.checked })}
                />
              }
              label="Is Discounted"
              style={{ margin: '10px 0' }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={product.is_displayed}
                  onChange={e => setProduct({ ...product, is_displayed: e.target.checked })}
                />
              }
              label="Is Displayed"
              style={{ margin: '10px 0' }}
            />
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {product.product_name}
              {isAdmin === '1' &&
                <button
                  onClick={() => setOpen(true)}
                  style={{ marginLeft: '10px', transition: 'transform 0.3s' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = ''}
                >
                  <EditIcon />
                </button>
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
                <a href={reviews.href} className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
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
                  {Object.keys(product.colors).map((color, index) => (
                    <ToggleButton key={index} value={color}>
                      {color}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </div>

              {/* Sizes */}
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Available Size</h3>
                </div>

                <ToggleButtonGroup
                  value={product.selectedSize || ''}
                  exclusive
                  onChange={(event, newSize) => setProduct({ ...product, selectedSize: newSize })}
                >
                  {product.availableSizes && product.availableSizes.map((size, index) => (
                    <ToggleButton key={index} value={size}>
                      {size}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </div>

              <button
                type="submit"
                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add to bag
              </button>
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
      </div>
    </div>
  )
}
