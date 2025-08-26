import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        return NextResponse.json({
            message: "Notifications fetched successfully",
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: `/notifications GET error: ${error}`
        }, { status: 500 });
    }
}