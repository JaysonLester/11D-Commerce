import React, { useState, useEffect } from "react";
import Nav from '../navigation-bar/nav';

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
      <div className="mx-4 md:mx-8 lg:mx-16 xl:mx-20 my-8">
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
            <span
              className="input-group-text flex items-center mt-2 md:mt-0 md:ml-2 whitespace-nowrap rounded px-3 py-2 text-center text-base font-normal text-neutral-700 dark:text-grey-900"
              id="basic-addon2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5">
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
        </div>
        <table className="table-auto w-full">
          <thead className="text-gray-600 font-medium border-b">
            <tr>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('name')}>Name</th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('firstName')}>Full Name</th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('email')}>Email</th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('admin')}>Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4">No results found</td>
              </tr>
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
        </table>
        <div className="flex justify-center space-x-2 mt-4">
          <div className="flex border border-zinc-500 rounded overflow-hidden">
            <button
              onClick={handlePrevious}
              className="px-2 py-1 text-sm text-zinc-500"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                id={i + 1}
                onClick={handlePageChange}
                className={`px-2 py-1 text-sm ${currentPage === i + 1 ? 'bg-zinc-500 text-white' : 'text-zinc-500'
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={handleNext}
              className="px-2 py-1 text-sm text-zinc-500"
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
