"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FaEye } from "react-icons/fa";

import { Project } from "@/types/projectProps";

export function ViewProject({ id }: any) {
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = useCallback(async () => {
    const response = await axios.get<Project[]>(`/api/projects/${id}`);
    setProjects(response.data);
  }, [id]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <FaEye className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="w-[25%]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Project Details</DialogTitle>
        </DialogHeader>
        {projects?.map((project) => (
          <div key={project.id} className="grid gap-4 py-4">
            <div className="flex  items-center gap-4 mb-4">
              <Label htmlFor="projectName" className="text-[1.3rem]">
                Project Name:
              </Label>
              <p className="text-[1.1rem]">{project.Project_Name}</p>
            </div>
            <div className="flex  items-center gap-4 mb-4">
              <Label htmlFor="projectName" className="text-[1.3rem]">
                Project Supervisor:
              </Label>
              <p className="text-[1.1rem]">{project.Project_Manager}</p>
            </div>
            <div className="flex  items-center gap-4 mb-4">
              <Label htmlFor="projectName" className="text-[1.3rem]">
                Client Name:
              </Label>
              <p className="text-[1.1rem]">{project.Client_Name}</p>
            </div>
            <div className="flex  items-center gap-4 mb-4">
              <Label htmlFor="projectName" className="text-[1.3rem]">
                Project Description:
              </Label>
              <p className="text-[1.1rem]">{project.Description}</p>
            </div>

            <div className="flex items-center gap-4">
              <Label htmlFor="projectName" className="text-[1.3rem]">
                Project Team:
              </Label>
              <p className="flex">
                {project?.assignedMembers?.map((member, index) => (
                  <div key={index} className="flex">
                    <span className="text-[1.1rem]">
                      {index !== 0 && ", "}
                      {member}
                    </span>
                  </div>
                ))}
              </p>
            </div>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
}
