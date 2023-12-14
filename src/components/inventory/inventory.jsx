import React, { useEffect, useState } from 'react';
import Nav from '../navigation-bar/nav';
import AddItemModal from './modals/AddItemModal';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';

export default function Inventory() {
  const [filteredItems, setFilteredItems] = useState([]);
  const tokenEncoded = localStorage.getItem('token');
  const isAdminEncoded = localStorage.getItem('isAdmin');
  const token = tokenEncoded ? atob(tokenEncoded) : '';
  const isAdmin = isAdminEncoded ? atob(isAdminEncoded) : '';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableItems, setTableItems] = useState([]);
  const [itemData, setItemData] = useState({
    item_name: '',
    product_type: '',
    color: '',
    size: '',
    category_code: '',
    code: '',
    stock_available: 0,
    available_quantity: 0,
    searchTerm: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredItems.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [openDeleteItemDialog, setOpenDeleteItemDialog] = useState(false);
  const [openEditItemDialog, setOpenEditItemDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editItem, setEditItem] = React.useState(null);
  const [errorMessage, setErrorMessage] = useState('');


  const openEditDialog = (item) => {
    setEditItem(item);
    setOpenEditItemDialog(true);
  };

  const openDeleteDialog = (itemId) => {
    setItemToDelete(itemId);
    setOpenDeleteItemDialog(true);
  };

  const closeDeleteDialog = () => {
    setOpenDeleteItemDialog(false);
    setItemToDelete(null);
  };

  const handlePageChange = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setItemData({ ...itemData, [name]: value });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSort = (field) => {
    let direction = 'asc';
    if (sortField === field && sortDirection === 'asc') {
      direction = 'desc';
    }
    setSortField(field);
    setSortDirection(direction);
  };

  const handleAddItem = (e) => {
    // Send a POST request to add the item to the database
    axios.post('http://localhost:3001/api/inventory', itemData)
      .then((response) => {
        console.log('Item added:', response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleUpdateItem = (event) => {
    event.preventDefault();

    if (editItem.available_quantity > editItem.stock_available) {
      setErrorMessage('Available quantity cannot be greater than stock available');
      return;
    }

    if (isNaN(editItem.available_quantity) || isNaN(editItem.stock_available)) {
      setErrorMessage('Both Available Quantity and Stock Available must be numbers');
      return;
    }

    setErrorMessage('');

    axios.put(`http://localhost:3001/api/inventory/${editItem.item_id}`, editItem)
      .then((response) => {
        console.log('Item updated in inventory:', response.data);
        setEditItem(null);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const confirmDeleteItem = (itemId) => {
    axios.delete(`http://localhost:3001/api/inventory/${itemToDelete}`)
      .then((response) => {
        console.log(response.data.message);
        // Refresh the item list or remove the deleted item from the state
        const newItems = tableItems.filter(item => item.item_id !== itemToDelete);
        setTableItems(newItems);
        setFilteredItems(newItems);
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
      });
    closeDeleteDialog();
  };

  useEffect(() => {
    axios.get('http://localhost:3001/api/inventory')
      .then((response) => {
        let items = response.data;
        if (sortField !== null) {
          items.sort((a, b) => {
            if (a[sortField] < b[sortField]) {
              return sortDirection === 'asc' ? -1 : 1;
            }
            if (a[sortField] > b[sortField]) {
              return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
          });
        }
        setTableItems(items);
        setFilteredItems(items);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [sortField, sortDirection]);

  useEffect(() => {
    const searchTermLower = itemData.searchTerm.toLowerCase();
    const results = tableItems.filter(item =>
      item.item_name.toLowerCase().includes(searchTermLower) ||
      item.product_type.toLowerCase().includes(searchTermLower) ||
      item.color.toLowerCase().includes(searchTermLower) ||
      item.size.toLowerCase().includes(searchTermLower) ||
      item.category_code.toLowerCase().includes(searchTermLower) ||
      item.code.toLowerCase().includes(searchTermLower)
    );
    setFilteredItems(results);
  }, [itemData.searchTerm, tableItems]);

  const handleLogin = () => {
    window.location.href = '/login';
  };

  if (!token) {
    return (
      <>
        <div>
          <Nav />
          <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
              <p className="text-base font-semibold text-zinc-600">404</p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
              <p className="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn’t find the page you’re looking for.</p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  onClick={handleLogin}
                  className="rounded-md bg-zinc-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
                >
                  Login
                </a>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }


  return (
    <div>
      <Nav />
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="items-start justify-between md:flex">
          <div className="max-w-lg">
            <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">Inventory</h3>
            <p className="text-gray-600 mt-2 mb-6">
              Manage products here.
            </p>
          </div>
          <div className="mt-3 md:mt-0">
            <Button
              type="button"
              variant="contained"
              style={{ backgroundColor: 'darkred', color: 'white', zIndex: 0 }}
              sx={{ mx: 1 }}
              onClick={() => setIsModalOpen(true)}
            >
              Add product
            </Button>
            <AddItemModal
              isOpen={isModalOpen}
              closeModal={() => setIsModalOpen(false)}
              handleAddItem={handleAddItem}
              itemData={itemData}
              handleInputChange={handleInputChange}
            />
          </div>
        </div>
        <div className="mb-3 md:w-96">
          <div className="relative mb-4 flex flex-col md:flex-row items-stretch">
            <input
              type="search"
              className="relative m-0 block flex-auto rounded border border-solid border-neutral-500 bg-transparent bg-clip-padding px-3 py-2 text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-grey-900 dark:text-grey-500 dark:placeholder:text-neutral-400 dark:focus:border-primary"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="button-addon2"
              value={itemData.searchTerm}
              onChange={(e) => setItemData({ ...itemData, searchTerm: e.target.value })}
            />
          </div>
        </div>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('item_name')}>Name</TableCell>
                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('product_type')}>Product Type</TableCell>
                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('color')}>Color</TableCell>
                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('size')}>Size</TableCell>
                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('category_code')}>Category Code</TableCell>
                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('code')}>Code</TableCell>
                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('stock_available')}>Stock Available</TableCell>
                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('available_quantity')}>Available Quantity</TableCell>
                <TableCell className="py-3 pr-6" align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="pr-6 py-4 whitespace-nowrap" align="center">{item.item_name}</TableCell>
                    <TableCell className="pr-6 py-4 whitespace-nowrap" align="center">{item.product_type}</TableCell>
                    <TableCell className="pr-6 py-4 whitespace-nowrap" align="center">{item.color || 'N/A'}</TableCell>
                    <TableCell className="pr-6 py-4 whitespace-nowrap" align="center">{item.size || 'N/A'}</TableCell>
                    <TableCell className="pr-6 py-4 whitespace-nowrap" align="center">{item.category_code}</TableCell>
                    <TableCell className="pr-6 py-4 whitespace-nowrap" align="center">{item.code}</TableCell>
                    <TableCell className="pr-6 py-4 whitespace-nowrap" align="center">{item.stock_available}</TableCell>
                    <TableCell className="pr-6 py-4 whitespace-nowrap" align="center">{item.available_quantity}</TableCell>
                    <TableCell className="pr-6 py-4 whitespace-nowrap" align="center">
                      <Button
                        variant="contained"
                        style={{ backgroundColor: 'black', color: 'white', marginRight: '4px' }} autoFocus
                        onClick={() => openEditDialog(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        style={{ backgroundColor: 'red', color: 'white' }} autoFocus
                        onClick={() => openDeleteDialog(item.item_id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="9" className="text-center py-4" align="center">No results found</TableCell>
                </TableRow>
              )}
            </TableBody>
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
                    id="stock_available"
                    label="Stock Available"
                    type="text"
                    fullWidth
                    value={editItem?.stock_available || ''}
                    onChange={(e) => setEditItem({ ...editItem, stock_available: e.target.value })}
                  />
                  <TextField
                    margin="dense"
                    id="available_quantity"
                    label="Available Quantity"
                    type="text"
                    fullWidth
                    value={editItem?.available_quantity || ''}
                    onChange={(e) => setEditItem({ ...editItem, available_quantity: e.target.value })}
                  />
                  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                  <Button
                    type="submit"
                    variant="contained"
                    style={{ backgroundColor: 'gray', color: 'white', marginTop: '2px' }}>
                    Save
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </Table>
        </TableContainer>
        <div className="flex justify-center space-x-2 mt-4">
          <div className="flex border border-zinc-500 rounded overflow-hidden">
            <button
              onClick={handlePrevious}
              className={`px-2 py-1 text-sm ${currentPage > 1 ? 'text-zinc-900' : 'text-zinc-500'}`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {pageNumbers.map(number => (
              <button
                key={number}
                id={number}
                onClick={handlePageChange}
                className={`px-2 py-1 text-sm ${currentPage === number ? 'bg-zinc-900 text-white' : 'text-zinc-500'
                  }`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={handleNext}
              className={`px-2 py-1 text-sm ${currentPage < pageNumbers.length ? 'text-zinc-900' : 'text-zinc-500'}`}
              disabled={currentPage === pageNumbers.length}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
