'use client';

import { useState, useEffect } from "react";

import { TransactionType } from "@/models/transaction";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Alert, AlertDescription } from "@/components/ui/alert";

import {format} from "date-fns"

export function TransactionList() {
    const [transactions, setTransactions] = useState<TransactionType[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('/api/transactions');
                if (!response.ok) throw new Error('Failed to fetch transaction');
                const data = await response.json();
                setTransactions(data);   
            }
            catch (err) {
                setError('Error fetching transactions');
            }
        };
        fetchTransactions();
    }, []);


    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/transactions/${id}`, {method: 'DELETE'});
            if (!response.ok) throw new Error('Failed to delete transaction');
            setTransactions(transactions.filter((t) => t._id !== id));
        }
        catch (err) {
            setError('Error deleting transaction')
        }
    };

    return (
        <div className="space-y-4">
            {error && (
                <Alert variant='destructive'>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction._id}>
                            <TableCell>
                                {format(new Date(transaction.date), 'PPP')}
                            </TableCell>
                            <TableCell>
                                {transaction.description}
                            </TableCell>
                            <TableCell>
                                {transaction.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>{transaction.type}</TableCell>
                            <TableCell>{transaction.category}</TableCell>
                            <TableCell>
                                <Button
                                    variant='destructive'
                                    onClick={() => handleDelete(transaction._id!)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}














