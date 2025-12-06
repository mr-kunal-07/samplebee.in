"use client"

import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import Card from "@/components/Card";
import { Video, CheckCircle, XCircle, Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import BrandSkeleton from "@/components/BrandSkeleton";

export default function CampaignDashboard() {
    const router = useRouter();
    const [campaigns, setCampaigns] = useState([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Fetch campaigns
    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, "campaign"));
            const campaignsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCampaigns(campaignsData);
            setFilteredCampaigns(campaignsData);
        } catch (error) {
            console.error("Error fetching campaigns:", error);
            toast.error("Failed to fetch campaigns");
        } finally {
            setLoading(false);
        }
    };

    // Filter logic
    useEffect(() => {
        let filtered = campaigns;

        if (searchTerm) {
            filtered = filtered.filter(
                (campaign) =>
                    campaign.campaignName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    campaign.brandId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    campaign.targetLocation?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterStatus !== "all") {
            filtered = filtered.filter((campaign) => campaign.status === filterStatus);
        }

        setFilteredCampaigns(filtered);
    }, [searchTerm, filterStatus, campaigns]);

    // Delete
    const handleDelete = async (campaignId) => {
        if (!confirm("Are you sure you want to delete this campaign?")) return;

        try {
            await deleteDoc(doc(db, "campaign", campaignId));
            toast.success("Campaign deleted successfully!");
            fetchCampaigns();
        } catch (error) {
            console.error("Error deleting campaign:", error);
            toast.error("Failed to delete campaign");
        }
    };

    // Toggle status
    const toggleStatus = async (campaignId, currentStatus) => {
        try {
            const newStatus = currentStatus === "active" ? "inactive" : "active";
            await updateDoc(doc(db, "campaign", campaignId), { status: newStatus });
            toast.success(`Campaign ${newStatus === "active" ? "activated" : "deactivated"}!`);
            fetchCampaigns();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    // Stats
    const stats = {
        total: campaigns.length,
        active: campaigns.filter((c) => c.status === "active").length,
        inactive: campaigns.filter((c) => c.status === "inactive").length,
    };

    // Chart Data
    const totalChartData = campaigns.slice(-8).map((campaign) => ({
        date: campaign.createdAt?.toDate().toLocaleDateString(),
        value: 1,
    }));

    const activeCampaigns = campaigns.filter((c) => c.status === "active");
    const activeChartData = activeCampaigns.slice(-8).map((c) => ({
        date: c.createdAt?.toDate().toLocaleDateString(),
        value: 1,
    }));

    const inactiveCampaigns = campaigns.filter((c) => c.status === "inactive");
    const inactiveChartData = inactiveCampaigns.slice(-8).map((c) => ({
        date: c.createdAt?.toDate().toLocaleDateString(),
        value: 1,
    }));

    if (loading) return <BrandSkeleton />;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card
                    title="Total Campaigns"
                    value={stats.total}
                    icon={Video}
                    chartData={totalChartData}
                    chartType="area"
                    chartColor="#3b82f6"
                    footerText={`${stats.total} campaigns created`}
                />

                <Card
                    isDark
                    title="Active Campaigns"
                    value={stats.active}
                    icon={CheckCircle}
                    chartData={activeChartData}
                    chartType="area"
                    chartColor="#10b981"
                    footerText="Currently running"
                />

                <Card
                    title="Inactive Campaigns"
                    value={stats.inactive}
                    icon={XCircle}
                    chartData={inactiveChartData}
                    chartType="area"
                    chartColor="#ef4444"
                    footerText="Not running"
                />
            </div>

            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Campaign Management</h1>
                    <button
                        onClick={() => router.push("/campaign/create")}
                        className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-all cursor-pointer"
                    >
                        <Plus className="w-5 h-5" />
                        Create Campaign
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mt-6">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by campaign name, brand, or location..."
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

            {/* Campaign List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                {filteredCampaigns.length === 0 ? (
                    <div className="text-center py-14 px-4">
                        <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900">No campaigns found</h3>
                        <p className="text-gray-600 text-sm mt-1 mb-6">
                            {searchTerm || filterStatus !== "all"
                                ? "Try adjusting your filters"
                                : "Get started by creating your first campaign"}
                        </p>

                        <button
                            onClick={() => router.push("/campaign/create")}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm"
                        >
                            <Plus className="w-5 h-5" />
                            Create Campaign
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                <tr className="text-xs text-gray-600 uppercase tracking-wider">
                                    <th className="px-6 py-4 text-left">Campaign Name</th>
                                    <th className="px-6 py-4 text-left">Brand ID</th>
                                    <th className="px-6 py-4 text-left">Location</th>
                                    <th className="px-6 py-4 text-left">Target</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredCampaigns.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 font-medium">{c.campaignName}</td>
                                        <td className="px-6 py-4">{c.brandId}</td>
                                        <td className="px-6 py-4">{c.targetLocation}</td>
                                        <td className="px-6 py-4">{c.gender} | {c.targetAgeGroup}</td>

                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleStatus(c.id, c.status)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${c.status === "active"
                                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                                                    }`}
                                            >
                                                {c.status === "active" ? (
                                                    <CheckCircle className="w-3 h-3" />
                                                ) : (
                                                    <XCircle className="w-3 h-3" />
                                                )}
                                                {c.status}
                                            </button>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => router.push(`/campaign/${c.id}`)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => router.push(`/campaign/edit/${c.id}`)}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(c.id)}
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

            {filteredCampaigns.length > 0 && (
                <div className="mt-4 text-center text-sm text-gray-600">
                    Showing {filteredCampaigns.length} of {campaigns.length} campaigns
                </div>
            )}
        </div>
    );
}
