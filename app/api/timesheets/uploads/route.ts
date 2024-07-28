import { NextRequest, NextResponse } from "next/server";
import db from "@/database/index";
import { getSession } from "@/actions/auth/actions";

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

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getSession();
  const fullName = `${session.Name}`;
  const userID = session.id;

  try {
    const reqBody = await req.json();
    const {
      month,
      consultantName,
      position,
      clientName,
      projectName,
      weeklyPeriod,
      date,
      totalHours,
      performedTasks,
      consultantsComment,
    } = await reqBody;
    console.log(
      month,
      consultantName,
      position,
      clientName,
      projectName,
      weeklyPeriod,
      date,
      totalHours,
      performedTasks,
      consultantsComment
    );

    try {
      const detailsID = await db.tableDetails.create({
        data: {
          month: month,
          weeklyPeriod: weeklyPeriod || "N/A",
          name: fullName,
          projectManager: "Seleke Masemola",
          projectName: projectName || "N/A",
          role: position || "N/A",
          Approval_Status: "Pending",
          userId: userID,
        },
      });

      for (let i = 0; i < date.length; i++) {
        const hoursString =
          typeof totalHours[i] === "string" ? totalHours[i] : "0:0";
        const tableRow = await db.tableRow.create({
          data: {
            weekday: date[i] || "N/A",
            totalHours: parseFloat(hoursString.split(":")[0] || 0),
            comment: consultantsComment[i] || "N/A",
            typeOfDay: "N/A",
            totalMinutes: parseFloat(hoursString.split(":")[1] || 0),
            userId: userID,
            tableDetailsId: detailsID.id,
          },
        });

        if (performedTasks && performedTasks[i]) {
          await db.task.create({
            data: {
              taskPerformed: performedTasks[i] || "N/A",
              taskStatus: "N/A",
              projectName: projectName || "N/A",
              tableRowId: tableRow.id,
            },
          });
        }
      }
      return NextResponse.json("success", { status: 201 });
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
