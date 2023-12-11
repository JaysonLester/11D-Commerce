import React, { useState, useEffect } from 'react';
import Nav from '../navigation-bar/nav';
import GenerateReportModal from './modals/GenerateReportModal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


const Orders = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [sortField, setSortField] = useState(null);
    const [sorTableCellirection, setSorTableCellirection] = useState('asc');

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
                    return sorTableCellirection === 'asc' ? -1 : 1;
                }
                if (a[sortField] > b[sortField]) {
                    return sorTableCellirection === 'asc' ? 1 : -1;
                }
                return 0;
            });

            setOrders(sortedOrders);
        }
    }, [sortField, sorTableCellirection]);

    const handleSort = (field) => {
        setSortField(field);
        setSorTableCellirection(sorTableCellirection === 'asc' ? 'desc' : 'asc');
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
                    <div className="max-w-lg">
                        <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">Orders</h3>
                        <p className="text-gray-600 mt-2 mb-6">
                            Monitor orders here.
                        </p>
                    </div>
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
                    </div>
                </div>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('id')}>Order ID</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('items')}>Items</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('size')}>Size</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('color')}>Color</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer"  align="center" onClick={() => handleSort('customer')}>Customer</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer"  align="center" onClick={() => handleSort('address')}>Address</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('phone')}>Phone</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('date')}>Date</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('status')}>Status</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('quantity')}>Quantity</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('total')}>Total</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('mode')}>Mode</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="pr-6 py-4 whitespace-nowrap" align="center"> 
                                            <div className="text-sm font-medium text-gray-900">{order.id}</div>
                                        </TableCell>
                                        <TableCell className="pr-6 py-4 whitespace-nowrap" align="center">
                                            <ul className="list-disc">
                                                {order.items.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap" align="center">
                                            <div className="text-sm text-gray-500">{order.size}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap" align="center">
                                            <div className="text-sm text-gray-500">{order.color}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap" align="center">
                                            <div className="text-sm text-gray-500">{order.customer}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap" align="center">
                                            <div className="text-sm text-gray-500">{order.address}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap" align="center">
                                            <div className="text-sm text-gray-500">{order.phone}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap" align="center">
                                            <div className="text-sm text-gray-500">{order.date}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap" align="center">
                                            <div className="text-sm text-gray-500">{order.status}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap" align="center">
                                            <div className="text-sm text-gray-900">{order.quantity}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap" align="center">
                                            <div className="text-sm text-gray-900">{order.total}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap" align="center">
                                            <div className="text-sm text-gray-900">{order.mode}</div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={11} className="py-4">No results found</TableCell>
                                </TableRow>
                            )}

                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default Orders;