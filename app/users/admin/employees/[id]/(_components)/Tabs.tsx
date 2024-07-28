"use client";

import React, { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaUser, FaFileSignature } from "react-icons/fa";
import { FaFolderTree } from "react-icons/fa6";
import AddEmployee from "./ProfileData";

export function TabsDemo() {
  const [activeTab, setActiveTab] = useState("profile");

  const handleTabClick = (tabValue: string) => {
    setActiveTab(tabValue);
  };
  return (
    <Tabs
      defaultValue="profile"
      className="w-full flex items-baseline justify-between gap-x-8"
    >
      <TabsList className="grid border border-gray-500 rounded-xl h-full p-0">
        <TabsTrigger
          value="profile"
          className={`flex justify-start gap-x-2 px-0 pl-4 py-4 shadow-none font-medium md:text-[1rem] w-[15rem] ${
            activeTab === "profile" ? "active_side-tab" : ""
          }`}
          onClick={() => handleTabClick("profile")}
        >
          <FaUser /> Profile
        </TabsTrigger>
        <TabsTrigger
          value="projects"
          className={`flex justify-start gap-x-2 px-0 pl-4 py-4 font-medium md:text-[1rem] w-[15rem] ${
            activeTab === "projects" ? "active_side-tab" : ""
          }`}
          onClick={() => handleTabClick("projects")}
        >
          <FaFolderTree /> Projects
        </TabsTrigger>
        <TabsTrigger
          value="leaves"
          className={`flex justify-start gap-x-2 px-0 pl-4 py-4  font-medium md:text-[1rem] w-[15rem] ${
            activeTab === "leaves" ? "active_side-tab" : ""
          }`}
          onClick={() => handleTabClick("leaves")}
        >
          <FaFileSignature /> Leaves
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="w-full">
        <AddEmployee />
      </TabsContent>
      <TabsContent value="projects">Projects</TabsContent>
      <TabsContent value="leaves">Leaves</TabsContent>
    </Tabs>
  );
}
