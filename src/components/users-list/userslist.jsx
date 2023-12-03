import React, { useState, useEffect } from "react";
import Nav from '../navigation-bar/nav';

export default function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch data from the server when the component mounts
    fetch('http://localhost:3001/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const getRoleName = (isAdmin) => {
    return isAdmin ? "Admin" : "Regular User";
  };

  return (
    <div>
      <Nav />
      <div className="mx-80 my-8">
        <ul role="list" className="divide-y divide-gray-100">
          {users.map((user) => (
            <li key={user.id} className="flex justify-between gap-x-6 py-5">
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
                  <p className="mt-2 truncate text-base  leading-5 text-gray-500">
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
      </div>
    </div>
  );
}
