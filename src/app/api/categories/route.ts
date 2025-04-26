import { NextResponse, NextRequest } from "next/server";

const CATEGORIES = [
    'Food',
    'Rent',
    'Utilities',
    'Transportation',
    'Entertainment',
    'Uncategorized',
];

export async function GET() {
    try {
        return NextResponse.json(CATEGORIES);
    }
    catch (error) {
        console.log(error)
        return NextResponse.json({error: 'Failed to fetch categories'}, {status: 500});
    }
}


export async function POST(request: NextRequest) {
    try {
        const {category} = await request.json();
        if (!category || typeof category !== 'string') {
            return NextResponse.json({error: 'Invalid category'}, {status: 400});
        }
        if (!CATEGORIES.includes(category)) {
            CATEGORIES.push(category);
        }
        return NextResponse.json(CATEGORIES, {status: 201});
    }
    catch (error) {
        console.log(error)
        return NextResponse.json({error: 'Failed to add category'}, {status: 500});
    }
}






