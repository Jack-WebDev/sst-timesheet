export type TaskProps = {
  id?: string;
  projectName: string;
  taskPerformed: string;
  taskStatus: string;
  hours: number;
  minutes: number;
  tableRowId?: string;
  [key: string]: any;
};
