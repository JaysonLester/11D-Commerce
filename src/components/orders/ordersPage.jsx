import React, { useState } from 'react';
import Nav from '../navigation-bar/nav';
import GenerateReportModal from './generateReport';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Orders = () => {
    const orders = [
      { id:  1, items: ['Item 1'], status: 'Paid', total: '$100.00', date: '2002-05-08', quantity: 1 , size: 'S' , color: 'Red' , customer: 'Jayson' , address: '123 Main St' , phone: '123-456-7890' , mode: 'Cash'},
      { id : 2, items: ['Item 2'], status: 'Paid', total: '$500.00', date: '2003-06-04', quantity: 2 , size: 'M', color: 'Blue' , customer: 'Lester' , address: '456 Side St' , phone: '321-654-7890' , mode: 'Gcash'},
      { id : 3, items: ['Item 3'], status: 'Pending', total: '$900.00', date: '2004-07-03', quantity: 3 , size: 'L', color: 'Green' , customer: 'Lime' , address: '789 Back St' ,  phone: '123-456-7890' , mode: 'Gcash'},
      { id : 4, items: ['Item 4'], status: 'Pending', total: '$600.00', date: '2005-08-02', quantity: 4 , size: 'XL', color: 'Black' , customer: 'Rham' , address: '321 Front St' , phone: '123-456-7890' , mode: 'Cash'},
      { id : 5, items: ['Item 5'], status: 'Pending', total: '$300.00', date: '2006-09-01', quantity: 5 , size: 'XXL', color: 'White' , customer: 'Link' , address: '654 Left St' , phone: '123-456-7890' , mode: 'Cash'},
      // Add more orders as needed
    ];
  
    const [isModalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortType, setSortType] = useState('');

    const handleOpenModal = () => {
      setModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setModalOpen(false);
    };
  
    const handleGenerateReport = () => {
        const pdf = new jsPDF();
    
        // Title
        pdf.text('Orders Report', 20, 20);
    
        // Table headers
        const headers = ['OrderID', 'Items','Size','Color','Customer','Address','Phone','Date','Status','Quantity', 'Total','Mode'];
        const tableData = orders.map(order => [
            order.id, 
            order.items.join(', '), 
            order.size,
            order.color,
            order.customer,
            order.address,
            order.phone,
            order.date,
            order.status,
            order.quantity, 
            order.total,
            order.mode,
        ]);
    
        // Build table using jspdf-autotable
        pdf.autoTable({
          head: [headers],
          body: tableData,
          startY: 30,
        });
    
        pdf.save('OrdersReport.pdf');
      };

      const filteredOrders = orders
      .filter((order) => {
        const searchableFields = [
          String(order.id),
          order.items.join(', '),
          String(order.size),
          String(order.color),
          String(order.customer),
          String(order.address),
          String(order.phone),
          String(order.date),
          String(order.status),
          String(order.quantity),
          String(order.total),
          String(order.mode),
        ];
  
        // Check if any of the searchable fields include the search query
        return (
          (order.status === 'Pending' || order.status === 'Paid') &&
          searchableFields.some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      })
      .sort((a, b) => {
        if (sortType === 'Pending') {
          return a.status === 'Pending' ? -1 : b.status === 'Pending' ? 1 : 0;
        } else if (sortType === 'Paid') {
          return a.status === 'Paid' ? -1 : b.status === 'Paid' ? 1 : 0;
        }
  
        // Default: no sorting
        return 0;
      });
  
    return (
      <div>
        <Nav />
        <div className="flex-grow p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-gray-800 text-xl font-bold sm:text-2xl">Orders By</h1>
            <p>Sort By:</p>
            
            <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            >
            <option value="">None</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            </select>

            <button onClick={handleOpenModal} className="p-2 border border-gray-300 rounded">
              <p>Generate Report</p>
            </button>
            
            {isModalOpen && (
              <GenerateReportModal onClose={handleCloseModal} onGenerateReport={handleGenerateReport} />
            )}
            
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-4 p-2 border border-gray-300 rounded"
            />
            
        </div>
        <table className="w-full table-auto text-sm text-left">
            <thead className="text-gray-600 font-medium border-b">
          <tr>
            <th className="py-3 pr-6">
              Order ID
            </th>
            <th className="py-3 pr-6">
             Item
            </th>
            <th className="py-3 pr-6">
              Size
            </th>
            <th className="py-3 pr-6">
              Color
            </th>
            <th className="py-3 pr-6">
              Customer
            </th>
            <th className="py-3 pr-6">
              Address
            </th>
            <th className="py-3 pr-6">
              Phone
            </th>
            <th className="py-3 pr-6">
             Date
            </th>
            <th className="py-3 pr-6">
              Status
            </th>
            <th className="py-3 pr-6">
              Quantity
            </th>
            <th className="py-3 pr-6">
              Total
            </th>
            <th className="py-3 pr-6">
              Mode
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-600 divide-y">
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="pr-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.id}</div>
                </td>
                <td className="pr-6 py-4 whitespace-nowrap">
                  <ul className="list-disc">
                    {order.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{order.size}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{order.color}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{order.customer}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{order.address}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{order.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{order.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{order.status}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.quantity}</div> 
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.total}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.mode}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
