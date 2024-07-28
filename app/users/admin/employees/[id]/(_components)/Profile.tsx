"use client";

import { TabsDemo } from "./Tabs";
import { FaBriefcase, FaEnvelope, FaUser } from "react-icons/fa";
import EditProfile from "./Edit/EditProfile";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { UserProps } from "@/types/userProps";

export default function Profile() {
  const params = useParams();
  const userID = params.id;
  const [userData, setUserData] = useState<UserProps[]>([]);
  const nameLetter = userData[0]?.Name.charAt(0);
  const lastNameLetter = userData[0]?.Surname.charAt(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await axios.get(`/api/users/${userID}`);
      const usersData = await res.data;
      setUserData(usersData);
    };

    fetchUserData();
  }, [userID]);

  return (
    <>
      {userData?.map((user) => (
        <div
          className="bg-[#F5F5F5] p-8 rounded-xl w-[80%] mx-auto"
          key={user.id}
        >
          <div className="flex justify-between items-center">
            <div className="flex justify-between items-center gap-x-4">
              <div className="bg-secondary p-4 rounded-full">
               <p className="text-2xl text-white font-bold">{nameLetter} {lastNameLetter}</p>
              </div>
              <div>

              <div className="flex items-center gap-x-2">
                <FaUser className="mr-2 h-4 w-4" />
                {user?.Name} {user?.Surname}
              </div>

              <div className="flex items-center gap-x-2">
                <FaBriefcase className="mr-2 h-4 w-4" />
                {user?.Position}
              </div>

              <div className="flex items-center gap-x-2">
                <FaEnvelope className="mr-2 h-4 w-4" />
                {user?.NDTEmail}
              </div>
              </div>
            </div>

            <div>
              <EditProfile  />
            </div>
          </div>

          <hr className="bg-secondary h-[2px] w-full my-8" />

          <TabsDemo />
        </div>
      ))}
    </>
  );
}
