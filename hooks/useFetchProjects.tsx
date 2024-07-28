"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { Project } from "../types/projectProps";

export default function useFetchProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await axios.get<Project[]>("/api/projects/");
      const projects = res.data;
      setProjects(projects);
    };

    fetchProjects();
  }, []);

  return projects;
}
