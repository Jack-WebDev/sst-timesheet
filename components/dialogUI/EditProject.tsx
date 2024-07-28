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
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { Textarea } from "../ui/textarea";
import { DepartmentProps } from "@/types/departmentProps";
import useFetchDepartments from "@/hooks/useFetchDepartments";

type User = {
  id: string;
};

export function EditProject({ id }: User) {
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
    try {
      await axios.put(`/api/projects/${id}`, {
        Project_Name: Project_Name,
        Description: Project_Description,
        Project_Manager: Project_Manager,
        Client_Name: Client_Name,
        Department_Id: selectedDepartment,
      });
      window.location.reload();
    } catch (error) {
      toast.error(
        "An error occured while saving data. Please reload the screen and try again.."
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <FaEdit className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
                Project Manager
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
                className="col-span-3 rounded-xl focus:border-primary"
                onChange={(e) => setProject_Team(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="bg-primary text-white rounded-xl hover:bg-primary"
            onClick={handleSave}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
