"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { DepartmentProps } from "../types/departmentProps";

export default function useFetchDepartments() {
  const [departments, setDepartments] = useState<DepartmentProps[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await axios.get<DepartmentProps[]>("/api/departments/");
      const departments = res.data;
      setDepartments(departments);
    };

    fetchDepartments();
  }, []);

  return departments;
}
