import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const {slug} = await params;
    return NextResponse.json(slug);
}