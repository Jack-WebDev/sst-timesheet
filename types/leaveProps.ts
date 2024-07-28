export type LeaveRequestProps = {
  fullName: string;
  reason: string;
  date: string;
  documents: string[];
  totalDays?: number;
  requestFor: string;
  leaveType: string;
  email: string;
  phoneNumber: string;
  position: string;
  userId: string;
};
