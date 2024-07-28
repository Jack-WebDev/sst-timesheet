"use client";

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

import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { useThemeStore, useUser } from "@/app/store";
import ApproveTimesheet from "@/components/dialogUI/ApproveTimesheet";
import { TimesheetProps } from "@/types/timesheetProps";

import useFetchTimesheets from "@/hooks/useFetchTimesheets";
import useFetchLeaveRequest from "@/hooks/useFetchLeaves";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaEye } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

type LeaveRequestProps = {
  userId: string;
  fullName: string;
  reason: string;
  approvalStatus: string;
  leaveType: string;
  date: string;
  totalHours?: number;
  totalDays?: number;
  requestFor: string;
  comments: string;
  id: string;
};

export default function Timesheet() {
  const data = useFetchLeaveRequest();
  const { isDarkMode } = useThemeStore();
  const router = useRouter();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<LeaveRequestProps>[] = [
    {
      accessorKey: "approvalStatus",
      header: "Approval Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("approvalStatus")}</div>
      ),
    },
    {
      accessorKey: "leaveType",
      header: "Leave Type",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("leaveType")}</div>
      ),
    },
    {
      accessorKey: "requestFor",
      header: "Request For",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("requestFor")}</div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date Requested",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("date")}</div>
      ),
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-start">Actions</div>,
      sortDescFirst: true,
      enableSorting: true,
      cell: ({ row }) => {
        const leaveRequest = row.original;
        const statusClass =
          leaveRequest.approvalStatus === "Pending"
            ? "text-yellow-500 font-semibold"
            : leaveRequest.approvalStatus.includes("Rejected")
            ? "text-red-500 font-semibold font-semibold"
            : leaveRequest.approvalStatus.includes("Approved")
            ? "text-green-700 font-semibold"
            : "";

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="cursor-pointer">
                      <DotsHorizontalIcon className="h-4 w-4" />
                    </span>
                  </DialogTrigger>
                  <DialogContent className="w-[70%] text-black">
                    <DialogHeader className="flex flex-row items-baseline justify-around">
                      <DialogTitle>Leave Request Details</DialogTitle>
                      <div className="grid text-xl">
                        <div className="flex gap-x-2">
                          Approval Status:{" "}
                          <span className={statusClass}>
                            {leaveRequest.approvalStatus}
                          </span>
                        </div>
                      </div>
                    </DialogHeader>
                    <div>
                      <table className="generate w-full">
                        <thead className="text-black">
                          <tr>
                            <th>Leave Type</th>
                            <th>Date Requested</th>
                            <th>Request For</th>
                            {leaveRequest.requestFor === "Days" ? (
                              <th>Total Days</th>
                            ) : (
                              null
                            )}
                            <th>Reason</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="text-center">
                              {leaveRequest.leaveType}
                            </td>
                            <td className="text-center">{leaveRequest.date}</td>
                            <td className="text-center">
                              {leaveRequest.requestFor}
                            </td>
                            {leaveRequest.requestFor === "Days" ? (
                              <td className="text-center">
                                {leaveRequest.totalDays}
                              </td>
                            ) : (
                              null
                            )}

                            <td className="text-center">
                              {leaveRequest.reason}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="w-[90%] mt-8 mx-auto">
                        <h2>Supervisor&apos;s comments:</h2>
                        <p>{leaveRequest.comments}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </DropdownMenuTrigger>
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
      <div className="timesheets-container w-[80%] mx-auto mt-12">
        <div className="w-full p-4 rounded-xl border-2 border-primary">
          <div>
            <Table className="rounded-xl">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
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
                      No leave requests for now.
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
