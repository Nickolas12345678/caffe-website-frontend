import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '../assets/icons/coffee.png';

const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<{ username: string, email: string } | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8080/api/users/profile', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUser({
                        username: response.data.username,
                        email: response.data.email,
                    });
                } catch (error) {
                    console.error("Помилка при завантаженні профілю", error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="w-full bg-white shadow-md border-b sticky top-0 z-50">
            <div className="relative max-w-7xl mx-auto flex items-center justify-center px-4 py-4">
                <div className="flex items-center space-x-2">
                    <img src={logo} alt="Логотип" className="h-8 w-8" />
                    <span className="text-2xl font-bold text-gray-800">FormaCafe</span>
                </div>

                <nav className="flex-1 flex justify-center space-x-6">
                    <a href="#menu" className="text-gray-800 hover:text-yellow-500 transition">Меню</a>
                    <a href="#contacts" className="text-gray-800 hover:text-yellow-500 transition">Контакти</a>
                    <a href="/about" className="text-gray-800 hover:text-yellow-500 transition">Про нас</a>
                </nav>

                <div className="flex items-center space-x-3 relative " ref={dropdownRef}>
                    {user ? (
                        <>
                            <div
                                className="w-10 h-10 bg-yellow-400 text-white flex items-center justify-center rounded-full text-lg font-bold cursor-pointer"
                                onClick={toggleDropdown}
                            >
                                {user.username.charAt(0).toUpperCase()}
                            </div>

                            {isDropdownOpen && (
                                <div className="absolute right-0 top-12 mt-2 w-48 bg-white border rounded-lg shadow-md py-2 z-50">
                                    <div className="px-4 py-2 text-gray-800">
                                        <div className="font-bold">{user.username}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                    <div className="border-t my-2"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                                    >
                                        Вийти
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate("/signin")}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-3 rounded-lg transition"
                            >
                                Увійти
                            </button>
                            <button
                                onClick={() => navigate("/signup")}
                                className="bg-white hover:bg-yellow-400 hover:text-white text-gray-800 font-bold py-2 px-3 rounded-lg transition border border-yellow-400"
                            >
                                Зареєструватися
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
