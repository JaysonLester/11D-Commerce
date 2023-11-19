import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

export default function AddProductModal({ isOpen, closeModal }) {
    const [categoryCodes, setCategoryCodes] = useState([]);
    const [selectedCategoryCode, setSelectedCategoryCode] = useState('');
    const [productNames, setProductNames] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [formData, setFormData] = useState({
        category_code: '',
        product_name: '',
        product_type: '',
        color: '',
        size: '',
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Use axios to make a POST request
            await axios.post('http://localhost:3001/api/product', formData);

            // Optionally, you can update your local state or perform other actions after a successful insertion

            // Close the modal
            closeModal();
        } catch (error) {
            console.error('Error adding product:', error);
            // Handle errors as needed
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === "product_name" || name === "category_code") {
            fetchColors(selectedCategoryCode, value);
            fetchSizes(selectedCategoryCode, value, formData.color); 
        } else if (name === "color") {
            fetchSizes(selectedCategoryCode, formData.product_name, value); 
        }
    };

    useEffect(() => {
        fetchCategoryCodes();
    }, []);

    useEffect(() => {
        if (selectedCategoryCode) {
            fetchProductNames(selectedCategoryCode);
            fetchProductTypes(selectedCategoryCode);
            fetchColors(selectedCategoryCode);
            fetchSizes(selectedCategoryCode);
        }
    }, [selectedCategoryCode]);

    const fetchCategoryCodes = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/categoryCode');
            const data = await response.json();
            setCategoryCodes(data);
        } catch (error) {
            console.error('Error fetching category codes:', error);
        }
    };

    const handleCategoryCodeChange = (event) => {
        const { value } = event.target;
        setSelectedCategoryCode(value);
        handleInputChange(event);
    };

    const fetchProductNames = async (categoryCode) => {
        try {
            console.log('Fetching product names for category code:', categoryCode);

            const url = `http://localhost:3001/api/inventory?category_code=${categoryCode}`;
            console.log('Fetch URL:', url);

            const response = await fetch(url);
            const data = await response.json();
            console.log('API response for product names:', data);

            const uniqueNames = [...new Set(data
                .filter((item) => item.category_code === categoryCode)
                .map((item) => item.item_name))];

            setProductNames(uniqueNames);
        } catch (error) {
            console.error('Error fetching product names:', error);
        }
    };

    const fetchProductTypes = async (categoryCode) => {
        try {
            console.log('Fetching product types for category code:', categoryCode);

            const url = `http://localhost:3001/api/inventory?category_code=${categoryCode}`;
            console.log('Fetch URL:', url);

            const response = await fetch(url);
            const data = await response.json();
            console.log('API response for product types:', data);

            const uniqueTypes = [...new Set(data
                .filter((item) => item.category_code === categoryCode)
                .map((item) => item.product_type))];

            setProductTypes(uniqueTypes);
        } catch (error) {
            console.error('Error fetching product types:', error);
        }
    };

    const fetchColors = async (categoryCode, productName) => {
        try {
            console.log('Fetching colors for category code and product name:', categoryCode, productName);

            const url = `http://localhost:3001/api/inventory?category_code=${categoryCode}&item_name=${productName}`;
            console.log('Fetch URL:', url);

            const response = await fetch(url);
            const data = await response.json();
            console.log('API response for colors:', data);

            const uniqueColors = [...new Set(data
                .filter((item) => item.category_code === categoryCode && item.item_name === productName)
                .map((item) => item.color))];

            setColors(uniqueColors);
        } catch (error) {
            console.error('Error fetching colors:', error);
        }
    };

    const fetchSizes = async (categoryCode, productName, color) => {
        try {
            console.log('Fetching sizes for category code, product name, and color:', categoryCode, productName, color);

            const url = `http://localhost:3001/api/inventory?category_code=${categoryCode}&item_name=${productName}&color=${color}`;
            console.log('Fetch URL:', url);

            const response = await fetch(url);
            const data = await response.json();
            console.log('API response for sizes:', data);

            const uniqueSizes = [...new Set(data
                .filter((item) => item.category_code === categoryCode && item.item_name === productName && item.color === color)
                .map((item) => item.size))];

            setSizes(uniqueSizes);
        } catch (error) {
            console.error('Error fetching sizes:', error);
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
                <div className="modal-container p-4 max-w-md bg-white rounded-lg shadow-lg w-full">
                    <h2>Add Product</h2>
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
                                    className="border rounded-md p-2 w-full appearance-none bg-transparent"
                                >
                                    <option value="" disabled selected>
                                        Select Category Code
                                    </option>
                                    {categoryCodes.map((code) => (
                                        <option key={code} value={code}>
                                            {code}
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
                            <label htmlFor="product_name" className="block text-sm font-medium text-gray-600">
                                Product Name
                            </label>
                            <div className="relative">
                                <select
                                    name="product_name"
                                    id="product_name"
                                    onChange={handleInputChange}
                                    className="border rounded-md p-2 w-full appearance-none bg-transparent"
                                >
                                    <option value="" disabled selected>
                                        Select Product Name
                                    </option>
                                    {productNames.map((name) => (
                                        <option key={name} value={name}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg
">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="size" className="block text-sm font-medium text-gray-600">
                                Product Type
                            </label>
                            <div className="relative">
                                <select
                                    name="product_type"
                                    id="product_type"
                                    onChange={handleInputChange}
                                    className="border rounded-md p-2 w-full appearance-none bg-transparent"
                                >
                                    <option value="" disabled selected>
                                        Select Product Type
                                    </option>
                                    {productTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    {/* Adjust the following line to match your design */}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg
">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="size" className="block text-sm font-medium text-gray-600">
                                Color
                            </label>
                            <div className="relative">
                                <select
                                    name="color"
                                    id="color"
                                    onChange={handleInputChange}
                                    className="border rounded-md p-2 w-full appearance-none bg-transparent"
                                >
                                    <option value="" disabled selected>
                                        Select Color
                                    </option>
                                    {colors.map((color) => (
                                        <option key={color} value={color}>
                                            {color}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    {/* Adjust the following line to match your design */}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg
">
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
                                    name="size"
                                    id="size"
                                    onChange={handleInputChange}
                                    className="border rounded-md p-2 w-full appearance-none bg-transparent"
                                >
                                    <option value="" disabled selected>
                                        Select Size
                                    </option>
                                    {sizes.map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
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
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-600">
                                Image URL
                            </label>
                            <input
                                type="text"
                                name="imageUrl"
                                id="imageUrl"
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
                                className="bg-gray-400 text-white rounded-md px-4 py-2 hover:bg-gray-300"
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
