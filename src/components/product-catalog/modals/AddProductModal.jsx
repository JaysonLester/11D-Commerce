import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

export default function AddProductModal({ isOpen, closeModal }) {
    const [inventoryData, setInventoryData] = useState([]);
    const [selectedCategoryCode, setSelectedCategoryCode] = useState('');
    const [sizesData, setSizesData] = useState([]);
    const [selectedProductCode, setSelectedProductCode] = useState('');
    const [productNames, setProductNames] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [formData, setFormData] = useState({
        item_name: '',
        code: '',
        category_code: '',
        colors: '',
        sizes: [],
        product_type: '',
        image_url_1: '',
        image_url_2: '',
        image_url_3: '',
        image_url_4: '',
        price: 0.00,
        description: '',
        is_archived: false,
        is_limited_edition: false,
        is_on_sale: false,
        is_discounted: false,
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const price = parseFloat(formData.price);
            const dataToSend = { ...formData, price: isNaN(price) ? 0 : price };
            console.log('Data to send:', dataToSend); // Log the data before sending

            await axios.post('http://localhost:3001/api/products', dataToSend);

            closeModal();
            window.location.reload();
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    useEffect(() => {
        fetchInventoryData();
    }, []);

    useEffect(() => {
        fetchSizesData();
    }, []);

    useEffect(() => {
        if (selectedCategoryCode) {
            fetchProductNames(selectedCategoryCode);
            fetchProductTypes(selectedCategoryCode);
            fetchColors(selectedCategoryCode);
            fetchSizes(selectedCategoryCode);
        }
    }, [selectedCategoryCode]);

    const fetchInventoryData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/inventory');
            setInventoryData(response.data);
        } catch (error) {
            console.error('Error fetching inventory data:', error);
        }
    };

    const fetchSizesData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/sizes');
            setSizesData(response.data);
        } catch (error) {
            console.error('Error fetching sizes data:', error);
        }
    };

    const handleCategoryCodeChange = (event) => {
        const { value } = event.target;
        setSelectedCategoryCode(value);
        handleInputChange(event);
    };

    const handleProductCodeChange = (event) => {
        const { value } = event.target;
        setSelectedProductCode(value);

        const selectedProduct = inventoryData.find((item) => item.code === value);

        if (selectedProduct) {
            setFormData({
                ...formData,
                item_name: selectedProduct.item_name || '',
                code: selectedProduct.code || '',
                category_code: selectedProduct.category_code || '',
                product_type: selectedProduct.product_type || '',
                colors: selectedProduct.color || '',
                sizes: selectedProduct.sizes || [],
            });
        }
    };

    const fetchProductNames = (categoryCode) => {
        const selectedCategory = inventoryData.find((item) => item.category_code === categoryCode);
        if (selectedCategory) {
            const uniqueNames = [...new Set(selectedCategory.sizes.map((sizes) => sizes.item_name))];
            setProductNames(uniqueNames);
        }
    };

    const fetchProductTypes = (categoryCode) => {
        const selectedCategory = inventoryData.find((item) => item.category_code === categoryCode);
        if (selectedCategory) {
            const uniqueTypes = [...new Set(selectedCategory.sizes.map((sizes) => sizes.product_types))];
            setProductTypes(uniqueTypes);
        }
    };

    const fetchColors = (categoryCode) => {
        const selectedCategory = inventoryData.find((item) => item.category_code === categoryCode);
        if (selectedCategory) {
            const uniqueColors = [...new Set(selectedCategory.sizes.map((sizes) => sizes.colors))];
            setColors(uniqueColors);
        }
    };

    const fetchSizes = (categoryCode, productName, color) => {
        const selectedCategory = inventoryData.find((item) => item.category_code === categoryCode);
        if (selectedCategory) {
            const uniqueSizes = [...new Set(selectedCategory.sizes
                .filter((size) => size.product_name === productName && size.color === color)
                .map((size) => size.size_name))];
            setSizes(uniqueSizes);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Add Product Modal"
            className="modal"
        >
            <div className="fixed inset-0 flex items-center justify-center bg-white-800 bg-opacity-40">
                <div className="modal-container p-4 max-w-md bg-white rounded-lg shadow-lg w-full overflow-y-auto max-h-[90vh]">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                htmlFor="category_code"
                                className="block text-sm font-medium text-gray-600"
                            >
                                Category Code
                            </label>
                            <div className="relative">
                                <select
                                    name="category_code"
                                    id="category_code"
                                    onChange={handleCategoryCodeChange}
                                    value={formData.category_code}
                                    className="border rounded-md p-2 w-full appearance-none bg-transparent"
                                >
                                    <option value="" disabled selected>
                                        Select Category Code
                                    </option>
                                    {inventoryData.map((item) => (
                                        <option key={item.category_code} value={item.category_code}>
                                            {item.category_code}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="category_code"
                                className="block text-sm font-medium text-gray-600"
                            >
                                Product Code
                            </label>
                            <div className="relative">
                                <select
                                    name="code"
                                    id="code"
                                    onChange={handleProductCodeChange}
                                    className="border rounded-md p-2 w-full appearance-none bg-transparent"
                                >
                                    <option value="" disabled selected>
                                        Select Product Code
                                    </option>
                                    {inventoryData.map((item) => (
                                        <option key={item.code} value={item.code}>
                                            {item.code}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="item_name" className="block text-sm font-medium text-gray-600">
                                Product Name
                            </label>
                            <div className="relative">
                                <select
                                    name="item_name"
                                    id="item_name"
                                    onChange={handleInputChange}
                                    value={formData.item_name}
                                    className="border rounded-md p-2 w-full appearance-none bg-transparent"
                                >
                                    <option value="" disabled selected>
                                        Select Product Name
                                    </option>
                                    {inventoryData.map((item) => (
                                        <option key={item.item_name} value={item.item_name}>
                                            {item.item_name}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="product_type" className="block text-sm font-medium text-gray-600">
                                Product Type
                            </label>
                            <div className="relative">
                                <select
                                    name="product_type"
                                    id="product_type"
                                    onChange={handleInputChange}
                                    value={formData.product_type}
                                    className="border rounded-md p-2 w-full appearance-none bg-transparent"
                                >
                                    <option value="" disabled>
                                        Select Product Type
                                    </option>
                                    {inventoryData.map((item) => (
                                        <option key={item.product_type} value={item.product_type}>
                                            {item.product_type}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="color" className="block text-sm font-medium text-gray-600">
                                Color
                            </label>
                            <div className="relative">
                                <select
                                    name="colors"
                                    id="colors"
                                    onChange={handleInputChange}
                                    value={formData.colors}
                                    className="border rounded-md p-2 w-full appearance-none bg-transparent"
                                >
                                    <option value="" disabled>
                                        Select Color
                                    </option>
                                    {inventoryData.map((item) => (
                                        <option key={item.color} value={item.color}>
                                            {item.color}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="size" className="block text-sm font-medium text-gray-600">
                                Size
                            </label>
                            <div className="relative">
                                <select
                                    name="sizes"
                                    id="sizes"
                                    onChange={handleInputChange}
                                    value={formData.sizes}
                                    className="border rounded-md p-2 w-full appearance-none bg-transparent"
                                >
                                    <option value="" disabled>
                                        Select Size
                                    </option>
                                    {sizes.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-600">
                                Price
                            </label>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                onChange={handleInputChange}
                                value={formData.price}
                                min="0"
                                className="border rounded-md p-2 w-full"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-600">
                                Description
                            </label>
                            <input
                                type="text"
                                name="description"
                                id="description"
                                onChange={handleInputChange}
                                className="border rounded-md p-2 w-full"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="imageUrl1" className="block text-sm font-medium text-gray-600">
                                Image One
                            </label>
                            <input
                                type="text"
                                name="imageUrl1"
                                id="imageUrl1"
                                onChange={handleInputChange}
                                className="border rounded-md p-2 w-full"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="imageUrl2" className="block text-sm font-medium text-gray-600">
                                Image Two
                            </label>
                            <input
                                type="text"
                                name="imageUrl2"
                                id="imageUrl2"
                                onChange={handleInputChange}
                                className="border rounded-md p-2 w-full"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="imageUrl3" className="block text-sm font-medium text-gray-600">
                                Image Three
                            </label>
                            <input
                                type="text"
                                name="imageUrl3"
                                id="imageUrl3"
                                onChange={handleInputChange}
                                className="border rounded-md p-2 w-full"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="imageUrl4" className="block text-sm font-medium text-gray-600">
                                Image Four
                            </label>
                            <input
                                type="text"
                                name="imageUrl4"
                                id="imageUrl4"
                                onChange={handleInputChange}
                                className="border rounded-md p-2 w-full"
                            />
                        </div>

                        {/* (Other input fields similar to the original modal) */}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-rose-600 text-white rounded-md px-4 py-2 mr-2 hover:bg-rose-500"
                            >
                                Add Product
                            </button>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="bg-zinc-900 text-white rounded-md px-4 py-2 hover:bg-zinc-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}