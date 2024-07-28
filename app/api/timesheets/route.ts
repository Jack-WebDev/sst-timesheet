import { NextResponse, NextRequest } from "next/server";
import db from "@/database/index";
import { getSession } from "@/actions/auth/actions";

export async function POST(req: NextRequest) {
  const session = await getSession();
  const fullName = `${session.Name}`;
  try {
    const res = await req.json();
    const { formData } = await res;
    const { combinedData } = await formData;

    const mapped = combinedData.timesheet.map((i: any) => {
      return {
        weekday: i.weekday.toString(),
        typeOfDay: i.typeOfDay,
        totalHours: i.totalHours,
        totalMinutes: i.totalMinutes,
        tasks: {
          create: i.tasks.map((task: any) => ({
            projectName: task.projectName,
            taskPerformed: task.taskPerformed,
            taskStatus: task.taskStatus,
          })),
        },
        comment: i.comment,
      };
    });

    const allProjectNames = mapped.flatMap((i: any) => 
      i.tasks.create.map((task: any) => task.projectName)
    );

    
    const getUniqueProjectNames = Array.from(new Set(allProjectNames));


    const projectNames = getUniqueProjectNames.join(', ');



    try {
      const detailsID = await db.tableDetails.create({
        data: {
          month: combinedData.month,
          weeklyPeriod: combinedData.weeklyPeriod,
          name: fullName,
          projectManager: combinedData.projectManager,
          projectName: projectNames,
          role: combinedData.role,
          Approval_Status: combinedData.Approval_Status,
          userId: combinedData.userID,
        },
      });

      for (const entry of mapped) {
        const s = await db.tableRow.create({
          data: {
            comment: entry.comment,
            totalHours: entry.totalHours,
            totalMinutes: entry.totalMinutes,
            weekday: entry.weekday,
            tasks: entry.tasks,
            typeOfDay: entry.typeOfDay,
            userId: combinedData.userID,
            tableDetailsId: detailsID.id,
          },
        });
      }
    } catch (error) {
      console.error("Error inserting data:", error);
    }

    return NextResponse.json(combinedData, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function GET() {
  try {
    const res = await db.tableDetails.findMany({
      select: {
        id: true,
        month: true,
        name: true,
        projectManager: true,
        projectName: true,
        role: true,
        tableRows: {
          include: {
            tasks: true,
          },
        },
        weeklyPeriod: true,
        Approval_Status: true,
        comments: true,
        userId: true,
      },
    });

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
