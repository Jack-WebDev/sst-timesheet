"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalData from "@/components/addEmployee/PersonalData";
import ProfessionalData from "@/components/addEmployee/ProfessionalData";
import Documents from "@/components/addEmployee/Documents";
import { FaBriefcase, FaFile, FaLock, FaUser } from "react-icons/fa";
import { useState } from "react";

export default function AddEmployee() {
  const [activeTab, setActiveTab] = useState("personalData");

  const handleTabClick = (tabValue: string) => {
    setActiveTab(tabValue);
  };
  return (
    <Tabs
      defaultValue="personalData"
      className="bg-[#F5F5F5] w-[60%] mx-auto rounded-xl p-4"
    >
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
        <Documents />
      </TabsContent>


    </Tabs>
  );
}
