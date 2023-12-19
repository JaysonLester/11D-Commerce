import React, { useState, useEffect } from 'react';
import Nav from '../navigation-bar/nav';
// import GenerateReportModal from './modals/GenerateReportModal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


const Materials = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const tokenEncoded = localStorage.getItem('token');
    const token = tokenEncoded ? atob(tokenEncoded) : '';
    const [isModalOpen, setModalOpen] = useState(false);
    const [sortField, setSortField] = useState(null);
    const [sorTableCellirection, setSorTableCellirection] = useState('asc');

    const [materials, setMaterials] = useState([
        { id: 1, items: ['Item 1'], variants: 'T-Shirt', colors: 'Black', sizes: 'S', codes: 'PTS01-1', alert: 'Low on Stocks 0', incoming: '0', available: '0' },
        { id: 2, items: ['Item 2'], variants: 'Hoodie', colors: 'Black', sizes: 'M', codes: 'PTS01-1', alert: 'Low on Stocks 0', incoming: '0', available: '0' },
        { id: 3, items: ['Item 3'], variants: 'Sweater', colors: 'Black', sizes: 'L', codes: 'PTS01-1', alert: 'Low on Stocks 0', incoming: '0', available: '0' },
        { id: 4, items: ['Item 4'], variants: 'Hoodie', colors: 'Black', sizes: 'XL', codes: 'PTS01-1', alert: 'Low on Stocks 0', incoming: '0', available: '0' },
        { id: 5, items: ['Item 5'], variants: 'T-Shirt', colors: 'Black', sizes: 'XXL', codes: 'PTS01-1', alert: 'Low on Stocks 0', incoming: '0', available: '0' },
    ]);

    const itemsPerPage = 10;
    const totalPages = Math.ceil(materials.length / itemsPerPage);
    const [currentPage, setCurrentPage] = useState(1);

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

    const indexOfLastMaterials = currentPage * itemsPerPage;
    const indexOfFirstMaterials = indexOfLastMaterials - itemsPerPage;
    const currentmaterials = materials.slice(indexOfFirstMaterials, indexOfLastMaterials);


    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredmaterials = materials.filter(materials => {
        const fieldsToSearch = ['id', 'items', 'variants', 'colors', 'sizes', 'codes', 'alert', 'incoming', 'available'];
        return fieldsToSearch.some(field =>
            materials[field].toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    useEffect(() => {
        if (sortField !== null) {
            const sortedmaterials = [...materials].sort((a, b) => {
                if (a[sortField] < b[sortField]) {
                    return sorTableCellirection === 'asc' ? -1 : 1;
                }
                if (a[sortField] > b[sortField]) {
                    return sorTableCellirection === 'asc' ? 1 : -1;
                }
                return 0;
            });

            setMaterials(sortedmaterials);
        }
    }, [sortField, sorTableCellirection]);

    const handleSort = (field) => {
        setSortField(field);
        setSorTableCellirection(sorTableCellirection === 'asc' ? 'desc' : 'asc');
    };

    const handleLogin = () => {
        window.location.href = '/login';
    };

    // const handleOpenModal = () => {
    //     setModalOpen(true);
    // };

    // const handleCloseModal = () => {
    //     setModalOpen(false);
    // };

    // const handleGenerateReport = () => {
    //     const pdf = new jsPDF();

    //     pdf.text('materials Report', 20, 20);

    //     const headers = ['Material ID', 'Items', 'Variants', 'Color', 'Size', 'Code', 'Alert Stock Below 30', 'Incoming Stocks', 'Available Stocks'];
    //     const tableData = materials.map(materials => [
    //         materials.id,
    //         materials.items,
    //         materials.variants,
    //         materials.colors,
    //         materials.sizes,
    //         materials.codes,
    //         materials.alert,
    //         materials.incoming,
    //         materials.available,

    //     ]);

    //     pdf.autoTable({
    //         head: [headers],
    //         body: tableData,
    //         startY: 30,
    //     });

    //     pdf.save('materialsReport.pdf');
    // };


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
                        <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">materials</h3>
                        <p className="text-gray-600 mt-2 mb-6">
                            Monitor materials here.
                        </p>
                    </div>
                    {/* <button onClick={handleOpenModal} className="p-2 border border-zinc-900 rounded">
                        <p className="text-zinc-900">Generate Report</p>
                    </button> */}

                    {/* {isModalOpen && (
                        <GenerateReportModal onClose={handleCloseModal} onGenerateReport={handleGenerateReport} />
                    )} */}
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
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('id')}>Material ID</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('items')}>Items</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('variants')}>Variants</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('colors')}>Color</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('sizes')}>Size</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('codes')}>Code</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('alert')}>Alert Stock Below 30</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('incoming')}>Incoming Stocks</TableCell>
                                <TableCell className="py-3 pr-6 cursor-pointer" align="center" onClick={() => handleSort('available')}>Available Stocks</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredmaterials.length > 0 ? (
                                currentmaterials.map((materials) => (
                                    <TableRow key={materials.id}>
                                        <TableCell className="pr-6 py-4 whitespace-nowrap" align="center">
                                            <div className="text-sm font-medium text-gray-900">{materials.id}</div>
                                        </TableCell>
                                        <TableCell className="pr-6 py-4 whitespace-nowrap" align="center">
                                            <ul className="list-disc">
                                                {materials.items.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap" align="center">
                                            <div className="text-sm text-gray-500">{materials.variants}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap" align="center">
                                            <div className="text-sm text-gray-500">{materials.colors}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap" align="center">
                                            <div className="text-sm text-gray-500">{materials.sizes}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap" align="center">
                                            <div className="text-sm text-gray-500">{materials.codes}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap" align="center">
                                            <div className="text-sm text-gray-500" style={{ color: 'red', fontWeight: 'bold' }}>
                                                {materials.alert}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap" align="center">
                                            <div className="text-sm text-gray-500">{materials.incoming}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap" align="center">
                                            <div className="text-sm text-gray-900">{materials.available}</div>
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

export default Materials;