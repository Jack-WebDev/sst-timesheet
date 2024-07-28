import { NextRequest, NextResponse } from "next/server";
import db from "@/database/index";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {

		const timesheetData = await db.tableDetails.findFirst({
			where: {
				id: params.id,
			},
		});

		return NextResponse.json(timesheetData, { status: 200 });
	} catch (error) {
		return NextResponse.json(error, { status: 500 });
	}
}


export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
    try {
        const res = await req.json();
        const { Approval_Status, comment } = await res;
    
    
        try {

            await db.tableDetails.update({
                where: {
                    id: params.id
                }, 
                data: {
                    Approval_Status: Approval_Status,
                    comments: comment,
                }
            })
    

        } catch (error) {
          console.error("Error inserting data:", error);
        }
    
        return NextResponse.json("Yes", { status: 201 });
      } catch (error) {
        return NextResponse.json(error, { status: 500 });
      }
}
