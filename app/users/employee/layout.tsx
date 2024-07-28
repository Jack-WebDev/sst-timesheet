"use client"

import { logOut } from "@/actions/auth/actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaChevronDown } from "react-icons/fa";
import EmployeeNav from "@/app/users/employee/_components/EmployeeNav";
import { useThemeStore, useUser } from "@/app/store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUser();
  const { isDarkMode } = useThemeStore();

  const fullName = `${user.Name} ${user.Surname}`;

  return (
    <EmployeeNav>

    <div className={`flex flex-col h-screen ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <header className="flex justify-end ml-[20rem] px-8 items-center py-8 pr-16">
      {/* <h3>{pathname}</h3> */}
        <div className="profile flex items-center gap-x-3">
          <Popover>
            <PopoverTrigger className="flex items-center gap-4 text-[#d69436]">
              <b>{fullName}</b>
              <FaChevronDown />
            </PopoverTrigger>
            <PopoverContent className="flex items-center gap-4 w-fit border-2 border-primary rounded-xl">
              <form action={logOut}>
                <button type="submit" className="text-secondary font-semibold">Log Out</button>
              </form>
            </PopoverContent>
          </Popover>
        </div>

        
      </header>

      <div className={`content flex flex-1 ${isDarkMode ? "dark-mode" : "light-mode"}`}>

        <div className="main__content ml-[20rem] flex-1 m-12">

          {children}
        </div>
      </div>
    </div>
    </EmployeeNav>
  );
}
