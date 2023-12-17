import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

const DeleteItemModal = ({ openDeleteItemDialog, closeDeleteDialog, confirmDeleteItem }) => {
  return (
    <Dialog
      open={openDeleteItemDialog}
      onClose={closeDeleteDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this item?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDeleteDialog}
          variant="contained"
          style={{ backgroundColor: 'gray', color: 'white', marginRight: '2px' }}
        >
          Cancel
        </Button>
        <Button
          onClick={confirmDeleteItem}
          variant="contained"
          style={{ backgroundColor: 'red', color: 'white' }} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteItemModal;