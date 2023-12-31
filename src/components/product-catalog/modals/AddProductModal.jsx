import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Radio, TextField, TextareaAutosize, FormControl, Button, MenuItem, Checkbox, FormControlLabel, Box, Container, Switch } from '@mui/material';

export default function AddProductModal({ isOpen, closeModal }) {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({});
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

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

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`http://localhost:3001/api/update-products/${selectedProduct.product_id}`, data);
            if ([200, 201, 204].includes(response.status)) {
                console.log('Data inserted successfully.');
                reset();
                closeModal();
                window.location.reload();
            }
        } catch (error) {
            console.error('Failed to insert product:', error);
        }
    };

    const handleInputChange = (event) => {
        const target = event.target;

        if (target.name === 'product_id') {
            const selectedProduct = products.find(product => product.product_id === Number(target.value));
            setSelectedProduct(selectedProduct ? selectedProduct : {});
        } else {
            setSelectedProduct(prevState => ({
                ...prevState,
                [target.name]: target.type === 'checkbox' || target.type === 'radio' ? (target.checked ? 1 : 0) : target.value,
            }));
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Add Product Modal"
            className="modal"
        >
            <Box p={2}>
                <Container
                    maxWidth="xs"
                    style={{
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '16px',
                        backgroundColor: '#fff'
                    }}
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box mb={3}>
                            <fieldset>
                                <legend>Product Details</legend>
                                <Box mb={2} mt={1}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Select Product"
                                        value={selectedProduct ? selectedProduct.product_id : ''}
                                        onChange={handleInputChange}
                                        name="product_id"
                                    >
                                        {products.filter(product => product.is_selected === 0).map((product) => (
                                            <MenuItem key={product.product_id} value={product.product_id}>
                                                {product.product_name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    {errors.product_id && <p style={{ color: 'red' }}>This field is required</p>}
                                </Box>
                                <Box mb={2}>
                                    <TextField label="Price" name="price" onChange={handleInputChange} fullWidth {...register('price', { required: true, pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })} />
                                    {errors.price && <p style={{ color: 'red' }}>Please enter a valid price</p>}
                                </Box>
                                <Box mb={2}>
                                    <TextareaAutosize
                                        minRows={3}
                                        maxRows={6}
                                        aria-label="description"
                                        placeholder="Description"
                                        name="description"
                                        onChange={handleInputChange}
                                        style={{
                                            width: '100%',
                                            padding: '18.5px 14px',
                                            border: '1px solid rgba(0, 0, 0, 0.23)',
                                            borderRadius: '4px'
                                        }}
                                        {...register('description', { required: true })}
                                    />
                                    {errors.description && <p style={{ color: 'red' }}>This field is required</p>}
                                </Box>
                                <Box mb={2}>
                                    <FormControl fullWidth>
                                        <TextField
                                            select
                                            label="Target Gender"
                                            labelId="target-gender-label"
                                            name="target_gender"
                                            onChange={handleInputChange}
                                            {...register('target_gender', { required: true })}
                                        >
                                            <MenuItem value="male">Male</MenuItem>
                                            <MenuItem value="female">Female</MenuItem>
                                            <MenuItem value="unisex">Unisex</MenuItem>
                                        </TextField>
                                        {errors.target_gender && <p style={{ color: 'red' }}>This field is required</p>}
                                    </FormControl>
                                </Box>
                            </fieldset>
                        </Box>
                        <Box mb={3}>
                            <fieldset>
                                <legend>Product Images</legend>
                                <Box mb={2} mt={1}>
                                    <TextField label="Image URL 1" name="image_url_1" onChange={handleInputChange} fullWidth {...register('image_url_1', { required: true, pattern: /^(ftp|http|https):\/\/[^ "]+$/ })} />
                                    {errors.image_url_1 && <p style={{ color: 'red' }}>Please enter a valid URL</p>}
                                </Box>
                                <Box mb={2}>
                                    <TextField label="Image URL 2" name="image_url_2" onChange={handleInputChange} fullWidth {...register('image_url_2', { required: true, pattern: /^(ftp|http|https):\/\/[^ "]+$/ })} />
                                    {errors.image_url_2 && <p style={{ color: 'red' }}>Please enter a valid URL</p>}
                                </Box>
                                <Box mb={2}>
                                    <TextField label="Image URL 3" name="image_url_3" onChange={handleInputChange} fullWidth {...register('image_url_3', { required: true, pattern: /^(ftp|http|https):\/\/[^ "]+$/ })} />
                                    {errors.image_url_3 && <p style={{ color: 'red' }}>Please enter a valid URL</p>}
                                </Box>
                                <Box mb={2}>
                                    <TextField label="Image URL 4" name="image_url_4" onChange={handleInputChange} fullWidth {...register('image_url_4', { required: true, pattern: /^(ftp|http|https):\/\/[^ "]+$/ })} />
                                    {errors.image_url_4 && <p style={{ color: 'red' }}>Please enter a valid URL</p>}
                                </Box>
                            </fieldset>
                        </Box>
                        <Box mb={3}>
    <fieldset>
        <legend>Product Flags</legend>
        <Box mb={1}>
            <FormControlLabel
                control={
                    <Switch 
                        {...register('is_limited_edition')} 
                        name="is_limited_edition" 
                        checked={selectedProduct.is_limited_edition === 1} 
                        onChange={handleInputChange} 
                    />
                }
                label="Limited Edition"
            />
        </Box>
        <Box mb={1}>
            <FormControlLabel
                control={
                    <Switch 
                        {...register('is_on_sale')} 
                        name="is_on_sale" 
                        checked={selectedProduct.is_on_sale === 1} 
                        onChange={handleInputChange} 
                    />
                }
                label="On Sale"
            />
        </Box>
        <Box mb={1}>
            <FormControlLabel
                control={
                    <Switch 
                        {...register('is_discounted')} 
                        name="is_discounted" 
                        checked={selectedProduct.is_discounted === 1} 
                        onChange={handleInputChange} 
                    />
                }
                label="Discounted"
            />
        </Box>
    </fieldset>
</Box>
                        <Box mb={2}>
                            <FormControl component="fieldset">
                                <legend>Display on the Page?</legend>
                                <FormControlLabel
                                    control={
                                        <Radio
                                            {...register('is_displayed')}
                                            checked={selectedProduct.is_displayed === 1}
                                            onChange={handleInputChange}
                                            name="is_displayed"
                                            value={1}
                                        />
                                    }
                                    label="Yes"
                                />
                                <FormControlLabel
                                    control={
                                        <Radio
                                            {...register('is_displayed')}
                                            checked={selectedProduct.is_displayed === 0 || selectedProduct.is_displayed === undefined}
                                            onChange={handleInputChange}
                                            name="is_displayed"
                                            value={0}
                                        />
                                    }
                                    label="No"
                                />
                            </FormControl>
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
