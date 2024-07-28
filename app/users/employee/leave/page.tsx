"use client";

import { DateRange as DayPickerDateRange } from "react-day-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarClock, CalendarIcon, CircleHelp } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format, isWeekend, startOfDay } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import Loading from "./loading";
import Link from "next/link";
import { useUser } from "@/app/store";
import { createLeaveRequest } from "@/actions/leave/action";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useFetchLeaves from "@/hooks/useFetchLeaves";
import { PageHeader } from "@/components/shared/PageHeader";
import { UploadDropzone } from "@/utils/uploadthing";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  fullName: z.string().nullable(),
  email: z.string().nullable(),
  position: z.string().nullable(),
  phoneNumber: z
    .string()
    .trim()
    .min(10, {
      message: "Phone Number must have 10 digits.",
    })
    .max(10, {
      message: "Phone Number must have 10 digits.",
    }),

  requestFor: z.string({
    required_error: "You need to select a request.",
  }),
  reason: z.string().min(2, {
    message: "A reason is required.",
  }),
  date: z.string({
    message: "Please enter a valid date.",
  }),
});

const leaveTypes = [
  {
    type: "Annual Leave",
    description: "Paid time off granted for rest and relaxation.",
  },
  {
    type: "Sick Leave",
    description: "Time off provided when ill or need medical attention.",
  },
  {
    type: "Maternity Leave",
    description:
      "Leave granted to female employees for childbirth and postnatal care.",
  },
  {
    type: "Paternity Leave",
    description:
      "Leave granted to male employees for childbirth and care of the newborn.",
  },

  {
    type: "Bereavement Leave",
    description:
      "Time off to grieve and attend the funeral of a close relative.",
  },
  {
    type: "Unpaid Leave",
    description: "Time off without pay, for personal reasons.",
  },
  {
    type: "Study Leave",
    description: "Time off granted to pursue further education or training.",
  },
  {
    type: "Compassionate Leave",
    description: "Leave for urgent family matters or crises.",
  },
  {
    type: "Sabbatical Leave",
    description:
      "Extended leave granted for personal development or research, after a long period of service.",
  },
];

export default function LeaveForm() {
  const [date, setDate] = useState<DayPickerDateRange | undefined>(undefined);
  const [hoursDate, setHoursDate] = useState<Date>();

  const [selectedLeaveType, setSelectedLeaveType] = useState<string>("");
  const [requestFor, setRequestFor] = useState("Days");
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const router = useRouter();
  const leaveRequests = useFetchLeaves();
  const [documents, setDocuments] = useState<string[]>([]);

  const fullName = `${user.Name} ${user.Surname}`;
  const email = user.NDTEmail;
  const position = user.Position;

  const calculateWorkingDays = (startDate?: Date, endDate?: Date): number => {
    if (!startDate || !endDate) {
      return 0;
    }

    let workingDays = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (!isWeekend(currentDate)) {
        workingDays++;
      }
      currentDate = addDays(currentDate, 1);
    }

    return workingDays;
  };

  const totalDays = calculateWorkingDays(date?.from, date?.to);

  const handleDateSelect = (selectedDate:any) => {
    const today = new Date();
    if (selectedDate.from < today) {
      // Prevent selecting dates in the past
      return;
    }
    setDate(selectedDate);
  };

  const formattedHoursDate = `${
    addDays(hoursDate ?? new Date(), 1)
      .toISOString()
      .split("T")[0]
  }`;

  const formattedDate = `${
    addDays(date?.from ?? new Date(), 1)
      .toISOString()
      .split("T")[0]
  } to ${
    addDays(date?.to ?? new Date(), 1)
      .toISOString()
      .split("T")[0]
  }`;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      requestFor: "",
      reason: "",
      date: formattedDate,
      fullName: fullName,
      email: email,
      position: position,
    },
  });

  const handleLeaveTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedLeaveType(event.target.value);
  };

  const handleLeaveForChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRequestFor(event.target.value);
  };
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const formData = {
      fullName: fullName,
      email: email,
      phoneNumber: values.phoneNumber,
      position: position,
      requestFor: requestFor,
      leaveType: selectedLeaveType,
      reason: values.reason,
      date: requestFor === "Days" ? formattedDate : formattedHoursDate,
      totalDays: totalDays,
      userId: user.id,
      documents: documents,
    };
    try {
      await createLeaveRequest(formData);
      toast.success("Leave request has been created successfully.");
      router.refresh();
    } catch (error) {
      console.error("Error creating leave request:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {loading && <Loading />}
      <div className="mb-12">
        <PageHeader title="Leaves" Icon={CalendarClock} />
      </div>
      <div className="flex gap-x-8">
        <div className="border-2 border-primary p-4 rounded-xl w-1/3">
          <h3>Number of Annual Leave Days Left:</h3>
          <span>N/A</span>
        </div>
        <Link
          href={"/users/employee/leave/getRequests"}
          className="border-2 border-primary p-4 rounded-xl w-1/3"
        >
          <h3>View All Leave Requests</h3>
          <span>{leaveRequests.length}</span>
        </Link>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-x-12 justify-items-center space-y-8 bg-[rgba(162,161,168,0.05)] rounded-xl p-8 mt-8 mx-auto"
        >
          <div>
            <div className="grid grid-cols-2 gap-x-12">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-xl w-full pointer-events-none"
                        value={fullName}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-xl w-full pointer-events-none"
                        value={email}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-x-12">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your phone number"
                        {...field}
                        className="rounded-xl w-full placeholder:text-gray-500"
                      />
                    </FormControl>
                    <FormMessage style={{ color: "red" }} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Position</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-xl w-full pointer-events-none"
                        value={position}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <h2 className="text-center text-3xl font-semibold mt-8">
                Details of Leave Request
              </h2>
              <div className="flex justify-between items-center gap-x-2 my-12">
                <h2 className="text-xl font-medium">Leave Request For:</h2>
                <div className="flex items-center gap-x-2">
                  <div>
                    <label className="flex items-center gap-x-2">
                      <input
                        type="radio"
                        value="Days"
                        checked={requestFor === "Days"}
                        onChange={handleLeaveForChange}
                        className="custom-radio-input"
                      />
                      Days
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center gap-x-2">
                      <input
                        type="radio"
                        value="Half-Day"
                        checked={requestFor === "Half-Day"}
                        onChange={handleLeaveForChange}
                        className="custom-radio-input"
                      />
                      Half-Day
                    </label>
                  </div>
                </div>
              </div>
              <div>
                {requestFor === "Days" ? (
                  <>
                    <div className="flex items-end gap-x-16">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-md">
                              Date of Leave
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  id="date"
                                  variant={"outline"}
                                  className={cn(
                                    "w-[300px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {date?.from ? (
                                    date.to ? (
                                      <>
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                      </>
                                    ) : (
                                      format(date.from, "LLL dd, y")
                                    )
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  initialFocus
                                  mode="range"
                                  defaultMonth={date?.from}
                                  selected={date}
                                  onSelect={handleDateSelect}
                                  numberOfMonths={1}
                                  fromMonth={new Date()} // Set the first month shown to today
                                  weekStartsOn={1}
                                />
                              </PopoverContent>
                            </Popover>

                            <FormMessage style={{ color: "red" }} />
                          </FormItem>
                        )}
                      />

                      <div className="flex flex-col items-baseline gap-x-2">
                        <span>
                          Leave Start:{" "}
                          <span className="text-primary">
                            {date?.from
                              ? format(date.from, "LLL dd, y")
                              : new Date().toISOString().split("T")[0]}
                          </span>
                        </span>
                        <span>
                          Leave End:{" "}
                          <span className="text-primary">
                            {date?.to
                              ? format(date.to, "LLL dd, y")
                              : new Date().toISOString().split("T")[0]}
                          </span>
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-end gap-x-16">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-md">
                              Date of Leave
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {hoursDate ? (
                                    format(hoursDate, "LLL dd, y")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={hoursDate}
                                  onSelect={setHoursDate}
                                  initialFocus
                                  fromDate={new Date()}
                                  weekStartsOn={1}
                                />
                              </PopoverContent>
                            </Popover>

                            <FormMessage style={{ color: "red" }} />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="my-8">
                <div>
                  <h3 className="text-xl font-medium mb-8">Leave Type</h3>
                  <div className="grid grid-cols-3 items-center gap-4">
                    {leaveTypes.map((leave) => (
                      <TooltipProvider key={leave.type}>
                        <div className="flex items-center gap-x-2">
                          <input
                            type="radio"
                            id={leave.type}
                            name="leaveType"
                            value={leave.type}
                            checked={selectedLeaveType === leave.type}
                            onChange={handleLeaveTypeChange}
                            className="custom-radio-input"
                            required={true}
                          />
                          <label
                            htmlFor={leave.type}
                            className="flex items-center gap-x-2"
                          >
                            {leave.type}{" "}
                            <Tooltip>
                              <TooltipTrigger>
                                <CircleHelp width={"80%"} />
                              </TooltipTrigger>
                              <TooltipContent className="rounded-xl text-white font-semibold">
                                {leave.description}
                              </TooltipContent>
                            </Tooltip>
                          </label>
                        </div>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              </div>
              {selectedLeaveType === "Sick Leave" ? (
                <div className="grid gap-4 my-8">
                  <div>
                    <Label htmlFor="name" className="mb-1">
                      Attach Documents
                    </Label>
                    <UploadDropzone
                      appearance={{
                        label: "text-primary hover:text-secondary",
                        button: "bg-primary text-white rounded-xl",
                      }}
                      className=" border border-primary rounded-xl cursor-pointer custom-class"
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        // Do something with the response
                        setDocuments((prevDocs) => [...prevDocs, res[0].url]);
                        toast.success("Upload Completed");
                      }}
                      onUploadError={(error: Error) => {
                        // Do something with the error.
                        toast.error(`ERROR! ${error.message}`);
                      }}
                    />
                  </div>

                  {documents.map((docs, index) => (
                    <ol key={index} className="list-disc">
                      <li className=" ml-8">{docs}</li>
                    </ol>
                  ))}
                </div>
              ) : null}
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-medium">
                      Your Reason
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the reason for the leave request"
                        className="rounded-xl placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage style={{ color: "red" }} />
                  </FormItem>
                )}
              />{" "}
            </div>

            <Button type="submit" className="rounded-xl text-white mt-8">
              Request Leave
            </Button>
          </div>
          <div className="border border-primary p-4 rounded-xl h-1/2 w-[80%]">
            <h2 className="text-center text-2xl font-semibold">
              Your Request Leave Summary
            </h2>
            <div>
              <div className="flex justify-between items-center mx-8 mt-12">
                <label htmlFor="">Leave For: </label>
                <span className="font-bold text-xl">{requestFor}</span>
              </div>
              <div className="flex justify-between items-center mx-8 mt-12">
                <label htmlFor="">Leave Type: </label>
                <span className="font-bold text-xl">{selectedLeaveType}</span>
              </div>

              {requestFor === "Days" ? (
                <>
                  <div className="flex justify-between items-center mx-8 mt-12">
                    <label htmlFor="">Leave Period: </label>
                    <span className="font-bold text-xl">{formattedDate}</span>
                  </div>
                  <div className="flex justify-between items-center mx-8 mt-12">
                    <label htmlFor="">Number of Working Days Taken: </label>
                    <span className="font-bold text-xl">
                      {calculateWorkingDays(date?.from, date?.to)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mx-8 mt-12">
                    <label htmlFor="">Leave Day: </label>
                    <span className="font-bold text-xl">
                      {formattedHoursDate}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
