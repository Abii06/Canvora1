import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Palette, ShoppingBag, Menu, X, Heart, LogOut, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isDark, toggleTheme } = useTheme();
    const location = useLocation();
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
    logout();
    navigate('/');
};

    const navLinks = [
        { name: 'Collections', path: '/collections' },
        { name: 'Upload', path: '/upload' },
        { name: 'Requests', path: '/requests' },
    ];

    return (
        <nav className={`fixed w-full z-50 backdrop-blur-md border-b border-white/5 ${isDark ? 'bg-gray-900/80' : 'bg-white/80'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2 group">
                        <Palette className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
                        <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase tracking-tighter">
                            CANVORA
                        </span>
                    </Link>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${location.pathname === item.path
                                            ? 'text-primary'
                                            : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {item.name}
                                    {location.pathname === item.path && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
<button
    onClick={toggleTheme}
    className="p-2 rounded-full hover:bg-white/10 transition"
>

                        {isDark ? (
                            <Sun className="h-5 w-5 text-yellow-400" />
                        ) : (
                            <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                        )}
</button>
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/wishlist" className="p-2 hover:bg-white/5 rounded-full transition-colors relative group">
                            <Heart className={`h-5 w-5 ${isDark ? 'text-gray-300' : 'text-gray-600'} group-hover:text-red-500 transition-colors`} />
                        </Link>
                        <Link to={isAuthenticated ? "/profile" : "/auth"} className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} font-medium transition-colors`}>
                            {isAuthenticated ? 'My Account' : 'Sign In'}
                        </Link>
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                            >
                                <LogOut className="h-4 w-4" /> Sign Out
                            </button>
                        ) : (
                            <Link to="/auth" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/25">
                                Get Started
                            </Link>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} p-2`}
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-surface border-b border-white/5 overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-2">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-white/5"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                            <button
    onClick={toggleTheme}
    className="w-full text-center bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium"
>
    {isDark ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
</button>
                                <Link to={isAuthenticated ? "/profile" : "/auth"} className="w-full text-center text-gray-700 dark:text-gray-300 hover:text-white font-medium">
                                    {isAuthenticated ? 'My Account' : 'Sign In'}
                                </Link>
                                {isAuthenticated ? (
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-center bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium"
                                    >
                                        Sign Out
                                    </button>
                                ) : (
                                    <Link to="/auth" className="w-full text-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium">
                                        Get Started
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;