'use client';

import { useState, useEffect } from "react";
import { TransactionType } from "@/models/transaction";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {format, startOfMonth, endOfMonth} from "date-fns"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];


export function Dashboard() {
    const [transactions, setTransactions] = useState<TransactionType[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('/api/transactions');
                if (!response.ok) throw new Error('Failed to fetch transactions');
                const data = await response.json();
                setTransactions(data);
            }
            catch (err) {
                setError('Error fetching transactions');
                console.log(err)
            }
        };
        fetchTransactions();
    }, []);

    const currentMonth = startOfMonth(new Date());
    const totalExpenses = transactions.filter(
        (t) => t.type === 'expense' && 
        new Date(t.date) >= currentMonth &&
        new Date(t.date) <= endOfMonth(currentMonth)
    ).reduce((sum, t) => sum + t.amount, 0);

    const categoryBreakdown = transactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

    const totalCategoryAmount  = Object.values(categoryBreakdown).reduce((sum, val) => sum + val, 0);
    const categoryData = Object.entries(categoryBreakdown).map(([name, value]) => ({
        name,
        value: totalCategoryAmount ? (value / totalCategoryAmount) * 100 : 0,
    }));


    const monthlyExpenses = transactions.filter((t) => t.type === 'expense').reduce((acc, t) => {
        const month = format(new Date(t.date), 'MMM yyyy');
        acc[month] = (acc[month] || 0) + t.amount;
        return acc;
    }, {} as Record<string, number>);

    const barData = Object.entries(monthlyExpenses).map(([name, value]) => ({
        name,
        amount: value,
    }));

    const recentTransactions = transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);


    return (
        <div className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Expenses (This Month)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Category Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PieChart width={300} height={200}>
                            <Pie 
                                data={categoryData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({name, value}) => `${name}: ${value.toFixed(1)}%`}
                            >
                                {categoryData.map((_, index) => (
                                    <Cell key={`cell-${index}`}  fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip/>
                        </PieChart>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {recentTransactions.map((t) => (
                                <li key={t._id}>
                                    {format(new Date(t.date), 'PPP')}: {t.description} (${t.amount.toFixed(2)})
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                    <BarChart width={600} height={300} data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#8884d8" />
                    </BarChart>
                </CardContent>
            </Card>
        </div>
    );

}



