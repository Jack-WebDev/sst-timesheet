"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";

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

import { Input } from "@/components/ui/input";

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { TimesheetProps } from "@/types/timesheetProps";
import useFetchTimesheets from "@/hooks/useFetchTimesheets";
import { useThemeStore, useUser } from "@/app/store";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Timesheet() {
  const timesheetsData = useFetchTimesheets();
  const [data, setFilteredTimesheets] = useState<TimesheetProps[]>([]);
  const user = useUser();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (timesheetsData) {
      const formattedUserFullName =
        `${user.Name.trim()} ${user.Surname.trim()}`.toLowerCase();

      const userTimesheets = timesheetsData.filter((timesheet) => {
        const formattedProjectManagerName = timesheet.projectManager
          .trim()
          .toLowerCase();

        const isApprovedBy = timesheet.Approval_Status.includes("Approved by");
        const isRejectedBy = timesheet.Approval_Status.includes("Rejected by");

        return (
          isApprovedBy ||
          isRejectedBy ||
          (formattedProjectManagerName === formattedUserFullName &&
            timesheet.Approval_Status.includes("Pending"))
        );
      });

      setFilteredTimesheets(userTimesheets);
    }
  }, [timesheetsData, user.Name, user.Surname]);

  const handleApprove = async (id: string) => {
    await axios.put(`/api/timesheets/${id}`, {
      Approval_Status: `Approved`,
    });
    window.location.reload();
  };

  const handleReject = async (id: string) => {
    await axios.put(`/api/timesheets/${id}`, {
      Approval_Status: `Rejected`,
    });
    window.location.reload();
  };

  const columns: ColumnDef<TimesheetProps>[] = [
    {
      accessorKey: "Approval_Status",
      header: "Approval Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("Approval_Status")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "projectName",
      header: "Project Name",
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
      cell: ({ row }) => {
        const timesheet = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Dialog>
                <DialogTrigger asChild>
                  <span className="cursor-pointer">
                    <DotsHorizontalIcon className="h-4 w-4" />
                  </span>
                </DialogTrigger>
                <DialogContent className="w-[70%]">
                  <DialogHeader>
                    <DialogTitle className="flex justify-around items-center text-2xl">
                      Timesheet Details for : {timesheet.name}
                      <span className="text-xl">
                        Weekly Period:{" "}
                        <b className="text-primary">{timesheet.weeklyPeriod}</b>
                      </span>
                    </DialogTitle>
                  </DialogHeader>
                  <div>
                    <table className="w-full">
                      <thead>
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
                          timesheet.tableRows?.map((r) => (
                            <tr
                              key={r.id}
                              className="text-center border-b border-secondary"
                            >
                              <td>
                                <p>{r.weekday}</p>
                              </td>

                              <td>
                                <p>
                                  {r.typeOfDay === "" ? "N/A" : r.typeOfDay}
                                </p>
                              </td>

                              <td>
                                <p>{`${r.totalHours} hrs ${r.totalMinutes} mins`}</p>
                              </td>
                              <td className="text-center">
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
                              <td className="text-center">
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

                              <td className="text-center">
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
                              <td className="text-center">
                                <p>{r.comment === "" ? "N/A" : r.comment}</p>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    <div className="flex justify-evenly items-end mt-4 approval_process">
                      <div>
                        <h2 className="font-semibold">
                          Supervisor&apos;s comments:
                        </h2>
                        <p>
                          {timesheet.comments === ""
                            ? "No comment."
                            : timesheet.comments}
                        </p>
                      </div>
                      <div className="btns flex items-end gap-x-4 justify-items-end">
                        <Button
                          onClick={() => handleApprove(timesheet.id)}
                          className="bg-green-500 text-white rounded-xl hover:bg-green-400"
                        >
                          <FaThumbsUp color="white" className="mr-2" /> Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(timesheet.id)}
                          className="bg-red-500 text-white rounded-xl hover:bg-red-400"
                        >
                          <FaThumbsDown color="white" className="mr-2" /> Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </DropdownMenuTrigger>
          </DropdownMenu>
        );
      },
    },
  ];

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
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
      <div className="timesheets-container w-[80%] mx-auto">
        <div className="w-full  p-4 rounded-xl border-2 border-primary">
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
              className="max-w-sm rounded-xl"
            />
          </div>
          <div>
            <Table className="rounded-xl">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
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
                      className="h-24 text-center text-secondary font-semibold text-2xl"
                    >
                      No timesheets to approve for now.
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
              {table.getState().pagination.pageIndex} of{" "}
              {table.getPageCount().toLocaleString()}
            </strong>
          </span>
        </div>
      </div>
    </>
  );
}
