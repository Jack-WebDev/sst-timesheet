import { NextRequest, NextResponse } from "next/server";
import db from "@/database/index";

export async function GET() {
  try {
    const res = await db.department.findMany({
      select: {
        id: true,
        Department_Name: true,
        projects: {
          select: {
            id: true,
          },
        },
        users: {
          select: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const reqBody = await req.json();
    const { Department_Name } = await reqBody;

    const department = await db.department.create({
      data: {
        Department_Name: Department_Name,
      },
    });

    return NextResponse.json({ department }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
