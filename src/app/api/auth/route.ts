import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const action = searchParams.get('action');
    } catch (error) {
        return NextResponse.json({
            error: `/auth POST error: ${error}`
        }, { status: 500 });
    }
}