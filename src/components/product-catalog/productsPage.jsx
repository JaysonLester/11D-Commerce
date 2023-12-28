import { useState, useEffect } from 'react';
import { FunnelIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import Nav from '../navigation-bar/nav';
import AddProductModal from './modals/AddProductModal';
import { subCategories, filters } from './filters/productFilters';
import MobileFilterDialog from './filters/MobileFilterDialog';
import FiltersForm from './filters/filtersForm';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Example() {
    const isAdminEncoded = localStorage.getItem('isAdmin');
    const isAdmin = isAdminEncoded ? atob(isAdminEncoded) : '';
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [cardItems, setCardItems] = useState([]);
    const [showArchived, setShowArchived] = useState(false);

    const buttons = [
        {
            onClick: () => setIsAddProductModalOpen(true),
            icon: <AddIcon />,
            marginRight: '1rem'
        },
        {
            onClick: () => setShowArchived(!showArchived),
            icon: <ArchiveIcon />,
            marginRight: '1rem'
        }
    ];

    const sizeShortcut = (size) => {
        const sizeMap = {
            'Small': 'S',
            'Medium': 'M',
            'Large': 'L',
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
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                                {showArchived ? 'Archived Products' : 'New Arrivals'}
                            </h1>

                            <div className="flex items-center">
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
                                        {cardItems.filter(item => showArchived ? item.archived : !item.archived).map((product) => (
                                            <div key={product.id} className="group relative">
                                                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                                                    <img
                                                        src={product.imageUrl1}
                                                        alt={product.product_name}
                                                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                                    />
                                                </div>

                                                <div className="mt-4 flex justify-between">
                                                    <div>
                                                        <h3 className="text-sm text-gray-700 font-bold">
                                                            <a href={`#${product.product_id}`}>
                                                                {product.product_name}
                                                            </a>
                                                        </h3>

                                                        <p className="mt-1 text-sm text-gray-500">
                                                            <span>{product.color}</span>
                                                            {product.variations.length > 1 && (
                                                                <>
                                                                    {", "}
                                                                    {product.variations
                                                                        .filter(variation => variation.color !== product.color)
                                                                        .map((variation, index, array) => (
                                                                            <span key={index}>
                                                                                {variation.color}{index < array.length - 1 ? ', ' : ''}
                                                                            </span>
                                                                        ))}
                                                                </>
                                                            )}
                                                        </p>

                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {product.variations.length > 1 && (
                                                                <div className="text-sm text-gray-500">
                                                                    {Array.from(new Set(product.variations.map(variation => sizeShortcut(variation.size)))).map((size, index, array) => (
                                                                        <span key={index}>
                                                                            {size}{index !== array.length - 1 && ', '}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </p>

                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-900 mb-2">{`Php ${product.price}`}</p>
                                                    </div>

                                                </div>
                                                <div className="text-right">
                                                    {isAdmin === '1' && (
                                                        <div className="flex justify-end">
                                                            {/* {product.archived ? (
                                                                <IconButton
                                                                    onClick={() => unarchiveProduct(product.product_id, product.product_name)}
                                                                >
                                                                    <VisibilityIcon />
                                                                </IconButton>
                                                            ) : (
                                                                <IconButton
                                                                    onClick={() => archiveProduct(product.product_id, product.product_name)}
                                                                >
                                                                    <ArchiveIcon />
                                                                </IconButton>
                                                            )} */}
                                                            <IconButton
                                                                color="error"
                                                                // onClick={() => deleteProduct(product.product_name, product.product_type)}
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
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    )
}
