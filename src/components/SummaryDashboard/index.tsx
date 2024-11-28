import { useLazyGetSummaryDashboardQuery } from '@/store/api/adminApi';
import React, { useEffect, useState } from 'react';

export interface SummaryDashboardProps { }

interface SummaryData {
    totalCustomers: number;
    totalProducts: number;
    totalTransactions: number;
    totalRevenue: number;
    pendingTransactions: number;
    totalRiders: number
}

const SummaryDashboard: React.FC<SummaryDashboardProps> = (props) => {
    const [summary, setSummary] = useState<SummaryData | null>(null);

    const [getSummary, { isLoading, error }] = useLazyGetSummaryDashboardQuery()
    const errorTemp: any = error

    useEffect(() => {
        const fetchSummary = async () => {
            const response = await getSummary(undefined)
            setSummary(response.data);
        };

        fetchSummary();
    }, [getSummary]);

    if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="text-xl">Loading...</div></div>;
    if (error) return <div className="flex justify-center items-center h-screen"><div className="text-red-500">{errorTemp?.data?.message}</div></div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard Summary</h1>
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <SummaryCard title="Total Customers" value={summary.totalCustomers} bgColor="bg-blue-500" />
                    <SummaryCard title="Total Riders" value={summary.totalRiders} bgColor="bg-orange-500" />
                    <SummaryCard title="Total Products" value={summary.totalProducts} bgColor="bg-green-500" />
                    <SummaryCard title="Total Transactions" value={summary.totalTransactions} bgColor="bg-yellow-500" />
                    <SummaryCard title="Total Revenue" value={`₱${Number(summary.totalRevenue.toFixed(2)).toLocaleString()}`} bgColor="bg-purple-500" />
                    <SummaryCard title="Pending Transactions" value={summary.pendingTransactions} bgColor="bg-red-500" />
                </div>
            )}
        </div>
    );
};

interface SummaryCardProps {
    title: string;
    value: number | string;
    bgColor: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, bgColor }) => {
    return (
        <div className={`p-6 rounded-lg shadow-lg text-white ${bgColor}`}>
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-3xl">{value}</p>
        </div>
    );
};

export default SummaryDashboard;
