"use client";

import Link from "next/link";

import { FaCalendar, FaCalendarCheck, FaClock } from "react-icons/fa";
import DashboardCard from "@/components/DashboardCard";
import useFetchProjects from "@/hooks/useFetchProjects";
import useFetchTimesheets from "@/hooks/useFetchTimesheets";
import { useEffect, useState } from "react";
import { useUser } from "@/app/store";
import axios from "axios";

type LeaveRequestProps = {
  userId: string;
  fullName: string;
  approvalStatus: string;
  reason: string;
  leaveType: string;
  date: string;
  totalHours?: number;
  totalDays?: number;
  requestFor: string;
  id: string;
};

export default function Dashboard() {
  const projects = useFetchProjects();
  const timesheetData = useFetchTimesheets();
  const user = useUser();
  const totalProjects = projects.length;
  const [totalTimesheets, setTotalTimesheets] = useState<number>(0);
  const [totalLeaveRequests, setTotalLeaveRequests] = useState<number>(0);

  useEffect(() => {
    if (timesheetData) {
      const formattedUserFullName =
        `${user.Name.trim()} ${user.Surname.trim()}`.toLowerCase();
      const userTimesheets = timesheetData.filter((timesheet) => {
        const formattedProjectManagerName = timesheet.projectManager
          .trim()
          .toLowerCase();
        const isApprovedBy = timesheet.Approval_Status.includes("Approved by");
        const isRejectedBy = timesheet.Approval_Status.includes("Rejected by");

        return (
          isApprovedBy ||
          isRejectedBy ||
          (formattedProjectManagerName === formattedUserFullName &&
            timesheet.Approval_Status.includes("Pending"))
        );
      });

      setTotalTimesheets(userTimesheets.length);
    }
  }, [timesheetData, user.Name, user.Surname]);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const res = await axios.get<LeaveRequestProps[]>("/api/leave");
        const leaveRequests = res.data;
        console.log(leaveRequests)

        const pendingLeaveRequests = leaveRequests.filter(
          (leaveRequest) => leaveRequest.approvalStatus === "Pending"
        );

        setTotalLeaveRequests(pendingLeaveRequests.length);

      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    };

    fetchLeaveRequests();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-12">
      <Link href={"/users/exec/projects"}>
        <DashboardCard
          icon={FaCalendar}
          total={totalProjects}
          title="Total Projects"
        />{" "}
      </Link>
      <Link href={"/users/exec/timesheets"}>
        <DashboardCard
          icon={FaClock}
          total={totalTimesheets}
          title="Pending Timesheet Approvals"
        />
      </Link>
      <Link href={"/users/exec/leave"}>
        <DashboardCard
          icon={FaCalendarCheck}
          total={totalLeaveRequests}
          title="Pending Leave Requests Approvals"
        />
      </Link>
    </div>
  );
}
