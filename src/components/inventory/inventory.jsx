import React, { useEffect, useState } from 'react';
import Nav from '../navigation-bar/nav';
import AddItemModal from './modals/AddItemModal';
import axios from 'axios';

export default function Inventory() {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin');
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
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setItemData({ ...itemData, [name]: value });
  };

  const handleAddItem = () => {
    // Send a POST request to add the item to the database
    axios.post('http://localhost:3001/api/inventory', itemData)
      .then((response) => {
        console.log('Item added:', response.data);
        // You can also update the tableItems state to reflect the new item in your table
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

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

  const handleGoBackHome = () => {
    window.location.href = '/home';
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
        <div className="mt-12 relative h-max overflow-auto">
          <table className="w-full table-auto text-sm text-left">
            <thead className="text-gray-600 font-medium border-b">
              <tr>
                <th className="py-3 pr-6">Name</th>
                <th className="py-3 pr-6">Product Type</th>
                <th className="py-3 pr-6">Color</th>
                <th className="py-3 pr-6">Size</th>
                <th className="py-3 pr-6">Category Code</th>
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
                  <td className="pr-6 py-4 whitespace-nowrap">{item.category_code}</td>  
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
    </div>

  );
}
