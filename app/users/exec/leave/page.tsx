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
import { useThemeStore } from "@/app/store";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,

} from "lucide-react";

import axios from "axios";
import LeaveApprovals from "@/app/users/exec/_components/LeaveApprovals";

type LeaveRequestProps = {
  userId: string;
  fullName: string;
  approvalStatus: string;
  reason: string;
  leaveType: string;
  date: string;
  totalHours?: number;
  totalDays?: number;
  requestFor: string;
  id: string;
};

export default function Timesheet() {
  const { isDarkMode } = useThemeStore();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<LeaveRequestProps[]>([]);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const res = await axios.get<LeaveRequestProps[]>("/api/leave");
        const leaveRequests = res.data;

        const pendingLeaveRequests = leaveRequests.filter(
          (leaveRequest) => leaveRequest.approvalStatus === "Pending"
        );

        setData(pendingLeaveRequests);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    };

    fetchLeaveRequests();
  }, []);

  const handleApprove = async (id: string) => {
    await axios.put(`/api/leave/${id}`, {
      approvalStatus: `Approved`,
      comments: comment ? comment : "No comment",
    });
    window.location.reload();
  };

  const handleReject = async (id: string) => {
    await axios.put(`/api/leave/${id}`, {
      approvalStatus: `Rejected`,
      comments: comment ? comment : "No comment",
    });
    window.location.reload();
  };

  const columns: ColumnDef<LeaveRequestProps>[] = [
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

        return <LeaveApprovals leaveRequest={leaveRequest} />;
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
                      No leave requests to approve for now.
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
