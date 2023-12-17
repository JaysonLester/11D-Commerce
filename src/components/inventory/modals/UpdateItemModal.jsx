import React from 'react';
import { Dialog, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

const UpdateItemDialog = ({ editItem, setEditItem, handleUpdateItem, errorMessage }) => {
  return (
    <Dialog
    open={!!editItem}
    onClose={() => setEditItem(null)}
    aria-labelledby="edit-dialog-title"
    aria-describedby="edit-dialog-description"
  >
    <DialogTitle id="edit-dialog-title">Edit Item</DialogTitle>
    <DialogContent>
      <form onSubmit={handleUpdateItem}>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          value={editItem?.item_name || ''}
          onChange={(e) => setEditItem({ ...editItem, item_name: e.target.value })}
        />
        <TextField
          margin="dense"
          id="product_type"
          label="Product Type"
          type="text"
          fullWidth
          value={editItem?.product_type || ''}
          onChange={(e) => setEditItem({ ...editItem, product_type: e.target.value })}
        />
        <TextField
          margin="dense"
          id="color"
          label="Color"
          type="text"
          fullWidth
          value={editItem?.color || ''}
          onChange={(e) => setEditItem({ ...editItem, color: e.target.value })}
        />
        <TextField
          margin="dense"
          id="size"
          label="Size"
          type="text"
          fullWidth
          value={editItem?.size || ''}
          onChange={(e) => setEditItem({ ...editItem, size: e.target.value })}
        />
        <TextField
          margin="dense"
          id="category_code"
          label="Category Code"
          type="text"
          fullWidth
          value={editItem?.category_code || ''}
          onChange={(e) => setEditItem({ ...editItem, category_code: e.target.value })}
        />
        <TextField
          margin="dense"
          id="code"
          label="Code"
          type="text"
          fullWidth
          value={editItem?.code || ''}
          onChange={(e) => setEditItem({ ...editItem, code: e.target.value })}
        />
        <TextField
          margin="dense"
          id="quantity_to_restock"
          label="Quantity to Restock"
          fullWidth
          type="number"
          value={editItem?.quantity_to_restock}
          InputProps={{
            readOnly: false,
          }}
          onChange={(e) => setEditItem({ ...editItem, quantity_to_restock: parseInt(e.target.value, 10) })}
        />
        <TextField
          margin="dense"
          id="available_quantity"
          label="Available Quantity"
          type="number"
          fullWidth
          value={editItem?.available_quantity}
          onChange={(e) => setEditItem({ ...editItem, available_quantity: parseInt(e.target.value, 10) })}
        />
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          style={{ backgroundColor: 'black', color: 'white', marginTop: '2px' }}>
          Save
        </Button>
      </form>
    </DialogContent>
  </Dialog>
  );
};

export default UpdateItemDialog;