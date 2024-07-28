import { NextRequest, NextResponse } from "next/server";
import db from "@/database/index";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {

        const studentData = await db.student.findUnique({
            where: {
                id: params.id,
            }
        })

        return NextResponse.json(studentData, { status: 200 });
	} catch (error) {
		return NextResponse.json(error, { status: 500 });
	}
}
