"use client";

import Link from "next/link";

import { FaCheck } from "react-icons/fa";
import DashboardCard from "@/components/DashboardCard";
import useFetchTimesheets from "@/hooks/useFetchTimesheets";
import { useEffect, useState } from "react";
import { useUser } from "@/app/store";
import { PageHeader } from "@/components/shared/PageHeader";
import { LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  const timesheetData = useFetchTimesheets();
  const user = useUser();
  const [totalTimesheets, setTotalTimesheets] = useState<number>(0);

  useEffect(() => {
    if (timesheetData) {
      const formattedUserFullName =
        `${user.Name.trim()} ${user.Surname.trim()}`.toLowerCase();
      const userTimesheets = timesheetData.filter((timesheet) => {
        const formattedProjectManagerName = timesheet.projectManager
          .trim()
          .toLowerCase();

        return (
          formattedProjectManagerName === formattedUserFullName &&
          timesheet.Approval_Status.includes("Pending")
        );
      });

      setTotalTimesheets(userTimesheets.length);
    }
  }, [timesheetData, user.Name, user.Surname]);

  return (
    <>
      <PageHeader title="Dashboard" Icon={LayoutDashboard} />
      <div className="grid grid-cols-2 gap-12 mt-12">
        <Link href={"/users/employee/Approvals"}>
          <DashboardCard
            icon={FaCheck}
            total={totalTimesheets}
            title="Pending Approvals"
          />
        </Link>
      </div>
    </>
  );
}
