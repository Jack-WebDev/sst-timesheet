"use client";

import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  id: string;
  EmployeeType: string;
  NDTEmail: string;
  Password?: string;
  departmentName?: string;
  Role?: string;
  Position?: string;
  StartDate: string;
  OfficeLocation: string;
};

export default function ProfessionalData() {
  const params = useParams();
  const [userData, setUserData] = useState<User[]>([]);

  useEffect(() => {
    fetch(`/api/users/${params.id}`)
      .then((res) => res.json())
      .then((data) => setUserData(data));
  }, [params.id]);
  return (
    <div>
      {userData?.map((user) => (
        <div key={user.id}>
          <div className="grid gap-4 py-4">
            <div className="flex justify-between items-center">
              <div className="grid items-center gap-2">
                <Label htmlFor="name">Employee Type:</Label>
                <input className="pointer-events-none pl-4 py-1"  value={user.EmployeeType} readOnly />
              </div>
              <div className="grid items-center gap-2">
                <Label htmlFor="name">NDT Division:</Label>
                <input className="pointer-events-none pl-4 py-1"  value={user.departmentName} readOnly />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="grid items-center gap-2">
                <Label htmlFor="name">Role:</Label>
                <input className="pointer-events-none pl-4 py-1"  value={user.Role} readOnly />
              </div>
              <div className="grid items-center gap-2">
                <Label htmlFor="name">Position:</Label>
                <input className="pointer-events-none pl-4 py-1"  value={user.Position} readOnly />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="grid  items-center gap-2">
                <Label htmlFor="name">Start Date:</Label>
                <input className="pointer-events-none pl-4 py-1"  value={user.StartDate} readOnly />
              </div>
              <div className="grid  items-center gap-2">
                <Label htmlFor="name">Office Location:</Label>
                <input className="pointer-events-none pl-4 py-1"  value={user.OfficeLocation} readOnly />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
