"use client"
import React from 'react'
import { TrendingUp, DollarSign, Users, ShoppingCart } from 'lucide-react'
import Card from '@/components/Card'

const DashboardPage = () => {
    const revenueData = [
        { value: 2400 }, { value: 1398 }, { value: 9800 }, { value: 3908 },
        { value: 4800 }, { value: 3800 }, { value: 4300 }, { value: 5200 }
    ];

    const usersData = [
        { value: 100 }, { value: 150 }, { value: 180 }, { value: 220 },
        { value: 250 }, { value: 300 }, { value: 320 }, { value: 400 }
    ];

    const ordersData = [
        { value: 50 }, { value: 80 }, { value: 60 }, { value: 90 },
        { value: 70 }, { value: 110 }, { value: 95 }, { value: 130 }
    ];

    const conversionData = [
        { value: 2.1 }, { value: 2.3 }, { value: 2.5 }, { value: 2.8 },
        { value: 3.2 }, { value: 3.5 }, { value: 3.3 }, { value: 3.8 }
    ];

    return (
        <div className="min-h-screen  px-6 py-4 overflow-y-scroll">

            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-semibold text-gray-900 mb-3 font-mono ">Analytics Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card
                        title="Total Revenue"
                        subtitle="Last 30 days"
                        value="$45,231"
                        trend="+20.1%"
                        chartData={revenueData}
                        chartType="area"
                        chartColor="#3b82f6"
                        icon={DollarSign}
                        footerIcon="↑"
                        footerText="12% from last month"
                    />

                    <Card
                        isDark
                        title="Conversion Rate"
                        subtitle="Average"
                        value="3.8%"
                        trend="+2.4%"
                        chartData={conversionData}
                        chartType="area"
                        chartColor="#a78bfa"
                        icon={TrendingUp}
                        footerIcon="↑"
                        footerText="Above target"
                    />

                    <Card
                        title="Total Orders"
                        subtitle="This week"
                        value="1,234"
                        trend="+8.2%"
                        chartData={ordersData}
                        chartType="bar"
                        chartColor="#f59e0b"
                        icon={ShoppingCart}
                        footerIcon="↑"
                        footerText="23 orders today"
                    />
                    <Card
                        isDark
                        title="Active Users"
                        subtitle="Current session"
                        value="2,350"
                        trend="+15.3%"
                        chartData={usersData}
                        chartType="line"
                        chartColor="#34d399"
                        icon={Users}
                        footerIcon="↑"
                        footerText="8% increase"
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage