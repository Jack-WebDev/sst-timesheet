"use client";

import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
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
};

export default function PersonalData() {
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
        <div key={user.id} className="grid gap-y-8">
          <div className="flex justify-between items-center pointer-events-none">
            <div className="grid items-center gap-x-2 gap-y-2">
              <Label htmlFor="name">
                First Name:
              </Label>
              <input
                id="name"
                value={user.Name}
                className=" rounded-xl focus:border-primary pointer-events-none pl-4 py-1"
                readOnly
              />
            </div>

            <div className="grid items-center gap-x-2 gap-y-2">
              <Label htmlFor="name">
                Last Name:
              </Label>
              <input
                id="name"
                value={user.Surname}
                className=" rounded-xl focus:border-primary"
                pl-4 py-1 readOnly
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="grid items-center gap-x-2 gap-y-2">
              <Label htmlFor="name">
                Email:
              </Label>
              <input
                id="name"
                value={user.Email}
                className=" rounded-xl focus:border-primary pointer-events-none pl-4 py-1"
                readOnly
              />
            </div>

            <div className="grid items-center gap-x-2 gap-y-2">
              <Label htmlFor="name">
                ID Number:
              </Label>
              <input
                id="name"
                value={user.IdNumber}
                className=" rounded-xl focus:border-primary pointer-events-none pl-4 py-1"
                readOnly
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="grid items-center gap-x-2 gap-y-2">
              <Label htmlFor="name">
                Mobile Number:
              </Label>
              <input
                id="name"
                value={user.MobileNumber}
                className=" rounded-xl focus:border-primary pointer-events-none pl-4 py-1"
                readOnly
              />
            </div>

            <div className="grid items-center gap-x-2 gap-y-2">
              <Label htmlFor="name">
                Address:
              </Label>
              <input
                id="name"
                value={user.Address}
                className=" rounded-xl focus:border-primary pointer-events-none pl-4 py-1"
                readOnly
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="grid items-center gap-x-2 gap-y-2">
              <Label htmlFor="name">
                Marital Status:
              </Label>
              <input
                id="name"
                value={user.MaritalStatus}
                className=" rounded-xl focus:border-primary pointer-events-none pl-4 py-1"
                readOnly
              />
            </div>

            <div className="grid items-center gap-x-2 gap-y-2">
              <Label htmlFor="name">
                Nationality:
              </Label>
              <input
                id="name"
                value={user.Nationality}
                className=" rounded-xl focus:border-primary pointer-events-none pl-4 py-1"
                readOnly
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="grid items-center gap-x-2 gap-y-2">
              <Label htmlFor="name">
                Gender:
              </Label>
              <input
                id="name"
                value={user.Gender}
                className=" rounded-xl focus:border-primary pointer-events-none pl-4 py-1"
                readOnly
              />
            </div>
            <div className="grid items-center gap-x-2 gap-y-2">
              <Label htmlFor="name">
                Date of Birth:
              </Label>
              <input
                id="name"
                value={user.DateOfBirth}
                className=" rounded-xl focus:border-primary pointer-events-none pl-4 py-1"
                readOnly
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="grid items-center gap-x-2 gap-y-2">
              <Label htmlFor="name">
                Province:
              </Label>
              <input
                id="name"
                value={user.Province}
                className=" rounded-xl focus:border-primary pointer-events-none pl-4 py-1"
                readOnly
              />
            </div>

            <div className="grid items-center gap-x-2 gap-y-2">
              <Label htmlFor="name">
                City:
              </Label>
              <input
                id="name"
                value={user.City}
                className=" rounded-xl focus:border-primary pointer-events-none pl-4 py-1"
                readOnly
              />
            </div>

            <div className="grid items-center gap-x-2 gap-y-2">
              <Label htmlFor="name">
                Zip Code:
              </Label>
              <input
                id="name"
                value={user.ZipCode}
                className=" rounded-xl focus:border-primary pointer-events-none pl-4 py-1"
                readOnly
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
