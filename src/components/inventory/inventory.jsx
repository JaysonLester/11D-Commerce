import React, { useEffect, useState } from 'react';
import Nav from '../navigation-bar/nav';
import AddItemModal from './modals/AddItemModal';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UpdateItemModal from './modals/UpdateItemModal';

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
    quantity_to_restock: 0,
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
  const [inventoryData, setInventoryData] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handlePageChange = (event) => {
    setCurrentPage(Number(event.target.id));
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

  const handleSearch = (searchTerm) => {
    const filteredItems = inventoryData.filter(item =>
      Object.values(item).some(val =>
        val && String(val).toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      item.sizes.some(size =>
        size.size_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setTableItems(filteredItems);
    setItemData({ ...itemData, searchTerm });
  };

  const handleSort = (field) => {
    let direction = 'asc';
    if (sortField === field && sortDirection === 'asc') {
      direction = 'desc';
    }
    setSortField(field);
    setSortDirection(direction);

    const sortedItems = [...tableItems].sort((a, b) => {
      if (a[field] < b[field]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[field] > b[field]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setTableItems(sortedItems);
  };

  const handleOpenUpdateModal = (item) => {
    console.log(item);
    setItemToUpdate(item);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const openDeleteConfirmationDialog = (itemId) => {
    setItemToDelete(itemId);
    setOpenDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    fetch(`http://localhost:3001/api/inventory/${itemToDelete}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    window.location.reload();
    closeDeleteDialog();
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/inventory');
        setInventoryData(response.data);
        setTableItems(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    return () => { };
  }, []);

  useEffect(() => {
    const searchTermLower = itemData.searchTerm.toLowerCase();
    const results = tableItems.filter(item =>
      item.item_name.toLowerCase().includes(searchTermLower) ||
      item.product_type.toLowerCase().includes(searchTermLower) ||
      item.color.toLowerCase().includes(searchTermLower) ||
      item.category_code.toLowerCase().includes(searchTermLower) ||
      item.code.toLowerCase().includes(searchTermLower) ||
      item.sizes.some(size => size.size_name.toLowerCase().includes(searchTermLower))
    );
    setFilteredItems(results);
  }, [itemData.searchTerm, tableItems, inventoryData]);

  useEffect(() => {
    setTableItems(inventoryData);
  }, [inventoryData]);

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
              <p className="text-base font-semibold text-zinc-600">Access Denied</p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Admin Permissions Required</h1>
              <p className="mt-6 text-base leading-7 text-gray-600">You need admin permissions to access this page.</p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <button
                  onClick={handleLogin}
                  className="rounded-md bg-zinc-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
                >
                  Login
                </button>
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
            <IconButton sx={{ bgcolor: 'black', color: 'white', '&:hover': { color: 'black' }, marginBottom: '10px' }} onClick={() => setIsModalOpen(true)}>
              <AddIcon />
            </IconButton>
            <AddItemModal
              isOpen={isModalOpen}
              closeModal={() => setIsModalOpen(false)}
              itemData={itemData}
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
              onChange={(e) => handleSearch(e.target.value)}
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
                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('category_code')}>Category Code</TableCell>
                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('code')}>Code</TableCell>
                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('combined')}>
                  {`Size / Quantity to Restock / Available Quantity`}
                </TableCell>
                <TableCell className="py-3 pr-6" align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow key={item.item_id}>
                    <TableCell align='center'>{item.item_name}</TableCell>
                    <TableCell align='center'>{item.product_type}</TableCell>
                    <TableCell align='center'>{item.color}</TableCell>
                    <TableCell align='center'>{item.category_code}</TableCell>
                    <TableCell align='center'>{item.code}</TableCell>
                    <TableCell >
                      <Table>
                        <TableBody >
                          {item.sizes.map((size) => (
                            <TableRow key={size.size_name}>
                              <TableCell align='center'>{size.size_name}</TableCell>
                              <TableCell align='center'>{size.quantity_to_restock}</TableCell>
                              <TableCell align='center'>{size.available_quantity}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                    <TableCell align='center'>
                      <IconButton onClick={() => handleOpenUpdateModal(item)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => openDeleteConfirmationDialog(item.item_id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={12}>No results found!</TableCell>
                </TableRow>
              )}
            </TableBody>

            <UpdateItemModal
              isOpen={isUpdateModalOpen}
              closeModal={closeUpdateModal}
              itemData={itemToUpdate}
              setItemData={setItemToUpdate}
            />
            <Dialog
              open={openDeleteDialog}
              onClose={closeDeleteDialog}
            >
              <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this item?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeDeleteDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleDelete} color="primary" autoFocus>
                  Delete
                </Button>
              </DialogActions>
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
