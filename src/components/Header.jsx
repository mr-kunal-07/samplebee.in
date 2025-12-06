'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, MessageCircle, ChevronDown, Menu, Phone, LogOut, User } from 'lucide-react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

export default function Header({ onMenuClick }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search shortcut (Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('search-input')?.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Clear all cookies
    const clearAllCookies = () => {
        document.cookie.split(";").forEach(cookie => {
            const name = cookie.split("=")[0].trim();
            const domains = [
                '',
                `domain=${window.location.hostname}`,
                `domain=.${window.location.hostname.split('.').slice(-2).join('.')}`
            ];
            domains.forEach(domain => {
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;${domain}`;
            });
        });
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await signOut(auth);

            localStorage.clear();
            sessionStorage.clear();
            clearAllCookies();

            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
            alert(`Failed to logout: ${error.message}`);
            setIsLoggingOut(false);
        } finally {
            setIsDropdownOpen(false);
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 sticky top-0 z-20 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                {/* Left Section */}
                <div className="flex items-center gap-3 flex-1 max-w-xl">
                    {/* Menu Button */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-all active:scale-95"
                        aria-label="Toggle Menu"
                    >
                        <Menu className="w-5 h-5 text-gray-700" />
                    </button>

                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isSearchFocused ? 'text-gray-600' : 'text-gray-400'}`} />
                        <input
                            id="search-input"
                            type="text"
                            placeholder="Search campaigns..."
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className="w-full pl-10 pr-24 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:bg-white transition-all"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1">
                            <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-600 font-mono shadow-sm">Ctrl</kbd>
                            <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-600 font-mono shadow-sm">K</kbd>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {/* Contact Support */}
                    <button
                        onClick={() => window.open("https://wa.me/9920655685", "_blank")}
                        className="hidden cursor-pointer  sm:flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-green-50 rounded-lg transition-all border border-gray-300 hover:border-green-400 hover:text-green-600 active:scale-95 group"
                    >
                        <div className="relative flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            <Phone className="w-3 h-3 absolute rotate-12 group-hover:rotate-0 transition-transform" />
                        </div>
                        <span className="text-sm font-medium hidden lg:inline">Contact Support</span>
                    </button>
                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-all active:scale-95"
                        >
                            <div className="w-9 h-9 bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                                KJ
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold text-gray-900">Kunal Jadhav</p>
                                <p className="text-xs text-gray-500">+919920655685</p>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-400 hidden md:block transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                {/* Mobile User Info */}
                                <div className="md:hidden px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-900">Kunal Jadhav</p>
                                    <p className="text-xs text-gray-500 mt-0.5">+919920655685</p>
                                </div>

                                {/* Menu Items */}
                                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    <User className="w-4 h-4" />
                                    <span>Profile Settings</span>
                                </button>

                                <hr className="border-gray-200" />

                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-b-lg"
                                >
                                    <LogOut className={`w-4 h-4 ${isLoggingOut ? 'animate-spin' : ''}`} />
                                    <span className="font-medium">
                                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}