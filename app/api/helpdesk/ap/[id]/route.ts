import { NextRequest, NextResponse } from "next/server";
import db from "@/database/index";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {

        const apData = await db.aP.findUnique({
            where: {
                id: params.id,
            }
        })

        return NextResponse.json(apData, { status: 200 });
	} catch (error) {
		return NextResponse.json(error, { status: 500 });
	}
}
