"use client"
import React, { useEffect, useState } from 'react'
import { TrendingUp, DollarSign, Users, ShoppingCart, CreditCard } from 'lucide-react'
import Card from '@/components/Card'

import { db } from '../../../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { groupByMonth } from './_components/Calclation';


const DashboardPage = () => {

    const [brandData, setBranddata] = useState([])
    const [campagindata, setCampagindata] = useState([])

    const brandChartData = groupByMonth(brandData, "createdAt");
    const campaignChartData = groupByMonth(campagindata, "createdAt");
    useEffect(() => {
        const featchBrandData = async () => {
            const snapshot = await getDocs(collection(db, "brand"));
            const list = snapshot.docs.map((doc) => doc.data());
            setBranddata(list);
        }

        const featchCampaginData = async () => {
            const snapshot = await getDocs(collection(db, "campaign"));
            const list = snapshot.docs.map((doc) => doc.data());
            setCampagindata(list);
        }

        featchBrandData();
        featchCampaginData();
    }, [])

    return (
        <div className="min-h-screen  px-6 py-4 overflow-y-scroll">

            <div className="max-w-7xl mx-auto">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3  ">Analytics Dashboard</h1>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card
                        title="Total Brand"
                        value={brandData.length}
                        chartData={brandChartData}
                        chartType="AreaChart"
                        chartColor="#3b82f6"
                        icon={CreditCard}

                    />

                    <Card
                        isDark
                        title="Total Campagins"
                        value={campagindata.length}
                        chartData={campaignChartData}
                        chartType="LineChart"
                        chartColor="#a78bfa"
                        icon={TrendingUp}

                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage