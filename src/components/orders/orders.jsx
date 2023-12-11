import React, { useState, useEffect } from 'react';
import Nav from '../navigation-bar/nav';
import GenerateReportModal from './modals/GenerateReportModal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const Orders = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    const [orders, setOrders] = useState([
        { id: 1, items: ['Item 1'], status: 'Paid', total: '$100.00', date: '2002-05-08', quantity: 1, size: 'Small', color: 'Red', customer: 'Jayson', address: '123 Main St', phone: '123-456-7890', mode: 'Cash' },
        { id: 2, items: ['Item 2'], status: 'Paid', total: '$500.00', date: '2003-06-04', quantity: 2, size: 'Medium', color: 'Blue', customer: 'Lester', address: '456 Side St', phone: '321-654-7890', mode: 'Gcash' },
        { id: 3, items: ['Item 3'], status: 'Pending', total: '$900.00', date: '2004-07-03', quantity: 3, size: 'Large', color: 'Green', customer: 'Lime', address: '789 Back St', phone: '123-456-7890', mode: 'Gcash' },
        { id: 4, items: ['Item 4'], status: 'Pending', total: '$600.00', date: '2005-08-02', quantity: 4, size: 'XL', color: 'Black', customer: 'Rham', address: '321 Front St', phone: '123-456-7890', mode: 'Cash' },
        { id: 5, items: ['Item 5'], status: 'Pending', total: '$300.00', date: '2006-09-01', quantity: 5, size: 'XXL', color: 'White', customer: 'Link', address: '654 Left St', phone: '123-456-7890', mode: 'Cash' },
    ]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredOrders = orders.filter(order => {
        const fieldsToSearch = ['items', 'size', 'color', 'customer', 'address', 'phone', 'date', 'status', 'quantity', 'total', 'mode'];
        return fieldsToSearch.some(field =>
            order[field].toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    useEffect(() => {
        if (sortField !== null) {
            const sortedOrders = [...orders].sort((a, b) => {
                if (a[sortField] < b[sortField]) {
                    return sortDirection === 'asc' ? -1 : 1;
                }
                if (a[sortField] > b[sortField]) {
                    return sortDirection === 'asc' ? 1 : -1;
                }
                return 0;
            });

            setOrders(sortedOrders);
        }
    }, [sortField, sortDirection]);

    const handleSort = (field) => {
        setSortField(field);
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleGenerateReport = () => {
        const pdf = new jsPDF();

        pdf.text('Orders Report', 20, 20);

        const headers = ['OrderID', 'Items', 'Size', 'Color', 'Customer', 'Address', 'Phone', 'Date', 'Status', 'Quantity', 'Total', 'Mode'];
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

        pdf.autoTable({
            head: [headers],
            body: tableData,
            startY: 30,
        });

        pdf.save('OrdersReport.pdf');
    };


    return (
        <div>
            <Nav />
            <div className="flex-grow p-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-gray-800 text-xl font-bold sm:text-2xl">Orders By</h1>

                    <button onClick={handleOpenModal} className="p-2 border border-gray-300 rounded">
                        <p>Generate Report</p>
                    </button>

                    {isModalOpen && (
                        <GenerateReportModal onClose={handleCloseModal} onGenerateReport={handleGenerateReport} />
                    )}
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
                            onChange={handleSearch}
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
                <table className="w-full table-auto text-sm ">
                    <thead className="text-gray-600 font-medium border-b text-center">
                        <tr>
                            <th className="py-3 pr-6 text-center cursor-pointer" onClick={() => handleSort('id')}>Order ID</th>
                            <th className="py-3 pr-6 text-center cursor-pointer" onClick={() => handleSort('items')}>Items</th>
                            <th className="py-3 pr-6 text-center cursor-pointer" onClick={() => handleSort('size')}>Size</th>
                            <th className="py-3 pr-6 text-center cursor-pointer" onClick={() => handleSort('color')}>Color</th>
                            <th className="py-3 pr-6 text-center cursor-pointer" onClick={() => handleSort('customer')}>Customer</th>
                            <th className="py-3 pr-6 text-center cursor-pointer" onClick={() => handleSort('address')}>Address</th>
                            <th className="py-3 pr-6 text-center cursor-pointer" onClick={() => handleSort('phone')}>Phone</th>
                            <th className="py-3 pr-6 text-center cursor-pointer" onClick={() => handleSort('date')}>Date</th>
                            <th className="py-3 pr-6 text-center cursor-pointer" onClick={() => handleSort('status')}>Status</th>
                            <th className="py-3 pr-6 text-center cursor-pointer" onClick={() => handleSort('quantity')}>Quantity</th>
                            <th className="py-3 pr-6 text-center cursor-pointer" onClick={() => handleSort('total')}>Total</th>
                            <th className="py-3 pr-6 text-center cursor-pointer" onClick={() => handleSort('mode')}>Mode</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y text-center">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
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
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{order.size}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{order.color}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{order.customer}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{order.address}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{order.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{order.date}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{order.status}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{order.quantity}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{order.total}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{order.mode}</div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={11} className="py-4">No results found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;