'use client';

import { useState } from "react";
import { TransactionForm } from "./components/TransactionForm";
import { TransactionList } from "./components/TransactionList";
import { Dashboard } from "./components/Dashboard";
import { TransactionType } from "@/models/transaction";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Home() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: TransactionType) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error('Failed to save transactions');
    }
    catch (error) {
      setError('Error saving transactions');
    }
  };

  return (
    <main className="container mx-auto pt-60 p-4">
      <h1 className="text-2xl text-black font-bold mb-6 flex justify-center underline">Personal Finance Visualizer</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Add Transaction</h2>
          <TransactionForm onSubmit={handleSubmit} />
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
          <Dashboard/>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
          <TransactionList/>
        </section>
      </div>
      <div className="pb-60"></div>
    </main>
  )
}














