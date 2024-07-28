"use client";

import { useEffect, useState } from "react";
import axios, { Axios, AxiosError } from "axios";
import { useUser } from "@/app/store";

type LeaveRequestProps = {
  userId: string,
  fullName: string,
  reason: string,
  leaveType: string,
  approvalStatus: string,
  date: string,
  comments: string,
  totalHours: number,
  totalDays: number,
  requestFor: string,
  id: string,
};

export default function useFetchDepartments() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestProps[]>([]);
  const user = useUser();

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        
        const res = await axios.get<LeaveRequestProps[]>("/api/leave");
        const leaveRequests = res.data;
        const filteredLeaveRequests = leaveRequests.filter(
          (leaveRequest) => leaveRequest.userId === user.id
        );
        setLeaveRequests(filteredLeaveRequests);
      } catch (error) {
        console.log(error as AxiosError);
      }
    };

    if (user && user.id) {
      fetchLeaveRequests();
    }
  }, [user]);

  return leaveRequests;
}
