import React, { useState, useEffect } from "react";
import Nav from '../navigation-bar/nav';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const tokenEncoded = localStorage.getItem('token');
  const isAdminEncoded = localStorage.getItem('isAdmin');
  const token = tokenEncoded ? atob(tokenEncoded) : '';
  const isAdmin = isAdminEncoded ? atob(isAdminEncoded) : '';
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const currentItems = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const [sortField, setSortField] = useState("name");

  const handlePageChange = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setFilteredUsers(data);
        setSortedUsers(data);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  useEffect(() => {
    const sorted = [...filteredUsers].sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];

      if (typeof fieldA === 'string') {
        fieldA = fieldA.toLowerCase();
      }

      if (typeof fieldB === 'string') {
        fieldB = fieldB.toLowerCase();
      }

      if (fieldA < fieldB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (fieldA > fieldB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
    setSortedUsers(sorted);
  }, [sortOrder, filteredUsers, sortField]);

  const getRoleName = (isAdmin) => {
    return isAdmin ? "Admin" : "Regular User";
  };

  const handleSort = (field) => {
    setSortField(field);
    toggleSortOrder();
  };

  const toggleSortOrder = () => {
    setSortOrder(order => (order === "asc" ? "desc" : "asc"));
  };

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
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">Users</h3>
          <p className="text-gray-600 mt-2 mb-6">
            Manage users here.
          </p>
        </div>
        <div className="mb-3 md:w-96">
          <div className="relative mb-4 flex flex-col md:flex-row items-stretch">
            <input
              type="search"
              className="relative m-0 block flex-auto rounded border border-solid border-neutral-500 bg-transparent bg-clip-padding px-3 py-2 text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-grey-900 dark:text-grey-500 dark:placeholder:text-neutral-400 dark:focus:border-primary"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="button-addon2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

          </div>
        </div>

        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className="px-4 py-2 cursor-pointer" align="center" onClick={() => handleSort('name')}>Name</TableCell>
                <TableCell className="px-4 py-2 cursor-pointer" align="center" onClick={() => handleSort('firstName')}>Full Name</TableCell>
                <TableCell className="px-4 py-2 cursor-pointer" align="center" onClick={() => handleSort('email')}>Email</TableCell>
                <TableCell className="px-4 py-2 cursor-pointer" align="center" onClick={() => handleSort('admin')}>Role</TableCell>
                <TableCell className="px-4 py-2" align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <tbody className="text-gray-600">
              {currentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="9" className="py-4" align="center">No results found</TableCell>
                </TableRow>
              ) : (
                currentItems.map((user) => (
                  <tr key={user.id}>
                    <td className="border px-4 py-2 cursor-pointer text-center">{user.name}</td>
                    <td className="border px-4 py-2 cursor-pointer text-center">{user.firstName || user.lastName
                      ? `${user.firstName || ''} ${user.lastName || ''}`
                      : <em>Not set by the user yet</em>}</td>
                    <td className="border px-4 py-2 cursor-pointer text-center">{user.email}</td>
                    <td className="border px-4 py-2 cursor-pointer text-center">{getRoleName(user.admin)}</td>
                    <td className="border px-4 py-2 cursor-pointer text-center">
                      <button
                        href="javascript:void()"
                        className="py-1 px-3 text-gray-600 hover:text-gray-500 duration-150 hover:bg-gray-50 border rounded-lg mt-2"
                      >
                        Manage Role
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
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
            {Array(totalPages).fill().map((_, i) => {
              const page = i + 1;
              const isActive = currentPage === page;
              return (
                <button
                  key={page}
                  id={page}
                  onClick={handlePageChange}
                  className={`px-2 py-1 text-sm ${isActive ? 'bg-zinc-900 text-white' : 'text-zinc-500'}`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={handleNext}
              className={`px-2 py-1 text-sm ${currentPage < totalPages ? 'text-zinc-900' : 'text-zinc-500'}`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
