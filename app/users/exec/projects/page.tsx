"use client";

import React, { useState, useEffect } from "react";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Project } from "@/types/projectProps";
import useFetchProjects from "@/hooks/useFetchProjects";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useThemeStore } from "@/app/store";

const ProjectTable = () => {
  const projectsData = useFetchProjects();
  const [data, setProjects] = useState<Project[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { isDarkMode } = useThemeStore();


  useEffect(() => {
    if (projectsData) {
      setProjects(projectsData);
    }
  }, [projectsData]);

  const truncateText = (text: string, wordLimit: number) => {
    if (!text) return "No Description";

    const words = text.split(" ");

    if (words.length > 1) {
      if (words.length <= wordLimit) {
        return text;
      }
      return words.slice(0, wordLimit).join(" ") + ".....";
    }

    if (text.length <= 15) {
      return text;
    }
    return text.slice(0, 15) + ".....";
  };

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "Project_Name",
      header: "Project Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("Project_Name")}</div>
      ),
    },
    {
      accessorKey: "Client_Name",
      header: "Client Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("Client_Name")}</div>
      ),
    },
    {
      accessorKey: "Project_Manager",
      header: "Project Manager",
      cell: ({ row }) => (
        <div className="capitalize">
          {truncateText(row.getValue("Project_Manager"), 5)}
        </div>
      ),
    },

    {
      accessorKey: "actions",
      header: () => <div className="text-start">Actions</div>,
      cell: ({ row }) => {
        const project = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Dialog>
                <DialogTrigger asChild>
                  <span className="cursor-pointer">
                    <DotsHorizontalIcon className="h-4 w-4" />
                  </span>
                </DialogTrigger>
                <DialogContent className="w-[25%]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">
                      Project Details
                    </DialogTitle>
                  </DialogHeader>
                  <div>
                    <div className="flex  items-center gap-4 mb-4">
                      <Label htmlFor="projectName" className="text-[1.3rem]">
                        Project Name:
                      </Label>
                      <p className="text-[1.1rem]">{project.Project_Name}</p>
                    </div>
                    <div className="flex  items-center gap-4 mb-4">
                      <Label htmlFor="projectName" className="text-[1.3rem]">
                        Project Manager:
                      </Label>
                      <p className="text-[1.1rem]">{project.Project_Manager}</p>
                    </div>
                    <div className="flex  items-center gap-4 mb-4">
                      <Label htmlFor="projectName" className="text-[1.3rem]">
                        Client Name:
                      </Label>
                      <p className="text-[1.1rem]">{project.Client_Name}</p>
                    </div>
                    <div className="flex  items-center gap-4 mb-4">
                      <Label htmlFor="projectName" className="text-[1.3rem]">
                        Project Description:
                      </Label>
                      <p className="text-[1.1rem]">{project.Description}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <Label htmlFor="projectName" className="text-[1.3rem]">
                        Project Team:
                      </Label>
                      <p className="flex">
                        {project?.assignedMembers?.map((member, index) => (
                          <div key={index} className="flex">
                            <span className="text-[1.1rem]">
                              {index !== 0 && ", "}
                              {member}
                            </span>
                          </div>
                        ))}
                      </p>
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
    <div className="w-[90%] mx-auto border-2 p-4 border-primary rounded-xl">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by project name...."
          value={
            (table.getColumn("Project_Name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("Project_Name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm rounded-xl"
        />
      </div>
      <div>
        <Table className="p-4 rounded-xl">
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
                  No projects.
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
    </>
  );
};

export default ProjectTable;
