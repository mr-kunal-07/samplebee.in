'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Folder, ClipboardList, Users, FileText, Smartphone, CreditCard, HelpCircle, Star, X, Package, Plus, Fullscreen } from 'lucide-react';

const sections = [
    {
        title: 'DASHBOARD',
        items: [
            { label: 'Overview', icon: Home, href: '/dashboard' },
        ]
    },
    {
        title: 'BRAND',
        items: [
            { label: 'Brand Overview', icon: CreditCard, href: '/brand' },
            { label: 'New Brand ', icon: Plus, href: '/brand/create-brand' }
        ]
    },
    {
        title: 'CAMPAGINS',
        items: [
            { label: 'Campagins Overview', icon: Fullscreen, href: '/campagin' },
            { label: 'New Campagin ', icon: Plus, href: '/campagin/create-campagin' }
        ]
    },
    {
        title: 'PROMOTOR',
        items: [
            { label: 'Promotor Overview', icon: Users, href: '/promotor' },
            { label: 'New Promotor ', icon: Plus, href: '/promotor/create-promotor' }
        ]
    },
    {
        title: 'REPORTS',
        items: [
            { label: 'Request Report', icon: ClipboardList, href: '/request' },
        ]
    },
    {
        title: 'GENERAL',
        items: [
            { label: 'Support Center', icon: HelpCircle, href: '/support' },
            { label: 'Write A Review', icon: Star, href: '/review' },
        ]
    }
];

export default function Sidebar({ isOpen, onClose }) {
    const pathname = usePathname();

    return (
        <>
            {/* Backdrop - Only on mobile */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 z-40 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-screen bg-white  border-r border-gray-200 overflow-y-auto z-50 transition-transform duration-300 w-64 hide-scrollbar
                    lg:translate-x-0 lg:static
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="p-3">
                    {/* Logo + Close Button */}
                    <div className="mb-4 border-b -mt-2 border-gray-400 pb-2 flex items-start justify-between">
                        <div className='flex items-center gap-2'>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">SAMPLE</h1>
                                <div className='flex items-center gap-1 ml-12'>
                                    <span className="bg-gray-800 text-white text-xl px-2 py-0.5 rounded flex gap-1 items-center size-fit">BEE</span>
                                </div>
                            </div>
                            <img src="/logo.png" alt="logo" className='w-14' />
                        </div>
                        <button
                            onClick={onClose}
                            className="lg:hidden p-1 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation Sections */}
                    {sections.map((section, idx) => (
                        <div key={idx} className="mb-5">
                            <h2 className="text-xs font-semibold text-gray-500 mb-3 px-2">{section.title}</h2>
                            <nav className="space-y-1">
                                {section.items.map((item, i) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={i}
                                            href={item.href}
                                            onClick={onClose}
                                            className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${isActive
                                                ? 'bg-gray-200 text-gray-900 border-l-4 border-gray-800 pl-2'
                                                : 'text-gray-700 hover:bg-gray-100 border-l-4 border-transparent hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className={`w-5 h-5 ${isActive ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`} />
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    ))}
                </div>
            </aside>
        </>
    );
}