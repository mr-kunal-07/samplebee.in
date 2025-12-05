"use client"

import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import Card from '@/components/Card';
import { Building2, CheckCircle, XCircle, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import BrandSkeleton from '@/components/BrandSkeleton';

export default function BrandDashboard() {
    const router = useRouter();
    const [brands, setBrands] = useState([]);
    const [filteredBrands, setFilteredBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Fetch brands
    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, 'brand'));
            const brandsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBrands(brandsData);
            setFilteredBrands(brandsData);
        } catch (error) {
            console.error('Error fetching brands:', error);
            toast.error('Failed to fetch brands');
        } finally {
            setLoading(false);
        }
    };

    // Filter brands
    useEffect(() => {
        let filtered = brands;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(brand =>
                brand.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                brand.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                brand.industryType?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(brand => brand.status === filterStatus);
        }

        setFilteredBrands(filtered);
    }, [searchTerm, filterStatus, brands]);

    // Delete brand
    const handleDelete = async (brandId) => {
        if (!confirm('Are you sure you want to delete this brand?')) return;

        try {
            await deleteDoc(doc(db, 'brand', brandId));
            toast.success('Brand deleted successfully!');
            fetchBrands();
        } catch (error) {
            console.error('Error deleting brand:', error);
            toast.error('Failed to delete brand');
        }
    };

    // Toggle status
    const toggleStatus = async (brandId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            await updateDoc(doc(db, 'brand', brandId), { status: newStatus });
            toast.success(`Brand ${newStatus === 'active' ? 'activated' : 'deactivated'}!`);
            fetchBrands();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    // Stats
    const stats = {
        total: brands.length,
        active: brands.filter(b => b.status === 'active').length,
        inactive: brands.filter(b => b.status === 'inactive').length
    };

    const totalChartData = brands
        .slice(-8)
        .map(brand => ({
            date: brand.createdAt?.toDate().toLocaleDateString(),
            value: 1
        }));

    const activeBrands = brands.filter(b => b.status === "active");

    const activeChartData = activeBrands.slice(-8).map(brand => ({
        date: brand.createdAt?.toDate().toLocaleDateString(),
        value: 1
    }));

    const inactiveBrands = brands.filter(b => b.status === "inactive");

    const inactiveChartData = inactiveBrands.slice(-8).map(brand => ({
        date: brand.createdAt?.toDate().toLocaleDateString(),
        value: 1
    }));





    if (loading) return <BrandSkeleton />

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card
                    title="Total Brands"
                    value={stats.total}
                    icon={Building2}
                    chartData={totalChartData}
                    chartType="area"
                    chartColor="#3b82f6"
                    footerText={`${stats.total} brands registered`}
                />

                <Card
                    title="Active Brands"
                    value={stats.active}
                    icon={CheckCircle}
                    chartData={activeChartData}
                    chartType="area"
                    chartColor="#10b981"
                    footerText="Currently active"
                />

                <Card
                    title="Inactive Brands"
                    value={stats.inactive}
                    icon={XCircle}
                    chartData={inactiveChartData}
                    chartType="area"
                    chartColor="#ef4444"
                    footerText="Currently inactive"
                />

            </div>

            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Brand Management</h1>
                    <button
                        onClick={() => router.push('/brand/create')}
                        className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-all cursor-pointer"
                    >
                        <Plus className="w-5 h-5" />
                        Create Brand
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mt-6">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by brand name, email, or industry..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Brand List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                {filteredBrands.length === 0 ? (
                    <div className="text-center py-14 px-4">
                        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900">No brands found</h3>
                        <p className="text-gray-600 text-sm mt-1 mb-6">
                            {searchTerm || filterStatus !== 'all'
                                ? 'Try adjusting your filters'
                                : 'Get started by creating your first brand'}
                        </p>

                        <button
                            onClick={() => router.push('/brand/create')}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm"
                        >
                            <Plus className="w-5 h-5" />
                            Create Brand
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                <tr className="text-xs text-gray-600 uppercase tracking-wider">
                                    <th className="px-6 py-4 text-left">Brand</th>
                                    <th className="px-6 py-4 text-left">Industry</th>
                                    <th className="px-6 py-4 text-left">Contact</th>
                                    <th className="px-6 py-4 text-left">POC</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredBrands.map((brand) => (
                                    <tr key={brand.id} className="hover:bg-gray-50 transition-colors group">
                                        {/* BRAND */}
                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-3">
                                                {brand.logoURL ? (
                                                    <img
                                                        src={brand.logoURL}
                                                        alt={brand.brandName}
                                                        className="w-10 h-10 rounded-lg object-cover ring-1 ring-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                                        <Building2 className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                )}

                                                <div>
                                                    <p className="font-semibold text-gray-900 leading-tight">
                                                        {brand.brandName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{brand.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* INDUSTRY */}
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700 font-medium">
                                                {brand.industryType}
                                            </span>
                                        </td>

                                        {/* CONTACT */}
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-800">{brand.phoneNumber}</p>
                                            {brand.websiteURL && (
                                                <a
                                                    href={brand.websiteURL}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-600 hover:underline block"
                                                >
                                                    Visit Website
                                                </a>
                                            )}
                                        </td>

                                        {/* POC */}
                                        <td className="px-6 py-4">
                                            {brand.pointOfContact?.[0] && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {brand.pointOfContact[0].name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {brand.pointOfContact[0].number}
                                                    </p>
                                                </div>
                                            )}
                                        </td>

                                        {/* STATUS BUTTON */}
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleStatus(brand.id, brand.status)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1
                      ${brand.status === 'active'
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    }
                  `}
                                            >
                                                {brand.status === 'active' ? (
                                                    <CheckCircle className="w-3 h-3" />
                                                ) : (
                                                    <XCircle className="w-3 h-3" />
                                                )}
                                                {brand.status}
                                            </button>
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => router.push(`/brand/${brand.id}`)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => router.push(`/brand/edit/${brand.id}`)}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(brand.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>


            {/* Results count */}
            {filteredBrands.length > 0 && (
                <div className="mt-4 text-center text-sm text-gray-600">
                    Showing {filteredBrands.length} of {brands.length} brands
                </div>
            )}
        </div>
    );
}