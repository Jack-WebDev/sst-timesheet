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
import { useState } from "react";
import axios from "axios";
import { FaPlusCircle } from "react-icons/fa";
import { z } from "zod";
import { toast } from "react-toastify";

const departmentSchema = z.object({
  departmentName: z.string().min(1, 'Department name is required'),
});

export function AddDepartment() {
  const [Department_Name, setDepartment_Name] = useState("");

  const handleSave = async () => {
    const formData = {
      departmentName: Department_Name,
    };

    
    try {
      departmentSchema.parse(formData);
      await axios.post(`/api/departments`, {
        Department_Name,
      });
      window.location.reload();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        console.error('Validation failed', error.errors);
        // Display validation errors to the user (example)
        error.errors.forEach(error => {
          toast.error(error.message);
        });
      } else {
        // Handle other errors
        console.error('An unexpected error occurred', error);
      }
    }

  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-primary text-white gap-x-4 hover:bg-primary">
          <FaPlusCircle />
          Add New Department
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Department
            </Label>
            <Input
              id="name"
              value={Department_Name}
              className="col-span-3 rounded-xl focus:border-primary"
              onChange={(e) => setDepartment_Name(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            className="bg-primary text-white rounded-xl hover:bg-primary"
            onClick={handleSave}
          >
            Add Department
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
