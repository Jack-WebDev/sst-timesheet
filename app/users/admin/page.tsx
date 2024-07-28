import Link from "next/link";

import { FaBuilding, FaCalendar, FaUsers } from "react-icons/fa";

import DashboardCard from "@/components/DashboardCard";
import db from "@/database";

export default async function Dashboard() {
  const projects = await db.project.count();
  const departments = await db.department.count();
  const users = await db.user.count();

  return (
    <div className="grid grid-cols-2 gap-12">
      <Link href={"/users/admin/employees"}>
        <DashboardCard icon={FaUsers} total={users} title="Total Employees" />
      </Link>
      <Link href={"/users/admin/departments"}>
        <DashboardCard
          icon={FaBuilding}
          total={departments}
          title="Total Departments"
        />
      </Link>
      <Link href={"/users/admin/projects"}>
        <DashboardCard
          icon={FaCalendar}
          total={projects}
          title="Total Projects"
        />
      </Link>
    </div>
  );
}
