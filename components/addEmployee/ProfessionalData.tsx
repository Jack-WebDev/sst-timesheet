"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Calendar } from "@/components/ui/calendar";

import { format } from "date-fns";
import { FaCalendar } from "react-icons/fa";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { useEmployee } from "@/app/store";
import { createEmployee } from "@/actions/admin/employee/personalData";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useFetchDepartments from "@/hooks/useFetchDepartments";
import { DepartmentProps } from "@/types/departmentProps";
import { useEffect, useState } from "react";



const formSchema = z.object({
  EmployeeType: z.string(),
  NDTEmail: z.string().email({ message: "Please add a valid email" }),
  startDate: z.string({
    message: "Please add a start date.",
  }),
  departmentName: z.string(),
  Role: z.string(),
  OfficeLocation: z.string(),
  Position: z.string(),
});

export default function ProfessionalData() {
  const router = useRouter();
  const departmentsData = useFetchDepartments();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [departments, setDepartments] = useState<DepartmentProps[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      EmployeeType: "",
      NDTEmail: "",
      departmentName: "",
      Role: "",
      OfficeLocation: "",
      Position: "",
      startDate: "",
    },
  });

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

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const selectedDept = departments.find(dept => dept.id === selectedDepartment)

    useEmployee.setState({
      ...values,
      departmentId: selectedDepartment,
      departmentName: selectedDept?.Department_Name
    });    
    toast.success("Professional Data has been created successfully.");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        <div className="grid grid-cols-2 gap-x-8">

        <FormField
          control={form.control}
          name="EmployeeType"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="Employee Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white rounded-xl">
                  <SelectItem value="Intern" className="cursor-pointer">Intern</SelectItem>
                  <SelectItem value="PartTime" className="cursor-pointer">Part-Time</SelectItem>
                  <SelectItem value="Contract" className="cursor-pointer">Contract</SelectItem>
                  <SelectItem value="Permanent" className="cursor-pointer">Permanent</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage style={{ color: "red" }} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="NDTEmail"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="NDT Email Address" {...field} className="w-full rounded-xl"/>
              </FormControl>

              <FormMessage style={{ color: "red" }} />
            </FormItem>
          )}
        />
        </div>

        <div className="grid grid-cols-2 gap-x-8">
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


        <FormField
          control={form.control}
          name="Role"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter Role" {...field} className="w-full rounded-xl"/>
              </FormControl>

              <FormMessage style={{ color: "red" }} />
            </FormItem>
          )}
        />
        </div>


          <div className="grid grid-cols-2 gap-x-8">
          <FormField
          control={form.control}
          name="Position"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter Position" {...field} className="w-full rounded-xl"/>
              </FormControl>

              <FormMessage style={{ color: "red" }} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Start Date (YYYY-MM-DD)" {...field} className="w-full rounded-xl"/>
              </FormControl>

              <FormMessage style={{ color: "red" }} />
            </FormItem>
          )}
        />
          </div>

        <FormField
          control={form.control}
          name="OfficeLocation"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Office Location" {...field} className="w-full rounded-xl" />
              </FormControl>
              <FormMessage style={{ color: "red" }} />
            </FormItem>
          )}
        />

        <div className="flex items-end gap-x-4 justify-end">
          <Button className="rounded-xl text-white" >Save</Button>
        </div>
      </form>
    </Form>
  );
}
