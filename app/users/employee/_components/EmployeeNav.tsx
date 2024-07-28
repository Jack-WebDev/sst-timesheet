"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaMoon, FaSun } from "react-icons/fa";
import Image from "next/image";
import React from "react";
import { useThemeStore } from "@/app/store";
import {
  Bookmark,
  CalendarClock,
  Check,
  Clock,
  Info,
  LayoutDashboard,
  Settings,
} from "lucide-react";

export default function EmployeeNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const pathname = usePathname();

  return (
    <div className={`flex h-screen w-full`}>
      <div className="grid grid-rows-[.4fr 1fr] w-[15%] h-full bg-[rgba(162,161,168,0.05)] fixed">
        <>
          <Link href={"/users/employee"}>
            <Image
              src={"/ndt-technologies-web-logo.svg"}
              alt=""
              width={100}
              height={100}
              className="mt-8 mx-auto"
              style={{ width: "50%", height: "auto" }}
            />
            <h2 className="text-center text-primary font-bold text-xl">
              New Dawn <span className="text-secondary">360</span>
            </h2>
          </Link>
          <ul className="flex flex-col mx-8 gap-8">
            <Link
              href={"/users/employee"}
              className={`link flex items-center gap-x-2 ${
                pathname === "/users/employee" ? "active" : ""
              } ${isDarkMode ? "text-white" : "text-black"}`}
            >
              <LayoutDashboard />
              Dashboard
            </Link>

            <Link
              href={"/users/employee/help"}
              className={`link flex items-center gap-x-2 ${
                pathname === "/users/employee/help" ? "active" : ""
              } ${isDarkMode ? "text-white" : "text-black"}`}
            >
              <Info />
              Help Desk
            </Link>

            <Link
              href={"/users/employee/Bookings"}
              className={`link flex items-center gap-x-2 ${
                pathname === "/users/employee/Bookings" ? "active" : ""
              } ${isDarkMode ? "text-white" : "text-black"}`}
            >
              <Bookmark />
              Bookings
            </Link>

            <Link
              href={"/users/employee/Approvals"}
              className={`link flex items-center gap-x-2 ${
                pathname === "/users/employee/Approvals" ? "active" : ""
              } ${isDarkMode ? "text-white" : "text-black"}`}
            >
              <Check />
              Approvals
            </Link>
            <Link
              href={"/users/employee/leave"}
              className={`link flex items-center gap-x-2 ${
                pathname === "/users/employee/leave" ? "active" : ""
              } ${isDarkMode ? "text-white" : "text-black"}`}
            >
              <CalendarClock />
              Leaves
            </Link>

            <Link
              href={"/users/employee/timesheet"}
              className={`link flex items-center gap-x-2 ${
                pathname === "/users/employee/timesheet" ? "active" : ""
              } ${isDarkMode ? "text-white" : "text-black"}`}
            >
              <Clock />
              Timesheets
            </Link>

            <Link
              href={"/users/employee/settings"}
              className={`link flex items-center gap-x-2 ${
                pathname === "/users/employee/settings" ? "active" : ""
              } ${isDarkMode ? "text-white" : "text-black"}`}
            >
              <Settings />
              Settings
            </Link>
          </ul>
          <div className="flex items-center justify-center">
            <button
              className={`flex items-center gap-x-1  py-2 px-4 rounded-s-xl ${
                isDarkMode
                  ? "bg-[rgba(162,161,168,0.1)] text-white"
                  : "bg-primary text-white"
              }`}
              onClick={toggleTheme}
            >
              <FaSun /> Light
            </button>
            <button
              className={`flex items-center gap-x-1 py-2 px-4 rounded-e-xl ${
                isDarkMode
                  ? "bg-primary text-white"
                  : "bg-[rgba(162,161,168,0.1)] text-black"
              }`}
              onClick={toggleTheme}
            >
              <FaMoon /> Dark
            </button>
          </div>
        </>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
