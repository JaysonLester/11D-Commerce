import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { TextField, FormControl, Button, MenuItem, Checkbox, FormControlLabel, Box, Container } from '@mui/material';

export default function AddProductModal({ isOpen, closeModal }) {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

    };

    const handleInputChange = (event) => {
        if (event.target.name === 'product_id') {
            const selectedProduct = products.find(product => product.product_id === Number(event.target.value));
            setSelectedProduct(selectedProduct);
        } else {
            setSelectedProduct({
                ...selectedProduct,
                [event.target.name]: event.target.value,
            });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Add Product Modal"
            className="modal"
        >
            <Box p={2}>            <Container

                maxWidth="xs"
                style={{
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: '16px',
                    backgroundColor: '#fff'
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Box mb={3}>
                        <fieldset>
                            <legend>Product Details</legend>
                            <Box mb={2}>
                                <TextField
                                    select
                                    label="Product"
                                    name="product_id"
                                    value={selectedProduct.product_id || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                >
                                    {products.map((product) => (
                                        <MenuItem key={product.product_id} value={product.product_id}>
                                            {product.product_name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                            <Box mb={2}>
                                <TextField label="Price" name="price" onChange={handleInputChange} fullWidth />
                            </Box>
                            <Box mb={2}>
                                <TextField label="Description" name="description" onChange={handleInputChange} fullWidth />
                            </Box>
                            <Box mb={2}>
                                <FormControl fullWidth>
                                    <TextField
                                        select
                                        label="Target Gender"
                                        labelId="target-gender-label"
                                        name="target_gender"
                                        onChange={handleInputChange}
                                    >
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="unisex">Unisex</MenuItem>
                                    </TextField>
                                </FormControl>
                            </Box>
                        </fieldset>
                    </Box>
                    <Box mb={3}>
                        <fieldset>
                            <legend>Product Images</legend>
                            <Box mb={2}>
                                <TextField label="Image URL 1" name="image_url_1" onChange={handleInputChange} fullWidth />
                            </Box>
                            <Box mb={2}>
                                <TextField label="Image URL 2" name="image_url_2" onChange={handleInputChange} fullWidth />
                            </Box>
                            <Box mb={2}>
                                <TextField label="Image URL 3" name="image_url_3" onChange={handleInputChange} fullWidth />
                            </Box>
                            <Box mb={2}>
                                <TextField label="Image URL 4" name="image_url_4" onChange={handleInputChange} fullWidth />
                            </Box>
                        </fieldset>
                    </Box>
                    <Box mb={3}>
                        <fieldset>
                            <legend>Product Flags</legend>
                            <Box mb={2}>
                                <FormControlLabel
                                    control={<Checkbox name="is_limited_edition" onChange={handleInputChange} />}
                                    label="Is Limited Edition"
                                />
                            </Box>
                            <Box mb={2}>
                                <FormControlLabel
                                    control={<Checkbox name="is_on_sale" onChange={handleInputChange} />}
                                    label="Is On Sale"
                                />
                            </Box>
                            <Box mb={2}>
                                <FormControlLabel
                                    control={<Checkbox name="is_discounted" onChange={handleInputChange} />}
                                    label="Is Discounted"
                                />
                            </Box>
                        </fieldset>
                    </Box>
                    <Box mt={3}>
                        <div className="flex justify-end">
                            <Button
                                variant="contained"
                                style={{ backgroundColor: 'black', color: 'white', margin: '10px' }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'black'}
                                type="submit">
                                Submit
                            </Button>
                            <Button
                                variant="contained"
                                style={{ backgroundColor: 'red', color: 'white', margin: '10px' }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#b30000'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'red'}
                                onClick={closeModal}>
                                Cancel
                            </Button>
                        </div>
                    </Box>
                </form>
            </Container>
            </Box>

        </Modal>
    );
}
