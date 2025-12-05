"use client";

export default function BrandSkeleton() {
    return (
        <div className="p-6 animate-pulse">
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                        <div className="mt-6 h-24 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>

            {/* Header + Filters Skeleton */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="h-6 bg-gray-200 w-1/4 rounded mb-6"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {["Brand", "Industry", "Contact", "POC", "Status", "Actions"].map((th) => (
                                <th key={th} className="px-6 py-3">
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i}>
                                {/* Logo + Name */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                        <div>
                                            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-32"></div>
                                        </div>
                                    </div>
                                </td>

                                {/* Industry */}
                                <td className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                </td>

                                {/* Contact */}
                                <td className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                                </td>

                                {/* POC */}
                                <td className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4">
                                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {[1, 2, 3].map((x) => (
                                            <div key={x} className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
