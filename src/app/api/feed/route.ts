import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        return NextResponse.json({
            message: "Feed data fetched successfully"
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            error: `/feed GET error: ${error}`
        }, { status: 500 });
    }
};
