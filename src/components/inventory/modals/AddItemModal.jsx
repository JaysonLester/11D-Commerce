import React from 'react';
import Modal from 'react-modal';

export default function AddItemModal({ isOpen, closeModal, handleAddItem, itemData, handleInputChange }) {
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
                    <form onSubmit={closeModal}>
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
                                    <option value="" disabled selected hidden>Select Product Type</option>
                                    <option value="T-Shirt">T-Shirt</option>
                                    <option value="Shirt">Shirt</option>
                                    <option value="Hoodie">Hoodie</option>
                                    <option value="Accessory">Accessory</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    {/* Adjust the following line to match your design */}
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
                            <input
                                type="text"
                                name="color"
                                id="color"
                                value={itemData.color}
                                onChange={handleInputChange}
                                placeholder="Color"
                                className="border rounded-md p-2 w-full"
                            />
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
                                    <option value="" disabled selected hidden>Select Size</option>
                                    <option value="XS">XS</option>
                                    <option value="Small">Small</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Large">Large</option>
                                    <option value="XL">XL</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    {/* Adjust the following line to match your design */}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
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
                        </div>

                        <div className="mb-4">
                            <label htmlFor="stock_available" className="block text-sm font-medium text-gray-600">
                                Stock Available
                            </label>
                            <input
                                type="number"
                                name="stock_available"
                                id="stock_available"
                                value={itemData.stock_available}
                                onChange={handleInputChange}
                                placeholder="Stock Available"
                                className="border rounded-md p-2 w-full"
                            />
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
                                className="border rounded-md p-2 w-full"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleAddItem}
                                className="bg-rose-600 text-white rounded-md px-4 py-2 mr-2 hover:bg-rose-500"
                            >
                                Add Product
                            </button>
                            <button className="bg-gray-400 text-white rounded-md px-4 py-2 hover:bg-gray-300">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}
