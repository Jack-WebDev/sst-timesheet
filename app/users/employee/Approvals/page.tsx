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
import { ArrowUpDown, Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";

export default function Timesheet() {
  const timesheetData = useFetchTimesheets();
  const {isDarkMode} = useThemeStore();
  const [data, setFilteredTimesheets] = useState<TimesheetProps[]>([]);


  const user = useUser();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<TimesheetProps>[] = [
    {
      accessorKey: "Approval_Status",
      header: "Approval Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("Approval_Status")}</div>
      ),
    },
    {
      accessorKey: "projectName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Project(s)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (<div className="capitalize">{row.getValue("projectName")}</div>),
    },
    {
      accessorKey: "name",
      header: "Employee Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-start">Actions</div>,
      cell: ({ row }) => {
        const timesheet = row.original;
        return <ApproveTimesheet timesheet={timesheet} />;
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

  useEffect(() => {
    if (timesheetData) {
      const formattedUserFullName =
        `${user.Name.trim()} ${user.Surname.trim()}`.toLowerCase();

      const userTimesheets = timesheetData.filter((timesheet: any) => {
        const formattedProjectManagerName = timesheet.projectManager
          .trim()
          .toLowerCase();
        return (
          formattedProjectManagerName === formattedUserFullName &&
          timesheet.Approval_Status === "Pending"
        );
      });

      setFilteredTimesheets(userTimesheets);
    }
  }, [timesheetData, user.Name, user.Surname]);

  return (
    <>
    <PageHeader title="Approvals" Icon={Check} />
      <div className="timesheets-container w-[80%] mx-auto mt-12">
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
                      className={`${isDarkMode ? "text-white" : "text-black odd:bg-white even:bg-slate-100 "}`}

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
                      No timesheets to approve.
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
