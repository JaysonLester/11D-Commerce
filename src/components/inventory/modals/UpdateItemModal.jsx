// UpdateItemModal.jsx
import React from 'react';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, TextField, DialogActions, Typography, Button, Card, CardContent, Grid, Select, MenuItem, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';

export default function UpdateItemModal({ isOpen, closeModal, itemData, setItemData, handleInputChange }) {

  const productTypeOptions = ["T-Shirt", "Shirt", "Hoodie", "Accessory"];
  const colorOptions = ["Red", "Blue", "Green", "Yellow", "Grey", "Black", "White", "Beige", "Brown", "Light Pink", "Light greige", "Light grey marl", "Dark green", "Light Beige", "Light Dark Brown"];
  const [sizeOptions, setSizeOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleSizeChange = (index, property, event) => {
    const newSizes = [...itemData.sizes];
    if (property === 'size_name') {
      const selectedSize = sizeOptions.find(size => size.size_name === event.target.value);
      if (selectedSize) {
        newSizes[index]['size_id'] = selectedSize.size_id;
        newSizes[index]['size_name'] = selectedSize.size_name;
      } else {
        console.error('Selected size not found in sizeOptions');
      }
    } else {
      newSizes[index][property] = event.target.value;
    }
    setItemData({ ...itemData, sizes: newSizes });
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

  const handleUpdate = async () => {
    if (itemData.sizes.length === 0) {
      setErrorMessage('At least one size must be added before updating.');
      return;
    }
    try {
      await axios.put(`http://localhost:3001/api/inventory/${itemData.item_id}`, itemData);
      closeModal();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <DialogContent>
        {errorMessage && (
          <Box display="flex" justifyContent="center" marginBottom={2}>
            <Typography color="error">{errorMessage}</Typography>
          </Box>
        )}
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
                />
                <TextField
                  autoFocus
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
                    <MenuItem key={index} value={option}>
                      {option}
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
                    <MenuItem key={index} value={option}>
                      {option}
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
                />
              </Grid>
            </Grid>
            <div>
              <h3>Sizes</h3>
              {itemData.sizes.map((size, index) => (
                <Box mb={2}>
                  <Card key={index} >
                    <CardContent>
                      <Select
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
                      </Select>
                      <TextField
                        margin="dense"
                        id={`quantity_to_restock_${index}`}
                        label="Quantity to Restock"
                        type="number"
                        fullWidth

                        value={size.quantity_to_restock}
                        onChange={(event) => handleSizeChange(index, 'quantity_to_restock', event)}
                      />
                      <TextField
                        margin="dense"
                        id={`available_quantity_${index}`}
                        label="Available Quantity"
                        type="number"
                        fullWidth

                        value={size.available_quantity}
                        onChange={(event) => handleSizeChange(index, 'available_quantity', event)}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleUpdate}>Update</Button>
      </DialogActions>
    </Dialog>
  );
}