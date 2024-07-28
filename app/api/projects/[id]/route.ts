import { NextRequest, NextResponse } from "next/server";
import db from "@/database/index";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const res = await req.json();
    const {
      Project_Name,
      Description,
      Project_Manager,
      Client_Name,
      assignedMembers,
      Department_Id,
    } = await res;

    const project = await db.project.update({
      where: {
        id: params.id,
      },
      data: {
        Project_Name: Project_Name,
        Description: Description,
        Department_Id: Department_Id,
        Client_Name: Client_Name,
        Project_Manager: Project_Manager,
        assignedMembers: assignedMembers,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await db.project.findMany({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await db.project.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
