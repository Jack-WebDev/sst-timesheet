"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaAlignCenter,
  FaCalendarCheck,
  FaClock,
  FaMoon,
  FaSun,
  FaTasks,
} from "react-icons/fa";
import {
  Bookmark,
  CalendarClock,
  Check,
  Clock,
  Info,
  LayoutDashboard,
  LineChart,
  NotebookPen,
  Settings,
} from "lucide-react";
import { useThemeStore } from "@/app/store";

function NavMenu({ children }: { children: React.ReactNode }) {
  const { isDarkMode, toggleTheme } = useThemeStore();

  const pathname = usePathname();
  return (
    <div className="flex h-screen w-full">
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
              href={"/users/exec"}
              className={`link flex items-center gap-x-2 ${
                pathname === "/users/exec" ? "active" : ""
              } ${isDarkMode ? "text-white" : "text-black"}`}
            >
              <LayoutDashboard />
              Dashboard
            </Link>

            <Link
              href={"/users/exec/projects"}
              className={`link flex items-center gap-x-2 ${
                pathname === "/users/exec/projects" ? "active" : ""
              } ${isDarkMode ? "text-white" : "text-black"}`}
            >
              <NotebookPen />
              Projects
            </Link>
            <Link
              href={"/users/exec/bookings"}
              className={`link flex items-center gap-x-2 ${
                pathname === "/users/exec/bookings" ? "active" : ""
              } ${isDarkMode ? "text-white" : "text-black"}`}
            >
              <Bookmark />
              Bookings
            </Link>
            <Link
              href={"/users/exec/leave"}
              className={`link flex items-center gap-x-2 ${
                pathname === "/users/exec/leave" ? "active" : ""
              } ${isDarkMode ? "text-white" : "text-black"}`}
            >
              <CalendarClock />
              Leave
            </Link>
            <Link
              href={"/users/exec/timesheets"}
              className={`link flex items-center gap-x-2 ${
                pathname === "/users/exec/timesheets" ? "active" : ""
              } ${isDarkMode ? "text-white" : "text-black"}`}
            >
              <Clock />
              Timesheets
            </Link>
            <Link
              href={"/users/exec/reports"}
              className={`link flex items-center gap-x-2 ${
                pathname === "/users/exec/reports" ? "active" : ""
              } ${isDarkMode ? "text-white" : "text-black"}`}
            >
              <LineChart />
              Reports
            </Link>
            <Link
              href={"/users/exec/settings"}
              className={`link flex items-center gap-x-2 ${
                pathname === "/users/exec/settings" ? "active" : ""
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
              } ${isDarkMode ? "text-white" : "text-black"}`}
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

export default NavMenu;
