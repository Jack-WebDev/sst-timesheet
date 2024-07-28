import { DepartmentProps } from "./departmentProps";


export type Project = {
  id: string;
  Project_Name: string;
  Project_Manager: string,
  Client_Name: string,
  Description: string;
  department: DepartmentProps;
  assignedMembers?: string[];
};
