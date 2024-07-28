import { NextResponse, NextRequest } from "next/server";
import db from "@/database/index";

export const revalidate = 0;


export async function GET() {
  try {
    const res = await db.project.findMany({
      select: {
        id: true,
        Project_Manager: true,
        Project_Name: true,
        Department_Id: true,
        Client_Name: true,
        Description: true,
        department: {
          select: {
            Department_Name: true,
          }
        },
        assignedMembers: true,
      },
    });

    // const data = res.map((i) => {
    //   return {
    //     id: i.id,
    //     Project_Name: i.Project_Name,
    //     Description: i.Description,
    //     Department_Name: i.department?.Department_Name,
    //     Department_Id: i.Department_Id,
    //     AssignedUsers: i.assignedMembers.map((i) => i),
    //   };
    // });

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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


    const project = await db.project.create({
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
