type Document = {
  id: string;
  url: string;
};


export type UserProps = {
  id: string;
  Name: string;
  Surname: string;
  Email: string;
  IdNumber: string;
  MobileNumber: string;
  Address: string;
  City: string;
  ZipCode: string;
  Province: string;
  DateOfBirth: string;
  MaritalStatus: string;
  Gender: string;
  Nationality: string;
  EmployeeType: string;
  NDTEmail: string;
  Password?: string;
  departmentId?: string;
  departmentName?: string;
  Role?: string;
  Position?: string;
  StartDate: Date;
  OfficeLocation: string;
  department?: string;
  documents?: Document[];
};
