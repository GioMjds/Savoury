import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        
    } catch (error) {
        return NextResponse.json({
            error: `/search GET error: ${error}`
        }, { status: 500 });
    }
}