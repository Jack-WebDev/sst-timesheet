
import { NextResponse } from "next/server";
import db from "@/database/index";
import { getSession } from "@/actions/auth/actions";

export const revalidate = 0;


export async function GET() {
    try {
        const tickets = await db.helpDesk.findMany()
        return NextResponse.json(tickets, { status: 200 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}