"use server";
import db from "@/database/index";
import { LeaveRequestProps } from "@/types/leaveProps";

export const createLeaveRequest = async (data: LeaveRequestProps) => {
  try {
    await db.leaveRequest.create({
      data: {
        fullName: data.fullName,
        reason: data.reason,
        date: data.date,
        documents: data.documents,
        totalDays: data.totalDays,
        requestFor: data.requestFor,
        leaveType: data.leaveType,
        email: data.email,
        phoneNumber: data.phoneNumber,
        position: data.position,
        userId: data.userId,
      },
    });
  } catch (error) {
    console.error("Error creating a leave request:", error);
    throw error;
  }
};
