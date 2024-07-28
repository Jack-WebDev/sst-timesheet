"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  format,
  formatDate,
  isValid,
  parse,
  startOfDay,
} from "date-fns";
import { DateRange as DayPickerDateRange } from "react-day-picker";
import { formatTime } from "@/utils/formatTimesheet";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useEffect, useRef, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import axios, { AxiosError } from "axios";
import { useThemeStore, useUser } from "@/app/store";
import { TimesheetProps } from "@/types/timesheetProps";
import { Project } from "@/types/projectProps";
import { TaskProps } from "@/types/taskProps";
import { TableRowsProps } from "@/types/tableRowsProps";
import useFetchTimesheets from "@/hooks/useFetchTimesheets";
import useFetchProjects from "@/hooks/useFetchProjects";
import useFetchUsers from "@/hooks/useFetchUsers";
import { UserProps } from "@/types/userProps";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Clock } from "lucide-react";

type FormDetails = {
  month: string;
  name: string;
  role: string;
  projectManager: string;
  projectName: string;
};

const initialData: TableRowsProps[] = [
  {
    weekday: new Date().toISOString().split("T")[0],
    typeOfDay: "",
    totalHours: 0,
    totalMinutes: 0,
    tasks: [],
    comment: "",
  },
  {
    weekday: new Date().toISOString().split("T")[0],
    typeOfDay: "",
    totalHours: 0,
    totalMinutes: 0,
    tasks: [],
    comment: "",
  },
  {
    weekday: new Date().toISOString().split("T")[0],
    typeOfDay: "",
    totalHours: 0,
    totalMinutes: 0,
    tasks: [],
    comment: "",
  },
  {
    weekday: new Date().toISOString().split("T")[0],
    typeOfDay: "",
    totalHours: 0,
    totalMinutes: 0,
    tasks: [],
    comment: "",
  },
  {
    weekday: new Date().toISOString().split("T")[0],
    typeOfDay: "",
    totalHours: 0,
    totalMinutes: 0,
    tasks: [],
    comment: "",
  },
  {
    weekday: new Date().toISOString().split("T")[0],
    typeOfDay: "",
    totalHours: 0,
    totalMinutes: 0,
    tasks: [],
    comment: "",
  },
  {
    weekday: new Date().toISOString().split("T")[0],
    typeOfDay: "",
    totalHours: 0,
    totalMinutes: 0,
    tasks: [],
    comment: "",
  },
];

export default function Timesheet() {
  const timesheetData = useFetchTimesheets();
  const projectsData = useFetchProjects();
  const userData = useFetchUsers();
  const { isDarkMode } = useThemeStore();
  const [tableData, setTableData] = useState<TableRowsProps[]>(initialData);
  const [data, setFilteredTimesheets] = useState<TimesheetProps[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const userZ = useUser();
  const fullName = `${userZ.Name} ${userZ.Surname}`;
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<UserProps[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProps[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [date, setDate] = useState<DayPickerDateRange | undefined>(undefined);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isAddingTask, setIsAddingTask] = useState(false);
  const router = useRouter();

  const [formDetails, setFormDetails] = useState<FormDetails>({
    month: "",
    name: fullName,
    role: userZ.Position,
    projectManager: "",
    projectName: "",
  });

  useEffect(() => {
    if (timesheetData) {
      const filteredData = timesheetData.filter(
        (item) => item.userId === userZ.id
      );
      setFilteredTimesheets(filteredData);
    }
  }, [timesheetData, userZ.id]);

  useEffect(() => {
    if (userData) {
      setUsers(userData);
    }
  }, [userData]);

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          (user.Name.toLowerCase().includes(query.toLowerCase()) ||
            user.Surname.toLowerCase().includes(query.toLowerCase())) &&
          user.id !== userZ.id
      )
    );
  }, [query, users, userZ]);

  useEffect(() => {
    if (projectsData) {
      setProjects(projectsData);
    }
  }, [projectsData]);

  const formattedDate = `${
    addDays(date?.from ?? new Date(), 1)
      .toISOString()
      .split("T")[0]
  } to ${
    addDays(date?.to ?? new Date(), 1)
      .toISOString()
      .split("T")[0]
  }`;

  const handleAddTask = (index: number) => {
    setTableData((prevData) => {
      const newData = [...prevData];
      newData[index].tasks.push({
        projectName: "",
        taskPerformed: "",
        taskStatus: "",
        hours: 0,
        minutes: 0,
      });
      const { totalHours, totalMinutes } = calculateTotalTime(
        newData[index].tasks
      );
      newData[index].totalHours = totalHours;
      newData[index].totalMinutes = totalMinutes;
      return newData;
    });
  };

  const validateForm = () => {
    let isValid = true;

    if (!formDetails.month) {
      toast.error("Month is required");
      isValid = false;
    }

    if (!formDetails.projectManager) {
      toast.error("Project Supervisor is required");
      isValid = false;
    }
    if (!date) {
      toast.error("Date is required");
      isValid = false;
    }

    return isValid;
  };

  const handleYearChange = (year: any) => {
    setSelectedYear(year);
  };

  const handleDeleteTask = (rowIndex: number, taskIndex: number) => {
    setTableData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex].tasks.splice(taskIndex, 1);

      // Recalculate total hours and minutes
      const { totalHours, totalMinutes } = calculateTotalTime(
        newData[rowIndex].tasks
      );
      newData[rowIndex].totalHours = totalHours;
      newData[rowIndex].totalMinutes = totalMinutes;

      return newData;
    });
  };

  const handleOptionClick = (user: UserProps) => {
    setFormDetails({
      ...formDetails,
      projectManager: `${user.Name} ${user.Surname}`,
    });
    setIsDropdownOpen(false);
    if (inputRef.current) {
      inputRef.current.value = `${user.Name} ${user.Surname}`;
    }
  };

  const handleChange = (
    rowIndex: number,
    taskIndex: number,
    field: string,
    value: any
  ) => {
    setTableData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex].tasks[taskIndex] = {
        ...newData[rowIndex].tasks[taskIndex],
        [field]: value,
      };

      const { totalHours, totalMinutes } = calculateTotalTime(
        newData[rowIndex].tasks
      );

      const maxTotalMinutes = 24 * 60;
      const currentTotalMinutes = totalHours * 60 + totalMinutes;
      if (currentTotalMinutes > maxTotalMinutes) {
        let remainingMinutes = maxTotalMinutes;
        newData[rowIndex].tasks.forEach((task) => {
          const taskMinutes = task.hours * 60 + task.minutes;
          if (remainingMinutes - taskMinutes >= 0) {
            remainingMinutes -= taskMinutes;
          } else {
            if (field === "hours") {
              task.hours = Math.floor(remainingMinutes / 60);
              task.minutes = remainingMinutes % 60;
            } else if (field === "minutes") {
              task.minutes = remainingMinutes;
              task.hours = Math.floor(remainingMinutes / 60);
            }
            remainingMinutes = 0;
          }
        });
      }

      const adjustedTotalTime = calculateTotalTime(newData[rowIndex].tasks);
      newData[rowIndex].totalHours = adjustedTotalTime.totalHours;
      newData[rowIndex].totalMinutes = adjustedTotalTime.totalMinutes;

      return newData;
    });
  };

  const handleFormChange = (field: keyof FormDetails, value: string) => {
    if (field === "month") {
      setDate(undefined);
      setTableData([]);
    }
    setFormDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const previousYears = ["2019", "2020", "2021", "2022", "2023"];

  const getMonthIndex = (monthName: string) => {
    return months.indexOf(monthName);
  };

  const handleDateSelect = (range: DayPickerDateRange | undefined) => {
    if (range?.from && range.to) {
      const daysDifference = differenceInDays(range.to, range.from);
      if (daysDifference > 6) {
        toast.error("The date range cannot exceed 7 days.");
      } else {
        setDate(range);
        setPopoverOpen(false);
        generateDateRange(range.from, range.to);
      }
    } else {
      setDate(range);
    }
  };

  const generateDateRange = (startDate: Date, endDate: Date) => {
    const dates = eachDayOfInterval({ start: startDate, end: endDate });
    const formattedDates = dates.map((date) => ({
      weekday: format(date, "yyyy-MM-dd"),
      totalHours: 0,
      totalMinutes: 0,
      comment: "",
      tasks: [],
      userId: "",
      typeOfDay: "",
    }));
    setTableData(formattedDates);
  };

  const selectedMonthIndex = getMonthIndex(formDetails.month);

  const handleSubmit = async () => {
    if (validateForm()) {
      const formData = {
        combinedData: {
          ...formDetails,
          weeklyPeriod: formattedDate,
          timesheet: tableData,
          userID: userZ.id,
          Approval_Status: "Pending",
        },
      };

      try {
        setLoading(true);
        await axios.post("/api/timesheets", { formData });
        setLoading(false);

        window.location.reload();
      } catch (error) {
        setLoading(false);
        console.error("Error submitting form:", error);
      }
    }
  };

  const validateTask = (task: TaskProps) => {
    return (
      task.projectName.trim() !== "" &&
      task.taskPerformed.trim() !== "" &&
      task.taskStatus.trim() !== "" &&
      (task.hours > 0 || task.minutes > 0)
    );
  };

  const calculateTotalTime = (tasks: TaskProps[]) => {
    let totalMinutes = 0;
    tasks.forEach((task) => {
      totalMinutes += task.hours * 60 + task.minutes;
    });
    const totalHours = Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;
    return { totalHours, totalMinutes };
  };

  const handleInputsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.toLowerCase();
    const filtered = userData.filter(
      (user) =>
        user.Name.toLowerCase().includes(inputValue) ||
        user.Surname.toLowerCase().includes(inputValue)
    );
    setFilteredUsers(filtered);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: any = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      console.log(jsonData);
      function cleanArray(arr: any[]): any[] {
        return arr
          .filter(
            (item) =>
              item !== undefined &&
              item !== null &&
              item !== "" &&
              !(Array.isArray(item) && item.length === 0)
          )
          .map((item) => (Array.isArray(item) ? cleanArray(item) : item));
      }
      // Extract data from the JSON representation of the sheet
      const cleanedData = cleanArray(jsonData);
      console.log(cleanedData);

      const month = cleanedData[1][1];
      const consultantName = cleanedData[2][1];
      const position = cleanedData[3][1];
      const clientName = cleanedData[4][1];
      const projectName = cleanedData[5][1];
      const weeklyPeriod = cleanedData[7][0];

      const weeklyDataStartRow = 9;
      const weeklyDataEndRow = 14; // Adjust according to your sheet's structure

      const date = [];
      const timeFrom = [];
      const timeTo = [];

      const totalHours = [];
      const performedTasks = [];
      const consultantsComment = [];

      const formatDate = (dateStr: any) => {
        if (typeof dateStr !== "string" || dateStr.trim() === "") {
          return "Invalid Date";
        }

        let parsedDate = parse(dateStr, "dd/MM/yyyy", new Date());

        if (!isValid(parsedDate)) {
          parsedDate = parse(dateStr, "MM/dd/yyyy", new Date());
        }

        return isValid(parsedDate)
          ? format(parsedDate, "dd-MMM-yyyy")
          : "Invalid Date";
      };

      for (let i = weeklyDataStartRow; i < weeklyDataEndRow; i++) {
        if (cleanedData[i] && cleanedData[i].length > 0) {
          date.push(formatDate(cleanedData[i][0]));
          timeFrom.push(formatTime(cleanedData[i][1]));
          timeTo.push(formatTime(cleanedData[i][2]));
          totalHours.push(cleanedData[i][3]);
          performedTasks.push(cleanedData[i][4]);
          consultantsComment.push(cleanedData[i][5]);
        }
      }

      const extractedData = {
        month,
        consultantName,
        position,
        clientName,
        projectName,
        weeklyPeriod,
        date,
        timeFrom,
        timeTo,
        totalHours,
        performedTasks,
        consultantsComment,
      };

      console.log(extractedData);
      try {
        const response = await axios.post(
          "/api/timesheets/uploads",
          extractedData
        );
        if (response.data === "success") {
          toast.success("Timesheet submitted successfully");
        }
      } catch (error) {
        console.error("Failed to save timesheet:", error as AxiosError);
      }
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, maxFiles: 1 });

  return (
    <>
      {loading && <Loading />}
      <div className="mb-8">
        <PageHeader title="Timesheets" Icon={Clock} />
      </div>
      <div className="grid border-2 border-primary p-8 rounded-xl">
        <form className="grid grid-cols-3 border-b-2 border-secondary pb-8 gap-y-4 items-end">
          <div>
            <label className="grid w-[60%] mb-1 text-[1.2rem]">Name:</label>
            <input
              className="px-4 py-1 border border-primary bg-transparent rounded-xl pointer-events-none"
              value={fullName}
              readOnly
            />
          </div>
          <div>
            <label className="grid w-[60%] mb-1 text-[1.2rem]">Position:</label>
            <input
              className="px-4 py-1 border border-primary bg-transparent rounded-xl w-[70%] pointer-events-none"
              value={userZ.Position}
              readOnly
            />
          </div>
          <div>
            <label className="grid w-[60%] mb-1 text-[1.2rem]">Month:</label>
            <select
              className={`border border-primary p-2 rounded-xl ${
                isDarkMode ? "bg-[rgba(0,0,0,0.3)]" : "bg-[#F5F5F5]"
              }`}
              value={formDetails.month}
              onChange={(e) => handleFormChange("month", e.target.value)}
            >
              <option value="" disabled>
                Select a month
              </option>
              {months.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
            {errors.month && (
              <p className="text-red-500 font-semibold">{errors.month}</p>
            )}
          </div>
          <div>
            <label className="grid w-[75%] mb-1 text-[1.2rem]">
              Previous Year(If Applicable):
            </label>
            <select
              className={`border border-primary p-2 rounded-xl ${
                isDarkMode ? "bg-[rgba(0,0,0,0.3)]" : "bg-[#F5F5F5]"
              }`}
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
            >
              <option value="">Select a previous year</option>
              {previousYears.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="period grid">
            <label htmlFor="date" className="mb-1 text-[1.2rem]">
              Weekly Period:
            </label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger
                asChild
                className="border border-primary bg-transparent rounded-xl"
              >
                <Button
                  id="date"
                  variant={"outline"}
                  className={`w-[300px] justify-start text-left font-normal ${
                    !date && "text-muted-foreground"
                  }`}
                  onClick={() => setPopoverOpen(true)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd")} -{" "}
                        {format(date.to, "LLL dd")}
                      </>
                    ) : (
                      format(date.from, "LLL dd")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={
                    selectedMonthIndex !== -1
                      ? new Date(selectedYear, selectedMonthIndex)
                      : undefined
                  }
                  fromMonth={
                    selectedMonthIndex !== -1
                      ? new Date(selectedYear, selectedMonthIndex)
                      : undefined
                  }
                  toMonth={
                    selectedMonthIndex !== -1
                      ? new Date(selectedYear, selectedMonthIndex)
                      : undefined
                  }
                  selected={date}
                  onSelect={handleDateSelect}
                  numberOfMonths={1}
                  className={`px-4 py-1 border border-primary bg-transparent focus:outline-primary rounded-xl ${
                    isDarkMode ? "bg-[rgba(0,0,0,0.3)]" : "bg-[#F5F5F5]"
                  }`}
                  weekStartsOn={1}
                  showOutsideDays={true}
                  disableNavigation={true}
                  toDate={startOfDay(new Date())}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="relative grid justify-start items-end h-[10vh]">
            <label className="text-[1.2rem]">Supervisor:</label>
            <input
              type="text"
              placeholder="Search your supervisor...."
              onChange={(e) => {
                handleInputsChange && handleInputsChange(e);
              }}
              onClick={() => toggleDropdown && toggleDropdown()}
              ref={inputRef}
              className="px-4 py-1 border border-primary bg-transparent rounded-xl"
            />

            {isDropdownOpen && (
              <ul
                className={`absolute left-[20px] top-[6rem]  rounded-xl py-2 px-4 shadow-xl z-10 max-h-40 overflow-y-auto ${
                  isDarkMode ? "bg-[#A2A1A8]" : "bg-white"
                }`}
              >
                {filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    className={`cursor-pointer borderStyle ${
                      isDarkMode ? "hover:text-black" : "hover:bg-[#F5F5F5]"
                    }`}
                    onClick={() => handleOptionClick(user)}
                  >
                    {user.Name} {user.Surname}
                  </li>
                ))}
              </ul>
            )}

            {errors.projectManager && (
              <p className="text-red-500 font-semibold">
                {errors.projectManager}
              </p>
            )}
          </div>
        </form>
        <div className="h-[35vh] overflow-y-scroll">
          <table className="mt-8">
            <thead className="pb-2">
              <tr>
                <th>Weekday</th>
                <th>Type of Day </th>
                <th>Total Time</th>
                <th>Tasks Performed</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => {
                const allFieldsComplete = row.tasks.every(validateTask);
                const typeOfDay = row.typeOfDay.trim() !== "";

                return (
                  <tr key={rowIndex} className="border-b border-secondary py-2">
                    <td className="text-center">
                      <input
                        className="py-1 px-2 border border-primary bg-transparent rounded-xl pointer-events-none"
                        type="date"
                        value={row.weekday}
                        onChange={(e) =>
                          setTableData((prevData) => {
                            const newData = [...prevData];
                            newData[rowIndex].weekday = e.target.value;
                            return newData;
                          })
                        }
                        readOnly
                      />
                    </td>
                    <td className="text-center">
                      <select
                        name=""
                        id=""
                        className={`w-[10vw] border border-primary p-2 rounded-xl ${
                          isDarkMode ? "bg-[rgba(0,0,0,0.3)]" : "bg-[#F5F5F5]"
                        }`}
                        value={row.typeOfDay}
                        onChange={(e) =>
                          setTableData((prevData) => {
                            const newData = [...prevData];
                            newData[rowIndex].typeOfDay = e.target.value;
                            return newData;
                          })
                        }
                      >
                        <option value="">Select type of day</option>
                        <option value="Public Holiday">Public Holiday</option>
                        <option value="Normal Day">Work Day</option>
                        <option value="Weekend">Weekend</option>
                        <option value="Day-Off">Day-Off</option>
                        <option value="Leave">Leave</option>
                      </select>
                    </td>
                    <td className="text-center w-[10%]">
                      <input
                        className="pointer-events-none w-[100%] px-4 border border-primary bg-transparent"
                        type="text"
                        value={`${row.totalHours} hrs ${row.totalMinutes} mins`}
                        readOnly
                      />
                    </td>

                    <td className="grid text-center">
                      {row.tasks.map((task, taskIndex) => (
                        <div
                          key={taskIndex}
                          className="flex justify-center items-end mb-2 gap-x-4"
                        >
                          <select
                            className={`w-[8vw] h-[60%] border border-primary p-2 rounded-xl ${
                              isDarkMode
                                ? "bg-[rgba(0,0,0,0.3)]"
                                : "bg-[#F5F5F5]"
                            }`}
                            value={task.projectName}
                            onChange={(e) =>
                              handleChange(
                                rowIndex,
                                taskIndex,
                                "projectName",
                                e.target.value
                              )
                            }
                          >
                            <option value={""}>Select Project</option>
                            {projects.map((project) => (
                              <option
                                key={project.id}
                                value={project.Project_Name}
                              >
                                {project.Project_Name}
                              </option>
                            ))}
                          </select>
                          <textarea
                            className={`py-1 px-4 border border-black rounded-xl w-1/2 ${
                              isDarkMode ? "text-black" : "text-black"
                            }`}
                            placeholder="Describe the task performed....."
                            value={task.taskPerformed}
                            onChange={(e) =>
                              handleChange(
                                rowIndex,
                                taskIndex,
                                "taskPerformed",
                                e.target.value
                              )
                            }
                          />
                          <select
                            className={`w-[8vw] h-[60%] border border-primary p-2 rounded-xl ${
                              isDarkMode
                                ? "bg-[rgba(0,0,0,0.3)]"
                                : "bg-[#F5F5F5]"
                            }`}
                            value={task.taskStatus}
                            onChange={(e) =>
                              handleChange(
                                rowIndex,
                                taskIndex,
                                "taskStatus",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select status</option>
                            <option value="In-Progress">In-Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Continuous">Continuous</option>
                          </select>
                          <div className="grid w-[13%] justify-items-center">
                            <label htmlFor="hours">Hours</label>
                            <input
                              className={`py-1 px-2 border border-black rounded-xl w-full ${
                                isDarkMode ? "text-black" : "text-black"
                              }`}
                              type="number"
                              min={0}
                              max={24}
                              value={task.hours}
                              onChange={(e) =>
                                handleChange(
                                  rowIndex,
                                  taskIndex,
                                  "hours",
                                  parseInt(e.target.value, 10) || 0
                                )
                              }
                              placeholder="Hours"
                            />
                          </div>
                          <div className="grid w-[10%] justify-items-center">
                            <label htmlFor="minutes">Minutes</label>
                            <input
                              className={`py-1 px-2 border border-black rounded-xl w-full ${
                                isDarkMode ? "text-black" : "text-black"
                              }`}
                              type="number"
                              min={0}
                              max={60}
                              value={task.minutes}
                              onChange={(e) =>
                                handleChange(
                                  rowIndex,
                                  taskIndex,
                                  "minutes",
                                  parseInt(e.target.value, 10) || 0
                                )
                              }
                              placeholder="Minutes"
                            />
                          </div>

                          <FaTrash
                            onClick={() =>
                              handleDeleteTask(rowIndex, taskIndex)
                            }
                            className="cursor-pointer text-red-600 text-[2.5rem] relative bottom-1 right-1"
                          />
                        </div>
                      ))}
                      <Button
                        onClick={() => {
                          setIsAddingTask(true);
                          handleAddTask(rowIndex);
                          setIsAddingTask(false);
                        }}
                        className={`grid w-fit justify-self-center rounded-xl text-white bg-secondary hover:text-secondary hover:font-semibold  mt-2 ${
                          isDarkMode ? "hover:bg-white" : "hover:bg-transparent"
                        } ${
                          isAddingTask || !allFieldsComplete || !typeOfDay
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={
                          isAddingTask || !allFieldsComplete || !typeOfDay
                        }
                      >
                        Add Task
                      </Button>
                    </td>

                    <td className="text-center">
                      <textarea
                        className={`px-4 py-2 border border-black rounded-xl text-black`}
                        placeholder="Add a comment..."
                        value={row.comment}
                        onChange={(e) =>
                          setTableData((prevData) => {
                            const newData = [...prevData];
                            newData[rowIndex].comment = e.target.value;
                            return newData;
                          })
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-baseline px-8">
          <Button
            variant={"secondary"}
            className="rounded-xl text-white"
            onClick={() =>
              router.push("/users/employee/timesheet/timesheet-details")
            }
          >
            View Your Timesheets
          </Button>

          <div
            {...getRootProps()}
            style={{
              border: `2px dashed var(--primary-color)`,
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <input {...getInputProps()} />
            <p>Drag and drop an Excel file here, or click to select one</p>
            <p className="text-center underline font-bold">
              Drop one file at a time
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="mt-8 grid justify-self-end w-[15%]"
              >
                Submit
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[70%]">
              <DialogHeader>
                <DialogTitle className="text-3xl text-secondary">
                  Are you ready to submit?
                </DialogTitle>
              </DialogHeader>
              <div>
                <table className="w-full">
                  <thead className="text-black">
                    <tr>
                      <th>Weekday</th>
                      <th>Type Of Day</th>
                      <th>Total Time</th>
                      <th>Project Name</th>
                      <th>Tasks Performed</th>
                      <th>Task Status</th>
                      <th>Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.length > 0
                      ? tableData.map((r, index) => (
                          <tr key={index} className="border-b border-secondary">
                            <td className="text-black text-center">
                              <p>{r.weekday}</p>
                            </td>
                            <td className="text-black text-center">
                              <p>{r.typeOfDay === "" ? "N/A" : r.typeOfDay}</p>
                            </td>
                            <td className="text-black text-center">
                              <p>{`${r.totalHours} hrs ${r.totalMinutes} mins`}</p>
                            </td>
                            <td className="text-black text-center">
                              {r.tasks && r.tasks.length > 0 ? (
                                r.tasks.map((t) => (
                                  <div key={t.id}>
                                    <p>
                                      {t.projectName === ""
                                        ? "N/A"
                                        : t.projectName}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <p>N/A</p>
                              )}
                            </td>
                            <td className="text-black text-center">
                              {r.tasks && r.tasks.length > 0 ? (
                                r.tasks.map((t) => (
                                  <div key={t.id}>
                                    <p>
                                      {t.taskPerformed === ""
                                        ? "N/A"
                                        : t.taskPerformed}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <p>N/A</p>
                              )}
                            </td>

                            <td className="text-black text-center">
                              {r.tasks && r.tasks.length > 0 ? (
                                r.tasks.map((t) => (
                                  <div key={t.id}>
                                    <p>{t.taskStatus}</p>
                                  </div>
                                ))
                              ) : (
                                <span>N/A</span>
                              )}
                            </td>
                            <td className="text-black text-center">
                              <p>{r.comment === "" ? "N/A" : r.comment}</p>
                            </td>
                          </tr>
                        ))
                      : null}
                  </tbody>
                </table>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className={`${isDarkMode ? "text-black" : "text-black"}`}
                  >
                    Cancel
                  </Button>
                </DialogClose>{" "}
                <Button type="submit" onClick={handleSubmit}>
                  Submit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
