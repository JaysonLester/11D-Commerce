import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

export default function AddProductModal({ isOpen, closeModal, handleAddProduct }) {
    const [categoryCodes, setCategoryCodes] = useState([]);
    const [selectedCategoryCode, setSelectedCategoryCode] = useState('');
    const [productNames, setProductNames] = useState([]);

    const [formData, setFormData] = useState({
        // Initialize with the default form data
        category_code: '',
        product_name: '',
        // ... other form fields
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    useEffect(() => {
        fetchCategoryCodes();
    }, []);

    useEffect(() => {
        if (selectedCategoryCode) {
            fetchProductNames(selectedCategoryCode);
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
        // Optionally, you can call handleInputChange here to handle other changes
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
    
            const names = data.map((item) => item.item_name);
            setProductNames(names);
        } catch (error) {
            console.error('Error fetching product names:', error);
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
                    <form onSubmit={handleAddProduct}>
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
                                        xmlns="http://www.w3.org/2000/svg
"
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
                                    {/* {productTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))} */}
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
                                    {/* {colors.map((color) => (
                                        <option key={color} value={color}>
                                            {color}
                                        </option>
                                    ))} */}
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
                                    {/* {sizes.map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))} */}
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