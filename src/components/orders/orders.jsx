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
    const tokenEncoded = localStorage.getItem('token');
    const token = tokenEncoded ? atob(tokenEncoded) : '';

    const [orders, setOrders] = useState([
        { id: 1, items: ['Item 1'], deliveryOption: 'Delivery', total: '100.00', date: '2002-05-08', quantity: 1, size: 'Small', color: 'Red', customer: 'Jayson', address: '123 Main St', phone: '123-456-7890', paymentMethod: 'Cash' },
        { id: 2, items: ['Item 2'], deliveryOption: 'PickUp', total: '500.00', date: '2003-06-04', quantity: 2, size: 'Medium', color: 'Blue', customer: 'Lester', address: '456 Side St', phone: '321-654-7890', paymentMethod: 'Gcash' },
        { id: 3, items: ['Item 3'], deliveryOption: 'PickUp', total: '900.00', date: '2004-07-03', quantity: 3, size: 'Large', color: 'Green', customer: 'Lime', address: '789 Back St', phone: '123-456-7890', paymentMethod: 'Gcash' },
        { id: 4, items: ['Item 4'], deliveryOption: 'Delivery', total: '600.00', date: '2005-08-02', quantity: 4, size: 'XL', color: 'Black', customer: 'Rham', address: '321 Front St', phone: '123-456-7890', paymentMethod: 'Cash' },
        { id: 5, items: ['Item 5'], deliveryOption: 'PickUp', total: '300.00', date: '2006-09-01', quantity: 5, size: 'XXL', color: 'White', customer: 'Link', address: '654 Left St', phone: '123-456-7890', paymentMethod: 'Cash' },
        { id: 6, items: ['Item 1'], deliveryOption: 'Delivery', total: '100.00', date: '2002-05-08', quantity: 1, size: 'Small', color: 'Red', customer: 'Jayson', address: '123 Main St', phone: '123-456-7890', paymentMethod: 'Cash' },
        { id: 7, items: ['Item 2'], deliveryOption: 'Delivery', total: '500.00', date: '2003-06-04', quantity: 2, size: 'Medium', color: 'Blue', customer: 'Lester', address: '456 Side St', phone: '321-654-7890', paymentMethod: 'Gcash' },
        { id: 8, items: ['Item 3'], deliveryOption: 'PickUp', total: '900.00', date: '2004-07-03', quantity: 3, size: 'Large', color: 'Green', customer: 'Lime', address: '789 Back St', phone: '123-456-7890', paymentMethod: 'Gcash' },
        { id: 9, items: ['Item 4'], deliveryOption: 'PickUp', total: '600.00', date: '2005-08-02', quantity: 4, size: 'XL', color: 'Black', customer: 'Rham', address: '321 Front St', phone: '123-456-7890', paymentMethod: 'Cash' },
        { id: 10, items: ['Item 5'], deliveryOption: 'Delivery', total: '300.00', date: '2006-09-01', quantity: 5, size: 'XXL', color: 'White', customer: 'Link', address: '654 Left St', phone: '123-456-7890', paymentMethod: 'Cash' },
    ]);

    const itemsPerPage = 10;
    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const [currentPage, setCurrentPage] = useState(1);
    const [isReportGenerated, setIsReportGenerated] = useState(false);
    const getOrderCount = (deliveryOption) => {
        return orders.filter(order => order.deliveryOption === deliveryOption).length;
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPageNumber => prevPageNumber + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPageNumber => prevPageNumber - 1);
        }
    };

    const handlePageChange = (event) => {
        const pageNumber = Number(event.target.textContent);
        setCurrentPage(pageNumber);
    };

    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);


    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredOrders = orders.filter(order => {
        const fieldsToSearch = ['items', 'size', 'color', 'customer', 'address', 'phone', 'date', 'deliveryOption', 'quantity', 'total', 'paymentMethod'];
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
        // Open the modal for generating a report
        setModalOpen(true);
      };
    
      const handleGenerateReportModal = (preparerName, selectedDate, selectedDeliveryOption, selectedPaymentMethod) => {
        // Filter orders based on selected criteria
        const filteredOrders = orders.filter(order => {
          const isDateMatch = selectedDate ? order.date === selectedDate : true;
          const isDeliveryOptionMatch = selectedDeliveryOption ? order.deliveryOption === selectedDeliveryOption : true;
          const isPaymentMethodMatch = selectedPaymentMethod ? order.paymentMethod === selectedPaymentMethod : true;
          return isDateMatch && isDeliveryOptionMatch && isPaymentMethodMatch;
        });
      
        // Create a new instance of jsPDF
        const pdf = new jsPDF();
      
        // Set font size to 14
        pdf.setFontSize(14);
      
        // Add logo at the top and center
        const logoPath = 'https://i.ibb.co/TtW1fGY/11-D-Commerce.png';
        const logoWidth = 50; // Adjust the width as needed
        const logoHeight = 50; // Adjust the height as needed
        const centerX = (pdf.internal.pageSize.width - logoWidth) / 2;
        pdf.addImage(logoPath, 'PNG', centerX, 10, logoWidth, logoHeight);
      
        // Set font size and style for the company name
        const originalFontSize = pdf.internal.getFontSize();
        const companyName = '11Degrees Clothing'.toUpperCase(); // Convert to all caps
        const companyFontSize = 20; // Adjust the font size for the company name
      
        // Set font style to bold
        pdf.setFont(undefined, 'bold');
        pdf.setFontSize(companyFontSize);
      
        const nameX =
          (pdf.internal.pageSize.width - pdf.getStringUnitWidth(companyName) * pdf.internal.getFontSize() / pdf.internal.scaleFactor) / 2;
        pdf.text(companyName, nameX, 10 + logoHeight + 10);
      
        // Reset font size and style to the original values
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(originalFontSize);
      
        // Define headers and table data
        const headers = ['OrderID', 'Items', 'Size', 'Color', 'Customer', 'Address', 'Phone', 'Date', 'Delivery Option', 'Quantity', 'Total', 'Payment Method'];
        const tableData = filteredOrders.map(order => [
          order.id,
          order.items.join(', '),
          order.size,
          order.color,
          order.customer,
          order.address,
          order.phone,
          order.date,
          order.deliveryOption,
          order.quantity,
          order.total.replace('$', '₱'),
          order.paymentMethod,
        ]);
      
        // Add title to the PDF for Orders Report
        let startY = 90; // Initial startY position
        pdf.text('Orders Report', 20, startY);
      
        // Add table to the PDF
        pdf.autoTable({
          head: [headers],
          body: tableData,
          startY: startY + 10, // Add a small gap after the title
        });
      
        // Save the Y-coordinate after rendering the Orders Report table
        const ordersReportTableY = pdf.autoTable.previous.finalY;
      
        // Define headers and data for Orders Details table
        const ordersDetailsHeaders = ['Information', 'Value'];
        const ordersDetailsData = [
          ['Number of orders processed', filteredOrders.length],
          ['Average order value', `PHP ${calculateAverageOrderValue(filteredOrders).toFixed(2)}`],
          ['Number of Paid Orders', getOrderCount(filteredOrders, 'Paid')],
          ['Number of Pending Orders', getOrderCount(filteredOrders, 'Pending')],
        ];
      
        // Add title to the PDF for Orders Informations
        startY = ordersReportTableY + 50; // Set the startY below the Orders Report table
        pdf.text('Orders Informations', 20, startY + 10);
      
        // Add Orders Details table to the PDF
        pdf.autoTable({
          head: [ordersDetailsHeaders],
          body: ordersDetailsData,
          startY: startY + 10, // Add a small gap after the title
        });
      
        // Save the Y-coordinate after rendering the Orders Details table
        const ordersDetailsTableY = pdf.autoTable.previous.finalY;
      
        // Calculate the x-coordinate to position "Prepared by" on the right side
        const pageWidth = pdf.internal.pageSize.width || 210;
        const preparerText = `Prepared by: ${preparerName}`;
        const preparerTextWidth = pdf.getStringUnitWidth(preparerText) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const xCoordinate = pageWidth - preparerTextWidth - 10;
      
        // Add a line for the preparer's name on the right side
        pdf.text(preparerText, xCoordinate, ordersDetailsTableY + 10); // Use the Y-coordinate after Orders Details table
      
        // Save the PDF
        pdf.save('OrdersReport.pdf');
      
        // Set the state to indicate that a report has been generated
        setIsReportGenerated(true);
      };
      
    const calculateAverageOrderValue = () => {
        const totalValues = orders.map(order => parseFloat(order.total.replace('$', '')));
        const totalSum = totalValues.reduce((sum, value) => sum + value, 0);
        return orders.length > 0 ? totalSum / orders.length : 0;
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
                  <p className="text-base font-semibold text-zinc-600">Access Denied</p>
                  <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Admin Permissions Required</h1>
                  <p className="mt-6 text-base leading-7 text-gray-600">You need admin permissions to access this page.</p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <a
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
                <div className="flex items-center justify-between">
                    <div className="max-w-lg">
                        <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">Orders</h3>
                        <p className="text-gray-600 mt-2 mb-6">
                            Monitor orders here.
                        </p>
                    </div>
                    <button onClick={handleGenerateReport} className="p-2 border border-zinc-900 rounded">
                    <p className="text-zinc-900">Generate Report</p>
                    </button>
                    {isModalOpen && (
                      <GenerateReportModal
                      onClose={() => setModalOpen(false)}
                      onGenerateReport={handleGenerateReportModal}
                      />
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
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('customer')}>Customer</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('address')}>Address</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('phone')}>Phone</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('date')}>Date</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('deliveryOption')}>deliveryOption</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('quantity')}>Quantity</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('total')}>Total</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('paymentMethod')}>Mode</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredOrders.length > 0 ? (
                                currentOrders.map((order) => (
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
                                            <div className="text-sm text-gray-500">{order.deliveryOption}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap" align="center">
                                            <div className="text-sm text-gray-900">{order.quantity}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap" align="center">
                                            <div className="text-sm text-gray-900">{order.total}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap" align="center">
                                            <div className="text-sm text-gray-900">{order.paymentMethod}</div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={11} className="py-4" align="center">No results found</TableCell>
                                </TableRow>
                            )}

                        </TableBody>
                    </Table>

                </TableContainer>
                <div className="flex justify-center space-x-2 mt-4">
                    <div className="flex border border-zinc-900 rounded overflow-hidden">
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
                <div />
            </div>
        </div>

    );
};

export default Orders;