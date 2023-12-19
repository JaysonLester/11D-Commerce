// UpdateItemModal.jsx
import React from 'react';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, TextField, DialogActions, Typography, Button, Card, CardContent, Grid, MenuItem, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';

export default function UpdateItemModal({ isOpen, closeModal, itemData, setItemData }) {

  const [productTypeOptions, setProductTypeOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

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
    const fetchColors = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/colors');
        setColorOptions(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchColors();
  }, []);

  //product types
  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/product-types');
        setProductTypeOptions(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchProductTypes();
  }, []);

  const handleSizeChange = (index, property, event) => {
    setItemData((currentItemData) => {
      const newSizes = [...currentItemData.sizes];
      if (property === 'size_name') {
        const selectedSize = sizeOptions.find(size => size.size_name === event.target.value);
        if (selectedSize) {
          newSizes[index]['size_id'] = selectedSize.size_id;
          newSizes[index]['size_name'] = selectedSize.size_name;
        } else {
          newSizes[index]['size_name'] = event.target.value;
        }
      } else {
        newSizes[index][property] = event.target.value;
      }
      return { ...currentItemData, sizes: newSizes };
    });
  };

  const handleAddSize = () => {
    setItemData({ ...itemData, sizes: [...itemData.sizes, { size_name: '', quantity_to_restock: 0, available_quantity: 0 }] });
  };

  const handleRemoveSize = (index) => {
    const newSizes = [...itemData.sizes];
    newSizes.splice(index, 1);
    setItemData({ ...itemData, sizes: newSizes });
  };

  const handleCancel = () => {
    setErrorMessage('');
    closeModal();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'color') {
      const selectedColor = colorOptions.find(option => option.color_name === value);
      if (selectedColor) {
        setItemData({ ...itemData, color: value, color_id: selectedColor.color_id });
      }
    } else if (name === 'product_type') {
      const selectedProductType = productTypeOptions.find(option => option.product_type_name === value);
      if (selectedProductType) {
        setItemData({ ...itemData, product_type: value, product_type_id: selectedProductType.product_type_id });
      }
    } else {
      setItemData({ ...itemData, [name]: value });
    }
  };

  const handleUpdate = async () => {
    if (itemData.sizes.length === 0) {
      setErrorMessage('At least one size must be added before updating.');
      return;
    }

    const invalidSize = itemData.sizes.find(size => size.quantity_to_restock >= size.available_quantity);
    if (invalidSize) {
      setErrorMessage('Quantity to restock cannot be equal to or higher than the available quantity.');
      return;
    }

    // Check for duplicate sizes
    const sizeCounts = itemData.sizes.reduce((counts, size) => {
      counts[size.size_name] = (counts[size.size_name] || 0) + 1;
      return counts;
    }, {});
    const duplicateSize = Object.keys(sizeCounts).find(size => sizeCounts[size] > 1);
    if (duplicateSize) {
      setErrorMessage(`Duplicate size detected: ${duplicateSize}`);
      return;
    }

    try {
      const updatedItemData = {
        ...itemData,
        color: itemData.color_id,
        product_type: itemData.product_type_id,
        sizes: itemData.sizes.map(size => {
          const sizeOption = sizeOptions.find(option => option.size_name === size.size_name);
          return {
            ...size,
            size_id: sizeOption ? sizeOption.size_id : size.size_id
          };
        }),
      };
      await axios.put(`http://localhost:3001/api/inventory/${itemData.item_id}`, updatedItemData);
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (itemData) {
      const selectedColor = colorOptions.find(option => option.color_name === itemData.color);
      const selectedProductType = productTypeOptions.find(option => option.product_type_name === itemData.product_type);

      setItemData({
        ...itemData,
        color_id: selectedColor ? selectedColor.color_id : null,
        product_type_id: selectedProductType ? selectedProductType.product_type_id : null,
      });
    }
  }, [itemData, colorOptions, productTypeOptions]);

  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <DialogContent>
        {itemData && (
          <>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  autoFocus
                  id="name"
                  label="Item Name"
                  type="text"
                  fullWidth
                  value={itemData.item_name}
                  onChange={handleInputChange}
                  name="item_name"
                />
                <TextField
                  select
                  margin="dense"
                  fullWidth
                  label="Product Type"
                  value={itemData.product_type}
                  onChange={handleInputChange}
                  inputProps={{
                    name: 'product_type',
                    id: 'product_type',
                  }}
                >
                  {productTypeOptions.map((option, index) => (
                    <MenuItem key={index} value={option.product_type_name}>
                      {option.product_type_name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  margin="dense"
                  id="category_code"
                  label="Category Code"
                  type="text"
                  fullWidth
                  value={itemData.category_code}
                  onChange={handleInputChange}
                  name="category_code"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Color"
                  fullWidth
                  value={itemData.color}
                  onChange={handleInputChange}
                  inputProps={{
                    name: 'color',
                    id: 'color',
                  }}
                >
                  {colorOptions.map((option, index) => (
                    <MenuItem key={option.color_id} value={option.color_name}>
                      {option.color_name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  margin="dense"
                  id="code"
                  label="Code"
                  type="text"
                  fullWidth
                  value={itemData.code}
                  onChange={handleInputChange}
                  name="code"
                />
              </Grid>
            </Grid>
            <div>
              <h3>Sizes</h3>
              {itemData.sizes.map((size, index) => (
                <Box mb={2}>
                  <Card key={index} >
                    <CardContent>
                      <TextField
                        select
                        label="Size"
                        margin='dense'
                        fullWidth
                        value={size.size_name}
                        onChange={(event) => handleSizeChange(index, 'size_name', event)}
                        inputProps={{
                          name: `size_name_${index}`,
                          id: `size_name_${index}`,
                        }}
                      >
                        {sizeOptions.map((option, index) => (
                          <MenuItem key={index} value={option.size_name}>
                            {option.size_name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        margin="dense"
                        id={`quantity_to_restock_${index}`}
                        label="Quantity to Restock"
                        fullWidth
                        type="number"
                        min="0"
                        value={size.quantity_to_restock}
                        onChange={(event) => {
                          const value = parseInt(event.target.value);
                          if (isNaN(value) || value < 0) {
                            setErrorMessage('Quantity to restock must be a positive number.');
                          } else {
                            handleSizeChange(index, 'quantity_to_restock', event);
                          }
                        }}
                      />
                      <TextField
                        margin="dense"
                        id={`available_quantity_${index}`}
                        label="Available Quantity"
                        fullWidth
                        type="number"
                        min="0"
                        value={size.available_quantity}
                        onChange={(event) => {
                          const value = parseInt(event.target.value);
                          if (isNaN(value) || value < 0) {
                            setErrorMessage('Available quantity must be a positive number.');
                          } else {
                            handleSizeChange(index, 'available_quantity', event);
                          }
                        }}
                      />
                    </CardContent>
                    <Button startIcon={<RemoveIcon />} onClick={() => handleRemoveSize(index)}>
                      Remove Size
                    </Button>
                  </Card>
                </Box>
              ))}
              <Button startIcon={<AddIcon />} onClick={handleAddSize}>
                Add Size
              </Button>
            </div>
          </>
        )}
        {errorMessage && (
          <Box display="flex" justifyContent="center" marginBottom={2}>
            <Typography color="error">{errorMessage}</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleUpdate}>Update</Button>
      </DialogActions>
    </Dialog>
  );
}