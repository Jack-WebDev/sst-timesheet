"use client";

import {
  ChevronsRight,
  ChevronRight,
  ChevronsLeft,
  ChevronLeft,
  MoreHorizontal,
  Eye,
  ArrowUpDown,
  EllipsisIcon,
  ArrowBigLeft,
  ArrowLeft,
} from "lucide-react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useEffect, useRef, useState } from "react";
import { useThemeStore, useUser } from "@/app/store";
import { TimesheetProps } from "@/types/timesheetProps";
import { Project } from "@/types/projectProps";

import useFetchTimesheets from "@/hooks/useFetchTimesheets";
import useFetchProjects from "@/hooks/useFetchProjects";
import useFetchUsers from "@/hooks/useFetchUsers";
import { UserProps } from "@/types/userProps";
import { FaEye, FaFilePdf } from "react-icons/fa";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

const styles = StyleSheet.create({
  viewer: { width: "100%", height: "50vh" },
  page: { padding: 30 },
  section: { marginBottom: 10 },
  heading: { fontSize: 20, marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 5 },
  table: { width: "auto", marginBottom: 20 },
  tableRow: { flexDirection: "row" },
  tableCol: { flex: 1 },
  tableCell: { margin: 5, fontSize: 10 },
});

export default function TimesheetDeatils() {
  const timesheetData = useFetchTimesheets();
  const projectsData = useFetchProjects();
  const userData = useFetchUsers();
  const { isDarkMode } = useThemeStore();
  const [data, setFilteredTimesheets] = useState<TimesheetProps[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<UserProps[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProps[]>([]);
  const [query, setQuery] = useState<string>("");
  const router = useRouter();

  const userZ = useUser();

  const modalRef = useRef(null);
  const [showPDF, setShowPDF] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] =
    useState<TimesheetProps | null>(null);

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

  const handleViewTimesheet = (timesheet: TimesheetProps) => {
    setSelectedTimesheet(timesheet);
    setDialogOpen(true);
  };

  const handleClosePDF = () => {
    setShowPDF(false);
  };

  const handleGeneratePDF = (timesheet: TimesheetProps) => {
    setSelectedTimesheet(timesheet);
    setShowPDF(true);
  };

  const TimesheetDialog = ({ timesheet, closeDialog }: any) => {
    const statusClass =
      timesheet.Approval_Status === "Pending"
        ? "text-yellow-500 font-semibold"
        : timesheet.Approval_Status.includes("Rejected")
        ? "text-red-500 font-semibold font-semibold"
        : timesheet.Approval_Status.includes("Approved")
        ? "text-green-700 font-semibold"
        : "";
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Dialog open={true} onOpenChange={closeDialog}>
            <DialogTrigger asChild>
              <span className="cursor-pointer">
                <EllipsisIcon className="h-4 w-4" />
              </span>
            </DialogTrigger>
            <DialogContent ref={modalRef} className="w-[70%] text-black">
              <DialogHeader className="flex flex-row items-baseline justify-around">
                <DialogTitle>Timesheet Details</DialogTitle>
                <div className="grid text-xl">
                  <div className="flex">
                    Approval Status:
                    <span className={statusClass}>
                      {timesheet.Approval_Status}
                    </span>
                  </div>
                </div>
              </DialogHeader>
              <div>
                <table className="generate w-full">
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
                    {timesheet &&
                      timesheet.tableRows &&
                      timesheet.tableRows?.map((r: any) => (
                        <tr key={r.id} className="border-b border-secondary">
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
                              r.tasks.map((t: any) => (
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
                              r.tasks.map((t: any) => (
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
                              r.tasks.map((t: any) => (
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
                      ))}
                  </tbody>
                </table>

                <div className="mt-4">
                  <h2 className="font-semibold text-black">
                    Supervisor&apos;s comments:
                  </h2>
                  <p className="text-black">
                    {timesheet.comments === ""
                      ? "No comment."
                      : timesheet.comments}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </DropdownMenuTrigger>
      </DropdownMenu>
    );
  };

  const GeneratePDF = ({ timesheet, onClose }: any) => {
    return (
      <div className="absolute z-10 top-[20%] left-[25%] right-[5%] bottom-0">
        <div className="w-full bg-gray-400 rounded-t-xl py-4 pl-4">
          <Button
            variant={"default"}
            onClick={onClose}
            className="text-[1.5rem] font-semibold w-[20%] h-[5vh]"
          >
            Close PDF
          </Button>
        </div>
        <PDFViewer style={styles.viewer}>
          <Document>
            <Page size="A4" style={styles.page}>
              <View style={styles.section}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.heading}>Timesheet Details</Text>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={styles.text}>Approval Status:</Text>
                    <Text style={styles.text}>{timesheet.Approval_Status}</Text>
                  </View>
                </View>
                <View style={styles.table}>
                  <View
                    style={[styles.tableRow, { backgroundColor: "#f0f0f0" }]}
                  >
                    <Text style={[styles.tableCol, styles.tableCell]}>
                      Weekday
                    </Text>
                    <Text style={[styles.tableCol, styles.tableCell]}>
                      Type Of Day
                    </Text>
                    <Text style={[styles.tableCol, styles.tableCell]}>
                      Total Time
                    </Text>
                    <Text style={[styles.tableCol, styles.tableCell]}>
                      Project Name
                    </Text>
                    <Text style={[styles.tableCol, styles.tableCell]}>
                      Tasks Performed
                    </Text>
                    <Text style={[styles.tableCol, styles.tableCell]}>
                      Task Status
                    </Text>
                    <Text style={[styles.tableCol, styles.tableCell]}>
                      Comment
                    </Text>
                  </View>
                  {timesheet?.tableRows?.map((r: any) => (
                    <View key={r.id} style={styles.tableRow}>
                      <Text style={[styles.tableCol, styles.tableCell]}>
                        {r.weekday}
                      </Text>
                      <Text style={[styles.tableCol, styles.tableCell]}>
                        {r.typeOfDay || "N/A"}
                      </Text>
                      <Text
                        style={[styles.tableCol, styles.tableCell]}
                      >{`${r.totalHours} hrs ${r.totalMinutes} mins`}</Text>
                      <Text style={[styles.tableCol, styles.tableCell]}>
                        {r.tasks.length > 0
                          ? r.tasks
                              .map((t: any) => t.projectName || "N/A")
                              .join(", ")
                          : "N/A"}
                      </Text>
                      <Text style={[styles.tableCol, styles.tableCell]}>
                        {r.tasks.length > 0
                          ? r.tasks
                              .map((t: any) => t.taskPerformed || "N/A")
                              .join(", ")
                          : "N/A"}
                      </Text>
                      <Text style={[styles.tableCol, styles.tableCell]}>
                        {r.tasks.length > 0
                          ? r.tasks.map((t: any) => t.taskStatus).join(", ")
                          : "N/A"}
                      </Text>
                      <Text style={[styles.tableCol, styles.tableCell]}>
                        {r.comment || "N/A"}
                      </Text>
                    </View>
                  ))}
                </View>
                <View style={styles.section}>
                  <Text style={{ fontSize: 14, marginTop: 10 }}>
                    Supervisor&apos;s comments:
                  </Text>
                  <Text style={styles.text}>
                    {timesheet.comments || "No comment."}
                  </Text>
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      </div>
    );
  };

  const columns: ColumnDef<TimesheetProps>[] = [
    {
      accessorKey: "weeklyPeriod",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Weekly Period
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("weeklyPeriod")}</div>
      ),
    },
    {
      accessorKey: "Approval_Status",
      header: "Approval Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("Approval_Status")}</div>
      ),
    },
    {
      accessorKey: "projectName",
      header: "Project(s)",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("projectName")}</div>
      ),
    },

    {
      accessorKey: "projectManager",
      header: "Supervisor",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("projectManager")}</div>
      ),
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-start">Actions</div>,
      sortDescFirst: true,
      enableSorting: true,
      cell: ({ row }) => {
        const timesheet = row.original;

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white rounded-xl">
                <DropdownMenuLabel className="border-b border-primary">
                  Actions
                </DropdownMenuLabel>

                <DropdownMenuItem
                  onClick={() => handleViewTimesheet(timesheet)}
                  className="cursor-pointer flex items-center gap-x-2"
                >
                  <FaEye /> View Timesheet
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleGeneratePDF(timesheet)}
                  className="cursor-pointer flex items-center gap-x-2"
                >
                  <FaFilePdf /> Generate PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <>
      <ArrowLeft onClick={() => router.back()} className="cursor-pointer" />
      <h2 className="text-center text-5xl my-12 text-secondary font-medium">
        Your Timesheets
      </h2>
      <div className="timesheets-container w-[80%] mx-auto">
        <div className="w-full p-4 rounded-xl border-2 border-primary">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter by project name...."
              value={
                (table.getColumn("projectName")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("projectName")
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm px-4 py-1 border border-primary bg-transparent rounded-xl"
            />
          </div>

          <div>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className="text-[1rem] font-medium"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={`${
                        isDarkMode
                          ? "text-white"
                          : "text-black odd:bg-white even:bg-slate-100 "
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center font-bold text-xl text-secondary"
                    >
                      No timesheets for now.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex justify-center flex-col items-center gap-2 mt-12">
          <div className="flex items-center gap-4">
            <Button
              variant={"default"}
              className="border rounded p-1"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft />
            </Button>
            <Button
              variant={"default"}
              className="border rounded p-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant={"default"}
              className="border rounded p-1"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight />
            </Button>
            <Button
              variant={"default"}
              className="border rounded p-1"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight />
            </Button>
          </div>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount().toLocaleString()}
            </strong>
          </span>
        </div>
      </div>
      {isDialogOpen && selectedTimesheet && (
        <TimesheetDialog
          timesheet={selectedTimesheet}
          closeDialog={() => setDialogOpen(false)}
        />
      )}
      {showPDF && (
        <GeneratePDF timesheet={selectedTimesheet} onClose={handleClosePDF} />
      )}
    </>
  );
}
