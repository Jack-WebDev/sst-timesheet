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

type User = {
  id: string;
};

export function EditDepartment({ id }: User) {
  const [department, setDepartment] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    await axios.get("/api/departments");
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/departments/${id}`, {
        Department_Name: department,
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
          <DialogTitle>Edit Department</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Department
            </Label>
            <Input
              id="department"
              value={department}
              className="col-span-3 rounded-xl focus:border-primary"
              onChange={(e) => setDepartment(e.target.value)}
            />
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
