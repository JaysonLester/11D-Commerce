import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const Navbar = () => {
    const [state, setState] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [name, setName] = useState('');
    const isAdminEncoded = localStorage.getItem('isAdmin');
    const isAdmin = isAdminEncoded ? atob(isAdminEncoded) : '';

    useEffect(() => {
        const token = localStorage.getItem('token');

        setIsLoggedIn(!!token);

        if (isLoggedIn) {
            const storedName = localStorage.getItem('name');
            const decodedName = storedName ? atob(storedName) : '';
            setName(decodedName || '');
        }
    }, [isLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        setIsLoggedIn(false);
        setName('');
        window.location.href = '/login';
    };

    const navigation = [
        { title: 'Home', path: '/home' },
        { title: 'Men', path: '' },
        { title: 'Women', path: '' },
    ];

    return (
        <nav className="bg-white border-b w-full md:static md:text-sm md:border-none">
            <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
                <div className="flex items-center justify-between py-3 md:py-5 md:block">
                    <div className="flex items-center">
                        <img src="https://i.postimg.cc/3kpY5HVx/icon.png" alt="Icon" className="h-12 w-12 mr-2" />
                        <h2 className="text-4xl font-bold text-zinc-800">11DEGREES</h2>
                    </div>
                    <div className="md:hidden">
                        <button
                            className="text-zinc-500 hover:text-zinc-800"
                            onClick={() => setState(!state)}
                        >
                            {state ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                <div
                    className={`flex-1 pb-3 mt-8 md:block md:pb-0 md:mt-0 ${state ? 'block' : 'hidden'
                        }`}
                >
                    <ul className="justify-end items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
                        {navigation.map((item, idx) => (
                            <li key={idx} className="text-zinc-700 hover:text-rose-600">
                                <a href={item.path} className="block">
                                    {item.title}
                                </a>
                            </li>
                        ))}
                        {isAdmin === '1' && (
                            <div className="inline-flex shadow-sm rounded-md mb-5" role="group">
                                <a type="button" href="/home" className="rounded-l-lg border border-gray-200 bg-white text-sm font-medium px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-zinc-700 focus:z-10 focus:ring-2 focus:ring-zinc-700 focus:text-zinc-700">
                                    Products
                                </a>
                                <a type="button" href="/inventory" className="border-t border-b border-r border-gray-200 bg-white text-sm font-medium px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-zinc-700 focus:z-10 focus:ring-2 focus:ring-zinc-700 focus:text-zinc-700">
                                    Inventory
                                </a>
                                <a type="button" href="/users-list" className="border-t border-b border-gray-200 bg-white text-sm font-medium px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-zinc-700 focus:z-10 focus:ring-2 focus:ring-zinc-700 focus:text-zinc-700">
                                    Users
                                </a>
                                <a type="button" href="/materials" className="border-t border-b border-l border-gray-200 bg-white text-sm font-medium px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-zinc-700 focus:z-10 focus:ring-2 focus:ring-zinc-700 focus:text-zinc-700">
                                    Materials
                                </a>
                                <a type="button" href="/orders" className="rounded-r-md border border-gray-200 bg-white text-sm font-medium px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-zinc-700 focus:z-10 focus:ring-2 focus:ring-zinc-700 focus:text-zinc-700">
                                    Orders
                                </a>
                            </div>
                        )}
                        <span className=" w-px h-6 bg-zinc-300 md:block"></span>
                        <div className="space-y-3 items-center gap-x-6 md:flex md:space-y-0">
                            {isLoggedIn ? (
                                <li className="relative group">
                                    <button
                                        className="flex items-center space-x-2 text-zinc-700 font-bold cursor-pointer p-3 rounded-md"
                                        onClick={() => setState(!state)}
                                    >
                                        <span>{name}</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className={`h-5 w-5 transform ${state ? 'rotate-180' : 'rotate-0'}`}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div
                                        className={`absolute ${state ? 'block' : 'hidden'
                                            } space-y-2 bg-white text-zinc-700 shadow-lg mt-2 ml-2 rounded-md p-2 w-48`}
                                            style={{ zIndex: 9999 }}
                                        onMouseEnter={() => setState(true)}
                                        onMouseLeave={() => setState(false)}
                                    >
                                        <ul>
                                            <li>
                                                <Link to="/user-profile">
                                                    {/* Use Link to navigate to the /profile route */}
                                                    <button className="block py-3 text-center w-full hover:text-rose-600 font-semibold cursor-pointer p-3 rounded-md">
                                                        <p>Profile</p>
                                                    </button>
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={handleLogout}
                                                    className="block py-3 text-center w-full hover:text-rose-600 font-semibold cursor-pointer p-3 rounded-md"
                                                >
                                                    Log Out
                                                </button>
                                            </li>

                                        </ul>
                                    </div>
                                </li>
                            ) : null}
                            {!isLoggedIn && (
                                <>
                                    <li>
                                        <a
                                            href="/login"
                                            className="block py-3 text-center text-zinc-700 hover:text-rose-600 border rounded-lg md:border-none"
                                        >
                                            Log in
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/register"
                                            className="block py-3 px-4 font-medium text-center text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 active:shadow-none rounded-lg shadow md:inline"
                                        >
                                            Sign Up
                                        </a>
                                    </li>
                                </>
                            )}
                        </div>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
