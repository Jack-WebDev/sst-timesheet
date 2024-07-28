"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlusCircle } from "react-icons/fa";
import { Textarea } from "../ui/textarea";
import { DepartmentProps } from "@/types/departmentProps";
import { Project } from "@/types/projectProps";
import useFetchDepartments from "@/hooks/useFetchDepartments";
import { z } from "zod";
import { toast } from "react-toastify";

const projectSchema = z.object({
  department: z.string().nonempty('Please select a department'),
  clientName: z.string().min(1, 'Client name is required'),
  projectName: z.string().min(1, 'Project name is required'),
  projectDescription: z.string().min(1, 'Project description is required'),
  projectManager: z.string().min(1, 'Project supervisor is required'),
  projectTeam: z.string().min(1, 'Project team members are required'),
});

export function AddProject() {
  const departmentsData = useFetchDepartments();
  const [Project_Name, setProject_Name] = useState("");
  const [Project_Manager, setProject_Manager] = useState("");
  const [Client_Name, setClient_Name] = useState("");
  const [Project_Team, setProject_Team] = useState("");
  const [Project_Description, setProject_Description] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [departments, setDepartments] = useState<DepartmentProps[]>([]);

  useEffect(() => {
    if (departmentsData) {
      setDepartments(departmentsData);
    }
  }, [departmentsData]);

  const handleDepartmentChange = async (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const departmentId = event.target.value as string;
    setSelectedDepartment(departmentId);
  };

  const handleSave = async () => {
    const formData = {
      department: selectedDepartment,
      clientName: Client_Name,
      projectName: Project_Name,
      projectDescription: Project_Description,
      projectManager: Project_Manager,
      projectTeam: Project_Team,
    };

    try {
      projectSchema.parse(formData);
      await axios.post<Project>(`/api/projects/`, {
        Project_Name: Project_Name,
        Description: Project_Description,
        Department_Id: selectedDepartment,
        Project_Manager: Project_Manager,
        Client_Name: Client_Name,
        assignedMembers: Project_Team.split(","),
      });
  
      window.location.reload();
      
    } catch (e) {
      if (e instanceof z.ZodError) {
        // Handle validation errors
        console.error('Validation failed', e.errors);
        // Display validation errors to the user (example)
        e.errors.forEach(error => {
          toast.error(error.message);
        });
      } else {
        // Handle other errors
        console.error('An unexpected error occurred', e);
      }
    }


  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-primary text-white gap-x-4 hover:bg-primary">
          <FaPlusCircle />
          Add New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              NDT Division
            </Label>
            <select
              name="department"
              className="focus:border-primary"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
            >
              <option value={""}>Select Department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.Department_Name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="clientName" className="text-right">
              Client Name
            </Label>
            <Input
              id="clientName"
              value={Client_Name}
              className="col-span-3 rounded-xl focus:border-primary"
              onChange={(e) => setClient_Name(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectName" className="text-right">
              Project Name
            </Label>
            <Input
              id="projectName"
              value={Project_Name}
              className="col-span-3 rounded-xl focus:border-primary"
              onChange={(e) => setProject_Name(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectDescription" className="text-right">
              Project Description
            </Label>
            <Textarea
              id="projectDescription"
              value={Project_Description}
              className="col-span-3 rounded-xl focus:border-primary"
              onChange={(e) => setProject_Description(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectManager" className="text-right">
              Project Supervisor
            </Label>
            <Input
              id="projectManager"
              value={Project_Manager}
              className="col-span-3 rounded-xl focus:border-primary"
              onChange={(e) => setProject_Manager(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="teamMembers" className="text-right">
              Project Team Members
            </Label>
            <Textarea
              id="teamMembers"
              placeholder="Marc Jones, Phila Mathambo, Sizwe Shibamvu....."
              value={Project_Team}
              className="col-span-3 rounded-xl focus:border-primary placeholder:text-gray-400"
              onChange={(e) => setProject_Team(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            className="bg-primary text-white rounded-xl hover:bg-primary"
            onClick={handleSave}
          >
            Add Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
