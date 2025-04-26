import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { Transaction } from "@/models/transaction";

export async function PUT(request: NextRequest, { params } : {params : {id: string}}) {
    try {
        await connectDB();
        const body = await request.json();
        const transaction = await Transaction.findByIdAndUpdate(params.id, body,  {new: true});
        if(!transaction) {
            return NextResponse.json({error: 'Transaction not found'}, {status: 404});
        }
        return NextResponse.json(transaction);
    }
    catch (error) {
        return NextResponse.json({error: 'Failed to update transactions'});
    }
}

export async function DELETE(request: NextRequest, {params}: {params: {id: string}}) {
    try {
        await connectDB();
        const transaction = await Transaction.findByIdAndDelete(params.id);
        if (!transaction) {
            return NextResponse.json({error: 'Transactions not found'}, {status: 404});
        }
        return NextResponse.json({message: 'Transactions Deleted'});
    }
    catch (error) {
        return NextResponse.json({error: 'Failed to delete transactions'});
    }
}

