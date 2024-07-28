
import { NextRequest, NextResponse } from "next/server";
import db from "@/database/index";
import { getSession } from "@/actions/auth/actions";


export async function GET() {
    try {
        const student = await db.student.findMany()
        return NextResponse.json(student, { status: 200 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    const data = await req.json();

    console.log(data)

    try {
        const studentId = await db.student.create({
            data: {
                fullName: data.fullName,
                idNumber: data.idNumber,
                studentNumber: data.studentNumber,
                contactNumber: data.contactNumber,
                email: data.email,
                institution: data.institution,
                accommodation: data.accommodation,
            },
        })
        console.log(studentId)

        const helpDesk = await db.helpDesk.create({
            data: {
                studentId: studentId.id,
                date: data.date,
                callDuration: data.duration,
                campus: data.campus,
                query: data.query,
                resolve: data.resolve,
                client: data.client,
                problem: data.problem,
                status: data.status,
                callAgent: session?.NDTEmail ?? ""
            }
        })

        return NextResponse.json(helpDesk, { status: 201 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}   


