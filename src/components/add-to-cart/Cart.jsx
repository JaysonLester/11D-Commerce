import React from 'react';
import Nav from '../navigation-bar/nav';

const Cart = () => {
  // Placeholder data (replace with your actual cart data)
  const cartItems = [
    {
      id: 1,
      name: 'Product 1',
      price: '$50.00',
      quantity: 2,
    },
    {
      id: 2,
      name: 'Product 2',
      price: '$30.00',
      quantity: 1,
    },
    // Add more items as needed
  ];

  return (
    <div>
    <Nav />
    <div className="flex">


      <div className="flex-grow p-2">
        <h1 className="text-2xl font-semibold mb-5">Items</h1>

        {/* Cart Items (on the left) */}
        <div className="w-2/3 pr-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b py-2">
              <div className="flex items-center">
                <p className="mr-4">{item.name}</p>
                <p className="text-gray-500">{item.quantity} x {item.price}</p>
              </div>
              {/* Add a remove button or any other actions if needed */}
            </div>
          ))}
        </div>

       
      </div>
       {/* Checkout Process (on the right) */}
       <div className="w-1/3">
          <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

          {/* Add your checkout form or process here */}
          {/* For simplicity, I'm just displaying a total price */}
          <div className="flex justify-between items-center border-t py-2">
            <p className="font-semibold">Total:</p>
            <p>{/* Calculate the total price based on your cart data */'$110.00'}</p>
          </div>

          {/* Add your checkout button or form submission here */}
          {/* For simplicity, I'm using a basic button */}
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Proceed to Checkout
          </button>
        </div>
    </div>
    </div>
  );
};

export default Cart;
