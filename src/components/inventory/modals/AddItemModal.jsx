import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Modal from 'react-modal';
import axios from 'axios';

export default function AddItemModal({ isOpen, closeModal }) {
    const [errors, setErrors] = useState({});
    const [productTypeOptions, setProductTypeOptions] = useState([]);
    const [colorOptions, setColorOptions] = useState([]);
    const [sizeOptions, setSizeOptions] = useState([]);
    const [sizes, setSizes] = useState([{ size: '', quantity: '' }]);
    const [errorIndex, setErrorIndex] = useState(null);
    const [itemData, setItemData] = useState({
        item_name: '',
        category_code: '',
        code: '',
        quantity_to_restock: '',
        available_quantity: '',
    });

    //sizes
    useEffect(() => {
        const fetchSizes = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/sizes');
                setSizeOptions(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchSizes();
    }, []);

    //colors
    useEffect(() => {
        const fetchSizes = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/colors');
                setColorOptions(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchSizes();
    }, []);

    //product types
    useEffect(() => {
        const fetchSizes = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/product-types');
                setProductTypeOptions(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchSizes();
    }, []);

    const handleSizeChange = (event, index) => {
        const newSize = event.target.value;

        if (sizes.some(sizeObj => sizeObj.size === newSize)) {
            setErrors(prevErrors => ({ ...prevErrors, size: 'This size already exists.' }));
            setErrorIndex(index);
            return;
        }

        const newSizes = [...sizes];
        newSizes[index].size = newSize;
        setSizes(newSizes);
        setErrors(prevErrors => ({ ...prevErrors, size: null }));
        setErrorIndex(null);
    };

    const calculateTotalQuantity = () => {
        let totalQuantity = 0;
        sizes.forEach(sizeObj => {
            totalQuantity += Number(sizeObj.quantity);
        });
        return totalQuantity;
    }

    const handleQuantityChange = (event, index) => {
        const newSizes = [...sizes];
        newSizes[index].quantity = event.target.value;
        setSizes(newSizes);

        const totalQuantity = calculateTotalQuantity();
        setItemData(prevData => ({ ...prevData, available_quantity: totalQuantity }));
    }

    const handleAddSize = () => {
        setSizes([...sizes, { size: '', quantity: '' }]);
    };

    const handleRemoveSize = (index) => {
        const newSizes = [...sizes];
        newSizes.splice(index, 1);
        setSizes(newSizes);
    };


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setItemData(prevData => {
            if (prevData[name] === value) {
                return prevData;
            }
            return { ...prevData, [name]: value };
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (Object.values(errors).some(error => error !== null)) {
            return;
        }
        const data = {
            item_name: itemData.item_name,
            product_type: itemData.product_type,
            color: itemData.color,
            category_code: itemData.category_code,
            code: itemData.code,
            sizes: sizes.map(sizeObj => ({
                size_id: sizeObj.size,
                quantity_to_restock: itemData.quantity_to_restock,
                available_quantity: sizeObj.quantity,
            })),
            quantity_to_restock: itemData.quantity_to_restock,
            available_quantity: itemData.available_quantity,
        };

        try {
            const response = await axios.post('http://localhost:3001/api/inventory', data);
            console.log(response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
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
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="item_name"
                                    label="Item Name"
                                    value={itemData.item_name}
                                    onChange={handleInputChange}
                                    error={Boolean(errors.item_name)}
                                    helperText={errors.item_name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    fullWidth
                                    name="product_type"
                                    label="Product Type"
                                    value={itemData.product_type}
                                    onChange={handleInputChange}
                                    error={Boolean(errors.product_type)}
                                >
                                    {productTypeOptions.map((option, index) => (
                                        <MenuItem key={index} value={option.product_type_id}>
                                            {option.product_type_name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    fullWidth
                                    name="color"
                                    label="Color"
                                    value={itemData.color}
                                    onChange={handleInputChange}
                                    helperText={errors.color}
                                    error={Boolean(errors.color)}
                                >
                                    {colorOptions.map((option, index) => (
                                        <MenuItem key={option.color_id} value={option.color_id}>
                                            {option.color_name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="category_code"
                                    label="Category Code"
                                    value={itemData.category_code}
                                    onChange={handleInputChange}
                                    error={Boolean(errors.category_code)}
                                    helperText={errors.category_code}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="code"
                                    label="Code"
                                    value={itemData.code}
                                    onChange={handleInputChange}
                                    error={Boolean(errors.code)}
                                    helperText={errors.code}
                                />
                            </Grid>

                            {sizes.map((sizeObj, index) => (
                                <Grid item xs={12} sm={12} md={12} key={index}>
                                    <Card variant="outlined" style={{ width: '100%' }}>
                                        <CardContent>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <FormControl variant="outlined" fullWidth>
                                                        <InputLabel id={`size-label-${index}`} style={{ backgroundColor: '#fff', padding: '0px 8px', marginLeft: '-4px' }}>
                                                            Size
                                                        </InputLabel>
                                                        <Select
                                                            labelId={`size-label-${index}`}
                                                            id={`size_${index}`}
                                                            value={sizeObj.size}
                                                            onChange={(event) => handleSizeChange(event, index)}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                                style: { backgroundColor: '#fff' },
                                                            }}
                                                        >
                                                            {sizeOptions.map((option, optionIndex) => (
                                                                <MenuItem key={option.size_id} value={option.size_id}>
                                                                    {option.size_name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        variant="outlined"
                                                        type="number"
                                                        name="quantity"
                                                        id={`quantity_${index}`}
                                                        value={sizeObj.quantity}
                                                        onChange={(event) => handleQuantityChange(event, index)}
                                                        placeholder="Quantity"
                                                        fullWidth
                                                        margin="normal"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    {errors.size && errorIndex === index && <Typography color="error">{errors.size}</Typography>}
                                                    <IconButton
                                                        onClick={() => handleRemoveSize(index)}
                                                        style={{ color: 'red' }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    {index === sizes.length - 1 && (
                                                        <IconButton
                                                            onClick={handleAddSize}
                                                            style={{ color: 'black' }}
                                                        >
                                                            <AddCircleOutlineIcon />
                                                        </IconButton>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="quantity_to_restock"
                                    label="Quantity to Restock"
                                    value={itemData.quantity_to_restock}
                                    onChange={(event) => {
                                        const value = parseInt(event.target.value);
                                        if (isNaN(value) || value < 0) {
                                            setErrors(prevErrors => ({ ...prevErrors, quantity_to_restock: 'Quantity to restock must be a positive number.' }));
                                        } else {
                                            handleInputChange(event);
                                        }
                                    }}
                                    error={Boolean(errors.quantity_to_restock)}
                                    helperText={errors.quantity_to_restock}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="available_quantity"
                                    label="Available Quantity"
                                    value={itemData.available_quantity}
                                    onChange={(event) => {
                                        const value = parseInt(event.target.value);
                                        if (isNaN(value) || value < 0) {
                                            setErrors(prevErrors => ({ ...prevErrors, available_quantity: 'Available quantity must be a positive number.' }));
                                        } else {
                                            handleInputChange(event);
                                        }
                                    }}
                                    error={Boolean(errors.available_quantity)}
                                    helperText={errors.available_quantity}
                                />
                            </Grid>
                            <Grid item xs={12}>
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
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </div>
        </Modal>
    );
}
