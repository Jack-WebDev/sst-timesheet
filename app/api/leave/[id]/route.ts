import { NextRequest, NextResponse } from "next/server";
import db from "@/database/index";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {

		const leaveData = await db.leaveRequest.findFirst({
			where: {
				id: params.id,
			},
		});

		return NextResponse.json(leaveData, { status: 200 });
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
        const { approvalStatus, comments } = await res;
        console.log(comments)
    
    
        try {

            const leaveData = await db.leaveRequest.update({
                where: {
                    id: params.id
                }, 
                data: {
                    approvalStatus: approvalStatus,
                    comments: comments
                }
            })

            console.log(leaveData)
    

        } catch (error) {
          console.error("Error inserting data:", error);
        }
    
        return NextResponse.json("Yes", { status: 201 });
      } catch (error) {
        return NextResponse.json(error, { status: 500 });
      }
}
