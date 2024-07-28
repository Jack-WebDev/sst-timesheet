"use server";
import db from "@/database/index";

type UserProps = {
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
  Password: string;
  departmentName: string;
  departmentId: string;
  Role: string;
  Position: string;
  StartDate: string;
  OfficeLocation: string;
  documents: Document[];
};

type Document = {
  url: string;
}



export const createEmployee = async (data: UserProps) => {
  try {
    await db.user.create({
      data: {
        Name: data.Name,
        Surname: data.Surname,
        Email: data.Email,
        IdNumber: data.IdNumber,
        MobileNumber: data.MobileNumber,
        Address: data.Address,
        City: data.City,
        ZipCode: data.ZipCode,
        Province: data.Province,
        DateOfBirth: data.DateOfBirth,
        MaritalStatus: data.MaritalStatus,
        Gender: data.Gender,
        Nationality: data.Nationality,
        EmployeeType: data.EmployeeType,
        NDTEmail: data.NDTEmail,
        Password: data.Password,
        departmentName: data.departmentName,
        departmentId: data.departmentId,
        Role: data.Role,
        Position: data.Position,
        StartDate: data.StartDate,
        OfficeLocation: data.OfficeLocation,
        documents: {
          create: data.documents.map((document) => ({
            url: document.url,
          })),
        },

      },
    });

  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};
