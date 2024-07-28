"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { EditProject } from "../dialogUI/EditProject";
import { AddProject } from "../dialogUI/AddProject";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { ViewProject } from "../dialogUI/ViewProject";
import { Project } from "../../types/projectProps";
import useFetchProjects from "@/hooks/useFetchProjects";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/app/store";

const ProjectTable = () => {
  const projectsData = useFetchProjects();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>("");
  const { isDarkMode } = useThemeStore();
  const router = useRouter();

  useEffect(() => {
    if (projectsData) {
      setProjects(projectsData);
      setFilteredProjects(projectsData);
    }
  }, [projectsData]);

  const truncateText = (text: string, wordLimit: number) => {
    if (!text) return "No Description";

    const words = text.split(" ");

    if (words.length > 1) {
      if (words.length <= wordLimit) {
        return text;
      }
      return words.slice(0, wordLimit).join(" ") + ".....";
    }

    if (text.length <= 15) {
      return text;
    }
    return text.slice(0, 15) + ".....";
  };

  const handleDelete = async (id: any) => {
    try {
      await axios.delete(`/api/projects/${id}`);
      router.refresh();
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error(
        "An error occured while deleting project. Please reload and try again."
      );
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilter(searchTerm);
    const filtered = projects.filter((project) =>
      project.Project_Name.toLowerCase().includes(searchTerm)
    );
    setFilteredProjects(filtered);
  };

  return (
    <div className="w-[60%] mx-auto mt-12 border-2 border-primary p-8 rounded-2xl ">
      <div className="flex items-center justify-between mb-12">
        <input
          type="text"
          placeholder="Filter by project name..."
          className="filter_input w-1/2 px-8 py-[5px] border border-black focus:border-primary"
          value={filter}
          onChange={handleFilterChange}
        />
        <AddProject />
      </div>
      <table className="w-full">
        <thead className="relative -top-4">
          <tr className="text-left text-gray-500">
            <th className=" font-normal">Project Name</th>
            <th className=" font-normal">Project Manager</th>
            <th className=" font-normal">Client Name</th>
            <th className=" font-normal">Department Name</th>

            <th className=" font-normal">Actions</th>
          </tr>
        </thead>
        <tbody
          className={`${
            isDarkMode
              ? "text-white"
              : "text-black odd:bg-white even:bg-slate-100 "
          }`}
        >
          {filteredProjects.map((project) => (
            <tr key={project.id}>
              <td>{truncateText(project.Project_Name, 5)}</td>
              <td>{truncateText(project.Project_Manager, 5)}</td>
              <td>{truncateText(project.Client_Name, 5)}</td>
              <td>{truncateText(project.department?.Department_Name, 5)}</td>
              <td className="flex items-center justify-center gap-2">
                <ViewProject id={project.id} />
                <EditProject id={project.id} />
                <FaTrashAlt
                  className="cursor-pointer"
                  onClick={() => handleDelete(project.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
