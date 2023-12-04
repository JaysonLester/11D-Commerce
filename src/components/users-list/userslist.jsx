import React, { useState, useEffect } from "react";
import Nav from '../navigation-bar/nav';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

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
      const nameA = a.name ? a.name.toLowerCase() : '';
      const nameB = b.name ? b.name.toLowerCase() : '';

      return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    setSortedUsers(sorted);
  }, [sortOrder, filteredUsers]);

  const getRoleName = (isAdmin) => {
    return isAdmin ? "Admin" : "Regular User";
  };

  const handleGoBackHome = () => {
    window.location.href = '/home';
  };

  const toggleSortOrder = () => {
    setSortOrder(order => (order === "asc" ? "desc" : "asc"));
  };

  if (!token || isAdmin !== '1') {
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
                  onClick={handleGoBackHome}
                  className="rounded-md bg-zinc-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
                >
                  Go back home
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
  
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <button
            className="mb-2 md:mb-0 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            onClick={toggleSortOrder}
          >
            {`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
          </button>
        </div>
  
        {sortedUsers.length === 0 ? (
          <p className="text-center text-2xl font-semibold text-gray-700">No Results Found!</p>
        ) : (
          <ul role="list" className="divide-y divide-gray-100">
            {sortedUsers.map((user) => (
              <li key={user.id} className="flex flex-col md:flex-row justify-between gap-x-6 py-5">
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto">
                    <p className="text-xl font-bold leading-6 text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-base font-medium leading-6 text-gray-900">
                      <span className="font-semibold text-gray-700">Name: </span>
                      {user.firstName || user.lastName
                        ? `${user.firstName || ''} ${user.lastName || ''}`
                        : <em>Not set by the user yet</em>}
                    </p>
                    <p className="mt-2 truncate text-base leading-5 text-gray-500">
                      <span className="font-semibold text-gray-700">Email:</span> {user.email}
                    </p>
                  </div>
                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <p className="text-lg leading-6 text-gray-900">
                    <span className="text-base font-weight: 400 text-gray-700">Role:</span> {getRoleName(user.admin)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
