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
import { toast } from "react-toastify";
import AddEmployee from "../addEmployee/AddEmployee";

export function AddUser() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");

  const handleSave = async () => {
    try {
      await axios.post(`/api/users`, {
        name,
        surname,
        email,
        password,
        department,
        status,
        role,
      });
      localStorage.clear();

      window.location.reload();
    } catch (error) {
      toast.error(
        "An error oocured while saving. Please reload the screen and try again."
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-primary text-white gap-x-4 hover:bg-primary">
          <FaPlusCircle />
          Add New User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
          <AddEmployee/>
        <DialogFooter>
          <Button
            type="submit"
            className="bg-primary text-white rounded-xl hover:bg-primary"
            onClick={handleSave}
          >
            Add User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
