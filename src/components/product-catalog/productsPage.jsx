import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FunnelIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import Nav from '../navigation-bar/nav';
import AddProductModal from './modals/AddProductModal';
import { subCategories, filters } from './filters/productFilters';
import MobileFilterDialog from './filters/MobileFilterDialog';
import FiltersForm from './filters/filtersForm';
import { OutlinedInput, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Chip from '@mui/material/Chip';

export default function ProductsPage() {
    const isAdminEncoded = localStorage.getItem('isAdmin');
    const isAdmin = isAdminEncoded ? atob(isAdminEncoded) : '';
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [cardItems, setCardItems] = useState([]);
    const [showArchived, setShowArchived] = useState(false);
    const [showNotDisplayed, setShowNotDisplayed] = useState(false);
    const [viewMode, setViewMode] = useState(['Latest Collections']);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleViewMode = (mode) => {
        let newShowArchived = mode === 'Archived' ? !showArchived : false;
        let newShowNotDisplayed = mode === 'NotDisplayed' ? !showNotDisplayed : false;
        let newViewMode = viewMode;

        switch (mode) {
            case 'Archived':
                newViewMode = newShowArchived ? 'Archived Products' : 'All Products';
                if (newShowArchived) newShowNotDisplayed = false;
                break;
            case 'NotDisplayed':
                newShowNotDisplayed = !showNotDisplayed;
                newViewMode = newShowNotDisplayed ? 'Not Displayed Products' : 'All Products';
                break;
            default:
                setIsAddProductModalOpen(true);
                return;
        }

        setShowArchived(newShowArchived);
        setShowNotDisplayed(newShowNotDisplayed);
        setViewMode(newViewMode);

        fetchProducts();
    };

    const buttons = [
        {
            onClick: () => handleViewMode('Add'),
            icon: <AddIcon />,
            marginRight: '1rem'
        },
        {
            onClick: () => handleViewMode('Archived'),
            icon: showArchived ?
                <>
                    <ArchiveIcon />
                    <Chip label="Archived" color="primary" size="small" />
                </>
                :
                <ArchiveIcon />,
            marginRight: '1rem'
        },
        {
            onClick: () => handleViewMode('NotDisplayed'),
            icon: showNotDisplayed ? <VisibilityIcon /> : <VisibilityOffIcon />,
            marginRight: '1rem'
        }
    ];

    useEffect(() => {
        console.log(cardItems);
    }, [cardItems]);

    useEffect(() => {
        fetchProducts();
    }, [showArchived, showNotDisplayed]);


    const fetchProducts = () => {
        const url = 'http://localhost:3001/api/products';
        axios.get(url)
            .then(response => {
                let products = response.data;
                if (showNotDisplayed) {
                    products = products.filter(product => product.is_displayed === 0);
                } else {
                    products = products.filter(product => product.is_displayed !== 0);
                }
                if (showArchived) {
                    products = products.filter(product => product.is_archived === 1);
                } else {
                    products = products.filter(product => product.is_archived !== 1);
                }
                setCardItems(products);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    const archiveProduct = (productId, productName) => {
        axios.put(`http://localhost:3001/api/products/${productId}/archive`)
            .then(response => {
                console.log(`Product ${productName} has been archived.`);
                fetchProducts();
            })
            .catch(error => {
                console.error('There was an error!', error.response);
            });
    };

    const unarchiveProduct = (productId, productName) => {
        axios.put(`http://localhost:3001/api/products/${productId}/unarchive`)
            .then(response => {
                console.log(`Product ${productName} has been unarchived.`);
                fetchProducts();
            })
            .catch(error => {
                console.error('There was an error!', error.response);
            });
    };

    const handleOpenDeleteDialog = (productId, productName) => {
        setProductToDelete({ productId, productName });
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const deleteProduct = () => {
        axios.delete(`http://localhost:3001/api/products/${productToDelete.productId}/delete`)
            .then(response => {
                console.log(`Product ${productToDelete.productName} has been deleted.`);
                setCardItems(cardItems.filter(item => item.product_id !== productToDelete.productId));
                handleCloseDeleteDialog();
                window.location.reload();
            })
            .catch(error => {
                console.error('There was an error!', error.response);
            });
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
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                                {viewMode}
                            </h1>

                            <div className="flex items-center">
                                <OutlinedInput
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search products"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    }
                                    sx={{ borderRadius: '25px' }} // This gives the input a rounded appearance
                                />
                                {isAdmin === '1' && buttons.map((button, index) => (
                                    <IconButton key={index} onClick={button.onClick} sx={{ marginRight: button.marginRight }}>
                                        {button.icon || button.text}
                                    </IconButton>
                                ))}

                                {/* Add Product modal */}
                                <AddProductModal
                                    isOpen={isAddProductModalOpen}
                                    closeModal={() => setIsAddProductModalOpen(false)}
                                />

                                {/* Sorting menu */}
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
                                <div className="lg:col-span-3">
                                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                                        {cardItems.filter(item =>
                                            item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
                                        ).map((product) => (
                                            <div key={product.id} className="group relative">
                                                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                                                    <img
                                                        src={product.image_urls_1}
                                                        alt={product.product_name}
                                                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                                    />
                                                </div>

                                                <div className="mt-2 flex justify-between">
                                                    <div>
                                                        <h3 className="text-sm text-gray-700 font-bold">
                                                            <Link to={`/product-overview/${product.product_id}`}>
                                                                {product.product_name}
                                                            </Link>
                                                        </h3>

                                                        <p className="mt-1 text-sm text-gray-500">
                                                            <span className="font-bold">{product.colors.split(',')[0]}</span>
                                                            <span>
                                                                {product.colors.split(',').length > 2 ? ` + ${product.colors.split(',').length - 1} other colors` :
                                                                    (product.colors.split(',').length === 2 ? " +1 other color" : "")}
                                                            </span>
                                                        </p>

                                                        <p className="mt-1 text-sm text-gray-500">
                                                            <span className="font-bold">{product.sizes.split(',')[0]}</span>
                                                            <span>
                                                                {product.sizes.split(',').length > 2 ? ` + ${product.sizes.split(',').length - 1} other sizes` :
                                                                    (product.sizes.split(',').length === 2 ? " +1 other size" : "")}
                                                            </span>
                                                        </p>

                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-900 mb-2">{`Php ${product.price}`}</p>
                                                    </div>

                                                </div>
                                                <div className="text-right">
                                                    {isAdmin === '1' && (
                                                        <div className="flex justify-end">
                                                            {product.is_archived ? (
                                                                <IconButton
                                                                    onClick={() => unarchiveProduct(product.product_id, product.product_name)}
                                                                >
                                                                    <RestoreFromTrashIcon />
                                                                </IconButton>
                                                            ) : (
                                                                <IconButton
                                                                    onClick={() => archiveProduct(product.product_id, product.product_name)}
                                                                >
                                                                    <ArchiveIcon />
                                                                </IconButton>
                                                            )}
                                                            <IconButton
                                                                color="error"
                                                                onClick={() => handleOpenDeleteDialog(product.product_id, product.product_name)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>

                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Dialog
                                    open={openDeleteDialog}
                                    onClose={handleCloseDeleteDialog}
                                >
                                    <DialogTitle>Delete Product</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            Are you sure you want to delete {productToDelete?.productName}?
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleCloseDeleteDialog} color="primary">
                                            Cancel
                                        </Button>
                                        <Button onClick={deleteProduct} color="primary" autoFocus>
                                            Delete
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    )
}
