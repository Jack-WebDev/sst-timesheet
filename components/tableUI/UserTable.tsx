"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { toast } from "react-toastify";
import useFetchUsers from "../../hooks/useFetchUsers";
import { UserProps } from "@/types/userProps";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import { Input } from "@/components/ui/input";


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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {FaEye, FaTrash } from "react-icons/fa";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useThemeStore } from "@/app/store";



const UserTable = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [data, setFilteredUsers] = useState<UserProps[]>([]);
  const [filter, setFilter] = useState<string>("");
  const userData = useFetchUsers();
  const { isDarkMode } = useThemeStore();
  const router = useRouter();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const handleViewUser = (user: UserProps) => {
    router.push(`/users/admin/employees/${user.id}`);
  }



  const columns: ColumnDef<UserProps>[] = [
    {
      accessorKey: "Name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("Name")}</div>
      ),
    },
    {
      accessorKey: "Surname",
      header: "Surname",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("Surname")}</div>
      ),
    },
    {
      accessorKey: "departmentName",
      header: "Department",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("departmentName")}</div>
      ),
    },
    {
      accessorKey: "Position",
      header: "Position",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("Position")}</div>
      ),
    },
    {
      accessorKey: "EmployeeType",
      header: "Employee Type",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("EmployeeType")}</div>
      ),
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-start">Actions</div>,
      sortDescFirst: true,
      enableSorting: true,
      cell: ({ row }) => {

        return (
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white rounded-xl">
            <DropdownMenuItem className="flex gap-x-2" onClick={() => handleViewUser(row.original)}><FaEye/> View</DropdownMenuItem>
            <DropdownMenuItem className="flex gap-x-2" onClick={() => handleDelete(row.original.id)}><FaTrash/> Delete</DropdownMenuItem>
          </DropdownMenuContent>
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

  useEffect(() => {
    if (userData) {
      setUsers(userData);
      setFilteredUsers(userData);
    }
  }, [userData]);

  const handleDelete = async (id: string) => {

    try {
      const res = await axios.delete(`/api/users/${id}`);
      router.refresh();
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error(
        "An error occured while deleting user. Please reload and try again."
      );
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilter(searchTerm);
    const filtered = users.filter(
      (user) =>
        user.Name.toLowerCase().includes(searchTerm) ||
        user.departmentName?.toLowerCase().includes(searchTerm) ||
        user.EmployeeType?.toLowerCase().includes(searchTerm)
    );
    setFilteredUsers(filtered);
  };

  return (
    <>
    <div className="w-full p-4 rounded-xl border-2 border-primary">
    <div className="flex justify-between items-center py-4">
      <Input
        placeholder="Filter by name, department or employee type...."
        value={filter}
        onChange={(event) =>
          handleFilterChange(event)
        }
        className="max-w-sm px-4 py-1 border border-black focus:outline-primary rounded-xl"
      />
      <Button className="rounded-xl text-white" onClick={() => router.push("/users/admin/employees/addEmployee")}>Add New User</Button>
    </div>


    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-b border-secondary"
            >
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
                className="h-24 text-center font-bold text-xl text-secondary"
              >
                No employees for now.
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

export default UserTable;
