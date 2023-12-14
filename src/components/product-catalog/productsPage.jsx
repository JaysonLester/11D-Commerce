import { useState, useEffect } from 'react';
import { FunnelIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import Nav from '../navigation-bar/nav';
import AddProductModal from './modals/AddProductModal';
import { sortOptions, subCategories, filters } from './filters/productFilters';
import MobileFilterDialog from './filters/MobileFilterDialog';
import FiltersForm from './filters/filtersForm';
import SortingMenu from './filters/sortingMenu';
import { Grid, Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Example() {
    const isAdminEncoded = localStorage.getItem('isAdmin');
    const isAdmin = isAdminEncoded ? atob(isAdminEncoded) : '';
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [cardItems, setCardItems] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/api/product')
            .then((response) => {
                setCardItems(response.data);
            })
            .catch((error) => {
                console.error('Error fetching product data:', error);
            });
    }, []);

    const archiveProduct = (productId, productName) => {
        axios.put(`http://localhost:3001/api/product/archive/${productId}`, { productName })
            .then((response) => {
                // Refresh the product list or remove the archived product from the state
                console.log(response.data.message); // Assuming you have a function to refresh 
            })
            .catch((error) => {
                console.error('Error archiving product:', error);
            });
    };

    const deleteProduct = (productName, productType) => {
        axios.delete('http://localhost:3001/api/product', { data: { product_name: productName, product_type: productType } })
            .then((response) => {
                console.log(response.data.message);
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error deleting product:', error);
            });
    };

    const sizeShortcut = (size) => {
        const sizeMap = {
            'Small': 'S',
            'Medium': 'M',
            'Large': 'L',
            // Add more mappings as needed
        };
        return sizeMap[size] || size;
    };

    return (
        <div>
            <Nav />
            <div className="bg-white">
                <div>
                    {/* Mobile filter dialog */}
                    <MobileFilterDialog
                        mobileFiltersOpen={mobileFiltersOpen}
                        setMobileFiltersOpen={setMobileFiltersOpen}
                        subCategories={subCategories}
                        filters={filters}
                    />
                    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900">New Arrivals</h1>

                            <div className="flex items-center">
                                {isAdmin === '1' && (
                                    <Button
                                        type="button"
                                        variant="contained"
                                        style={{ backgroundColor: 'darkred', color: 'white' }}
                                        sx={{ mx: 1 }}
                                        onClick={() => setIsAddProductModalOpen(true)}
                                    >
                                        Add product
                                    </Button>
                                )}
                                {/* Add Product modal */}
                                <AddProductModal
                                    isOpen={isAddProductModalOpen}
                                    closeModal={() => setIsAddProductModalOpen(false)}
                                />
                                {/* Sorting menu */}
                                <SortingMenu sortOptions={sortOptions} classNames={classNames} />
                                <button
                                    type="button"
                                    className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                                    onClick={() => setMobileFiltersOpen(true)}
                                >
                                    <span className="sr-only">Filters</span>
                                    <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        <section aria-labelledby="products-heading" className="pb-24 pt-6">
                            <h2 id="products-heading" className="sr-only">
                                Products
                            </h2>

                            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                                {/* Filters */}
                                <FiltersForm subCategories={subCategories} filters={filters} />
                                {/* Product grid */}
                                <Grid container spacing={4}>
                                    {cardItems.map((product) => (
                                        <Grid item key={product.id} xs={12} sm={6} md={12}>
                                            <Card>
                                                <CardMedia
                                                    component="img"
                                                    height="140"
                                                    image={product.imageUrl1}
                                                    alt={product.product_name}
                                                />
                                                <CardContent>
                                                    <Typography gutterBottom variant="h5" component="div">
                                                        <a href={`#${product.product_id}`}>
                                                            {product.product_name}
                                                        </a>
                                                    </Typography>
                                                    <Typography variant="body" color="text.secondary">
                                                    <span style={{ fontWeight: 600 }}>{product.color}</span>
                                                        {product.variations.length > 1 && (
                                                            <>
                                                                {" +"}
                                                                {product.variations
                                                                    .filter(variation => variation.color !== product.color)
                                                                    .length} {product.variations
                                                                        .filter(variation => variation.color !== product.color)
                                                                        .length > 1 ? 'other colors' : 'other color'}
                                                            </>
                                                        )}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                    <span style={{ fontWeight: 600 }}>{product.size}</span>
                                                        {product.variations.length > 1 && (
                                                            <>
                                                                {" +"}
                                                                {product.variations
                                                                    .filter(variation => variation.size !== product.size)
                                                                    .length} {product.variations
                                                                        .filter(variation => variation.size !== product.size)
                                                                        .length > 1 ? 'other sizes' : 'other size'}
                                                            </>
                                                        )}
                                                    </Typography>
                                                    <Typography variant="h6" color="text.secondary">
                                                        {`Php ${product.price}`}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                                                        {isAdmin === '1' && (
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                style={{ backgroundColor: 'gray', color: 'white', marginRight: '2px' }}
                                                                sx={{ mx: 1 }}
                                                                onClick={() => archiveProduct(product.product_id, product.product_name)}
                                                            >
                                                                Archive
                                                            </Button>
                                                        )}
                                                        {isAdmin === '1' && (
                                                            <Button
                                                                variant="contained"
                                                                style={{ backgroundColor: 'red', color: 'white' }}
                                                                sx={{ mx: 1 }}
                                                                onClick={() => deleteProduct(product.product_name, product.product_type)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        )}
                                                    </Box>
                                                </CardContent>

                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    )
}
