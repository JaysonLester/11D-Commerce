import React, { useState } from 'react';
import Modal from 'react-modal';

export default function AddItemModal({ isOpen, closeModal, handleAddItem, itemData, handleInputChange }) {
    const [errors, setErrors] = useState({});
    const productTypeOptions = ["T-Shirt", "Shirt", "Hoodie", "Accessory"];
    const colorOptions = ["Red", "Blue", "Green", "Yellow", "Grey", "Black", "White", "Beige", "Brown", "Light Pink", "Light greige", "Light grey marl", "Dark green", "Light Beige", "Light Dark Brown"];
    const sizeOptions = ["XS", "Small", "Medium", "Large", "XL", "2XL", "3XL", "4XL"];

    const validate = () => {
        let tempErrors = {};
        tempErrors.item_name = itemData.item_name ? "" : "This field is required.";
        tempErrors.product_type = itemData.product_type ? "" : "This field is required.";
        tempErrors.color = itemData.color ? "" : "This field is required.";
        tempErrors.size = itemData.size ? "" : "This field is required.";
        tempErrors.category_code = itemData.category_code ? "" : "This field is required.";
        tempErrors.code = itemData.code ? "" : "This field is required.";
        tempErrors.quantity_to_restock = itemData.quantity_to_restock >= 0 ? "" : "This field is required.";
        tempErrors.available_quantity = itemData.available_quantity >= 0 ? "" : "This field is required.";

        if (itemData.available_quantity <= itemData.quantity_to_restock) {
            tempErrors.available_quantity = "Available Quantity must be higher than Quantity to Restock.";
        }

        setErrors({
            ...tempErrors
        });

        return Object.values(tempErrors).every(x => x === "");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            handleAddItem();
            closeModal();
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
                <div className="modal-container p-4 max-w-md bg-white rounded-lg shadow-lg w-full" style={{ overflow: 'auto', maxHeight: '90vh' }}>
                    <h2>Add Product</h2>
                    <form onSubmit={handleSubmit}>
                        {Object.values(errors).some(x => x !== "") && (
                            <div className="text-red-500 mb-4">
                                Please fill up all fields.
                            </div>
                        )}
                        <div className="mb-4">
                            <label htmlFor="item_name" className="block text-sm font-medium text-gray-600">
                                Item Name
                            </label>
                            <input
                                type="text"
                                name="item_name"
                                id="item_name"
                                value={itemData.item_name}
                                onChange={handleInputChange}
                                placeholder="Item Name"
                                className="border rounded-md p-2 w-full"
                            />
                            {errors.item_name && <div className="text-red-500">{errors.item_name}</div>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="product_type" className="block text-sm font-medium text-gray-600">
                                Product Type
                            </label>
                            <div className="relative">
                                <select
                                    name="product_type"
                                    id="product_type"
                                    value={itemData.product_type}
                                    onChange={handleInputChange}
                                    className="border rounded-md p-2 w-full appearance-none bg-transparent"
                                >
                                    <option value="" disabled hidden>Select Product Type</option>
                                    {productTypeOptions.map((type, index) => (
                                        <option key={index} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                            {errors.item_name && <div className="text-red-500">{errors.product_type}</div>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="color" className="block text-sm font-medium text-gray-600">
                                Color
                            </label>
                            <div className="relative">
                                <select
                                    name="color"
                                    id="color"
                                    value={itemData.color}
                                    onChange={handleInputChange}
                                    className="border rounded-md p-2 w-full appearance-none bg-transparent"
                                >
                                    <option value="" disabled hidden>Select Color</option>
                                    {colorOptions.map((color, index) => (
                                        <option key={index} value={color}>
                                            {color}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                            {errors.item_name && <div className="text-red-500">{errors.color}</div>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="size" className="block text-sm font-medium text-gray-600">
                                Size
                            </label>
                            <div className="relative">
                                <select
                                    name="size"
                                    id="size"
                                    value={itemData.size}
                                    onChange={handleInputChange}
                                    className="border rounded-md p-2 w-full appearance-none bg-transparent"
                                >
                                    <option value="" disabled hidden>Select Size</option>
                                    {sizeOptions.map((size, index) => (
                                        <option key={index} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                            {errors.item_name && <div className="text-red-500">{errors.size}</div>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="category_code" className="block text-sm font-medium text-gray-600">
                                Category Code
                            </label>
                            <input
                                type="text"
                                name="category_code"
                                id="category_code"
                                value={itemData.category_code}
                                onChange={handleInputChange}
                                placeholder="Category Code"
                                className="border rounded-md p-2 w-full"
                            />
                            {errors.item_name && <div className="text-red-500">{errors.category_code}</div>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="code" className="block text-sm font-medium text-gray-600">
                                Code
                            </label>
                            <input
                                type="text"
                                name="code"
                                id="code"
                                value={itemData.code}
                                onChange={handleInputChange}
                                placeholder="Code"
                                className="border rounded-md p-2 w-full"
                            />
                            {errors.item_name && <div className="text-red-500">{errors.code}</div>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="quantity_to_restock" className="block text-sm font-medium text-gray-600">
                                Quantity to Restock
                            </label>
                            <input
                                type="number"
                                name="quantity_to_restock"
                                id="quantity_to_restock"
                                value={10}
                                readOnly
                                onChange={handleInputChange}
                                placeholder="Available Quantity"
                                min="10"
                                className="border rounded-md p-2 w-full text-gray-600"
                            />
                            {errors.item_name && <div className="text-red-500">{errors.quantity_to_restock}</div>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="available_quantity" className="block text-sm font-medium text-gray-600">
                                Available Quantity
                            </label>
                            <input
                                type="number"
                                name="available_quantity"
                                id="available_quantity"
                                value={itemData.available_quantity}
                                onChange={handleInputChange}
                                placeholder="Available Quantity"
                                min="10"
                                className="border rounded-md p-2 w-full"
                            />
                            {errors.item_name && <div className="text-red-500">{errors.available_quantity}</div>}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-rose-600 text-white rounded-md px-4 py-2 mr-2 hover:bg-rose-500"
                            >
                                Add Product
                            </button>
                            <button
                                type="button"
                                className="bg-gray-600 text-white rounded-md px-4 py-2 mr-2 hover:bg-gray-500"
                                onClick={closeModal}
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
