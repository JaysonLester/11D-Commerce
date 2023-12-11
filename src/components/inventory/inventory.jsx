import React, { useEffect, useState } from 'react';
import Nav from '../navigation-bar/nav';
import AddItemModal from './modals/AddItemModal';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

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

  const handleAddItem = () => {
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
                  href="#"
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
            <a
              onClick={() => setIsModalOpen(true)}
              href="javascript:void(0)"
              className="inline-block px-4 py-2 text-white duration-150 font-medium bg-rose-600 rounded-lg hover:bg-rose-500 active:bg-rose-700 md:text-sm"
            >
              Add product
            </a>
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
                        <button
                          href="javascript:void()"
                          className="py-1.5 px-3 text-gray-600 hover:text-gray-500 duration-150 hover:bg-gray-50 border rounded-lg"
                        >
                          Manage
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="9" className="text-center py-4" align="center">No results found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="flex justify-center space-x-2 mt-4">
            <div className="flex border border-zinc-500 rounded overflow-hidden">
              <button
                onClick={handlePrevious}
                className="px-2 py-1 text-sm text-zinc-500"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {pageNumbers.map(number => (
                <button
                  key={number}
                  id={number}
                  onClick={handlePageChange}
                  className={`px-2 py-1 text-sm ${currentPage === number ? 'bg-zinc-500 text-white' : 'text-zinc-500'
                    }`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={handleNext}
                className="px-2 py-1 text-sm text-zinc-500"
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
