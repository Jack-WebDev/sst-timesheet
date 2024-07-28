import { NextResponse, NextRequest } from "next/server";
import db from "@/database/index";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const id = params.id;

		const res = await db.department.findUnique({
			where: {
				id: id,
			},
		});

		return NextResponse.json({ data: res }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const res = await req.json();
		const { Department_Name } = await res;

		const department = await db.department.update({
			where: {
				id: params.id,
			},
			data: {
				Department_Name: Department_Name,
			},
		});

		return NextResponse.json(department, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const department = await db.department.delete({
			where: {
				id: params.id,
			},
		});

		return NextResponse.json(department, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
