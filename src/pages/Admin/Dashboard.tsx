import { useEffect, useState } from "react";
import {
    FaChartLine,
    FaCalendarDay,
    FaCalendarAlt,
    FaCalendar,
    FaArrowUp
} from "react-icons/fa";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
} from "recharts";

import api from "../../api/axios";

type Summary = {
    dailySales: number;
    dailyInvoices: number;
    monthlySales: number;
    monthlyInvoices: number;
    yearlySales: number;
    yearlyInvoices: number;
};

export default function AdminDashboard() {
    const [data, setData] = useState<Summary>({
        dailySales: 0,
        dailyInvoices: 0,
        monthlySales: 0,
        monthlyInvoices: 0,
        yearlySales: 0,
        yearlyInvoices: 0,
    });

    const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await api.get(
                "/admin/reports/summary"
            );

            setData(res.data);
        } catch {
            console.log("Failed loading reports");
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, []);

    const chartData = [
        {
            name: "Daily",
            sales: data.dailySales,
        },
        {
            name: "Monthly",
            sales: data.monthlySales,
        },
        {
            name: "Yearly",
            sales: data.yearlySales,
        },
    ];

    const cards = [
        {
            title: "Daily Sales",
            value: `$${data.dailySales}`,
            sub: `${data.dailyInvoices} invoices`,
            icon: FaCalendarDay,
        },
        {
            title: "Monthly Sales",
            value: `$${data.monthlySales}`,
            sub: `${data.monthlyInvoices} invoices`,
            icon: FaCalendarAlt,
        },
        {
            title: "Yearly Sales",
            value: `$${data.yearlySales}`,
            sub: `${data.yearlyInvoices} invoices`,
            icon: FaCalendar,
        },
        {
            title: "Growth",
            value: "+18%",
            sub: "Compared to last month",
            icon: FaArrowUp,
        },
    ];

    if (loading) {
        return (
            <div className="text-white p-8">
                Loading dashboard...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Admin Dashboard
                </h1>

                <p className="text-gray-400 mt-1">
                    Financial reports and business overview
                </p>
            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
                {cards.map((item) => (
                    <div
                        key={item.title}
                        className="bg-slate-900 border border-white/10 rounded-2xl p-5"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm">
                                    {item.title}
                                </p>

                                <h2 className="text-2xl font-bold mt-2">
                                    {item.value}
                                </h2>

                                <p className="text-xs text-gray-500 mt-1">
                                    {item.sub}
                                </p>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                <item.icon className="text-cyan-400" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid xl:grid-cols-3 gap-6">

                {/* Line Chart */}
                <div className="xl:col-span-2 bg-slate-900 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <FaChartLine className="text-cyan-400" />
                        <h2 className="font-semibold">
                            Revenue Trend
                        </h2>
                    </div>

                    <ResponsiveContainer
                        width="100%"
                        height={320}
                    >
                        <LineChart data={chartData}>
                            <CartesianGrid
                                stroke="#1e293b"
                                strokeDasharray="4 4"
                            />

                            <XAxis dataKey="name" />
                            <YAxis />

                            <Tooltip />

                            <Line
                                type="monotone"
                                dataKey="sales"
                                stroke="#06b6d4"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Quick Stats */}
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
                    <h2 className="font-semibold mb-5">
                        Quick Stats
                    </h2>

                    <div className="space-y-5">

                        <div className="flex justify-between">
                            <span className="text-gray-400">
                                Total Revenue
                            </span>

                            <span className="font-bold">
                                $
                                {data.dailySales +
                                    data.monthlySales +
                                    data.yearlySales}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-400">
                                Total Invoices
                            </span>

                            <span className="font-bold">
                                {data.dailyInvoices +
                                    data.monthlyInvoices +
                                    data.yearlyInvoices}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-400">
                                Active Staff
                            </span>

                            <span className="font-bold">
                                8
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-400">
                                Vendors
                            </span>

                            <span className="font-bold">
                                12
                            </span>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="mt-8">
                        <ResponsiveContainer
                            width="100%"
                            height={180}
                        >
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" />
                                <Tooltip />

                                <Bar
                                    dataKey="sales"
                                    fill="#06b6d4"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}