import { AP } from "./apProps";
import { Student } from "./studentProps";

export type HelpDesk = {
  id?: string;
  date?: string;
  callDuration?: string;
  callAgent?: string;
  campus?: string;
  apId?: string;
  studentId?: string;
  resolve?: string;
  query?: string;
  problem?: string;
  status?: string;
  client?: string;
  ap?: AP;
  student?: Student;
};
