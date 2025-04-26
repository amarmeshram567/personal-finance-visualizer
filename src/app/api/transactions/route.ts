import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db";

import { Transaction } from "@/models/transaction";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const transaction =  new Transaction(body);
        await transaction.save();
        return NextResponse.json(transaction, {status: 201});
    }
    catch (error) {
        console.log(error)
        return NextResponse.json(
            {error: 'Error saving transactions'}
        );
    }
}

export async function GET() {
    try {
        await connectDB();
        const transactions = await Transaction.find();
        return NextResponse.json(transactions, );
    }
    catch (error) {
        console.log(error)
        return NextResponse.json({error: 'Failed to fetch transactions'})
    }
}



