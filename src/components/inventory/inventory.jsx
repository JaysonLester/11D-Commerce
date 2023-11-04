import React, { useEffect, useState } from 'react';
import Navbar from '../navigation-bar/nav';
import axios from 'axios';

export default function Inventory() {
  const [tableItems, setTableItems] = useState([]);

  useEffect(() => {
    // Fetch data from your API endpoint using Axios
    axios.get('http://localhost:3001/api/inventory')
      .then((response) => {
        setTableItems(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  return (
  
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">All products</h3>
          <p className="text-gray-600 mt-2">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>
        </div>
        <div className="mt-3 md:mt-0">
          <a
            href="javascript:void(0)"
            className="inline-block px-4 py-2 text-white duration-150 font-medium bg-rose-600 rounded-lg hover:bg-rose-500 active:bg-rose-700 md:text-sm"
          >
            Add product
          </a>
        </div>
      </div>
      <div className="mt-12 relative h-max overflow-auto">
        <table className="w-full table-auto text-sm text-left">
          <thead className="text-gray-600 font-medium border-b">
            <tr>
              <th className="py-3 pr-6">Name</th>
              <th className="py-3 pr-6">Product Type</th>
              <th className="py-3 pr-6">Color</th>
              <th className="py-3 pr-6">Size</th>
              <th className="py-3 pr-6">Code</th>
              <th className="py-3 pr-6">Stock Available</th>
              <th className="py-3 pr-6">Available Quantity</th>
              <th className="py-3 pr-6"></th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {tableItems.map((item, idx) => (
              <tr key={idx}>
                <td className="pr-6 py-4 whitespace-nowrap">{item.item_name}</td>
                <td className="pr-6 py-4 whitespace-nowrap">{item.product_type}</td>
                <td className="pr-6 py-4 whitespace-nowrap">{item.color || 'N/A'}</td>
                <td className="pr-6 py-4 whitespace-nowrap">{item.size || 'N/A'}</td>
                <td className="pr-6 py-4 whitespace-nowrap">{item.code}</td>
                <td className="pr-6 py-4 whitespace-nowrap">{item.stock_available}</td>
                <td className="pr-6 py-4 whitespace-nowrap">{item.available_quantity}</td>
                <td className="text-right whitespace-nowrap">
                  <a
                    href="javascript:void()"
                    className="py-1.5 px-3 text-gray-600 hover:text-gray-500 duration-150 hover:bg-gray-50 border rounded-lg"
                  >
                    Manage
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
