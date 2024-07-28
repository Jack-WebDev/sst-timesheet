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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaUser, FaFileSignature, FaBriefcase, FaFile } from "react-icons/fa";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

import { FaEdit } from "react-icons/fa";
import { FaFolderTree } from "react-icons/fa6";

import { toast } from "react-toastify";
import { TabsDemo } from "../Tabs";
import PersonalData from "./PersonalData";
import ProfessionalData from "./ProfessionalData";
import Documents from "./Documents";

export default function EditProfile() {
  const [activeTab, setActiveTab] = useState("personalData");

  const handleTabClick = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-primary text-white gap-x-4 hover:bg-primary">
          <FaEdit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[40%] mx-auto bg-red-500">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="personalData">
          <TabsList className="flex items-center justify-between">
            <TabsTrigger
              value="personalData"
              className={`flex gap-x-2 px-0 shadow-none font-medium md:text-[1rem] ${
                activeTab === "personalData" ? "active_tab" : ""
              }`}
              onClick={() => handleTabClick("personalData")}
            >
              <FaUser /> Personal Information
            </TabsTrigger>
            <TabsTrigger
              value="professionalData"
              className={`flex gap-x-2 px-0  font-medium md:text-[1rem] ${
                activeTab === "professionalData" ? "active_tab" : ""
              }`}
              onClick={() => handleTabClick("professionalData")}
            >
              <FaBriefcase /> Professional Information
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className={`flex gap-x-2 px-0  font-medium md:text-[1rem] ${
                activeTab === "documents" ? "active_tab" : ""
              }`}
              onClick={() => handleTabClick("documents")}
            >
              <FaFile /> Documents
            </TabsTrigger>
          </TabsList>
          <TabsContent value="personalData">
            <PersonalData />
          </TabsContent>
          <TabsContent value="professionalData">
           <ProfessionalData />
          </TabsContent>
          <TabsContent value="documents">
            <Documents/>
          </TabsContent>
        </Tabs>

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
